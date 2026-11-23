import hmac
import hashlib
import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional
import aio_pika
from backend.app.consumers.base import BaseConsumer
from backend.app.core.config import settings
from backend.app.core.razorpay_service import process_refund
from backend.app.db.mongodb import db_manager, memory_db
from backend.app.producers.events import emit_whatsapp_dispatch
from backend.app.services.invoice_service import invoice_service

logger = logging.getLogger("homies.payment_worker")

class PaymentWorker(BaseConsumer):
    """
    Consumer worker for queue:payments.
    Handles:
    - payment.webhook_received (Razorpay async payment.captured / payment.failed / order.paid reconciliation)
    - payment.refund_requested (Automated instant Razorpay refund execution)
    """
    def __init__(self):
        super().__init__(
            queue_name=settings.QUEUE_PAYMENTS,
            prefetch_count=20,
            worker_name="PaymentWorker",
        )

    async def process_event(
        self,
        event_type: str,
        data: Dict[str, Any],
        raw_message: aio_pika.abc.AbstractIncomingMessage
    ):
        if event_type == "payment.webhook_received":
            await self._handle_webhook_event(data)
        elif event_type == "payment.refund_requested":
            await self._handle_refund_request(data)
        else:
            logger.info(f"[PaymentWorker] Unhandled event type: {event_type}")

    async def _handle_webhook_event(self, data: Dict[str, Any]):
        webhook_event = data.get("webhook_event")
        raw_payload = data.get("raw_payload", {})
        signature = data.get("signature")

        # Optional signature verification validation
        if settings.RAZORPAY_WEBHOOK_SECRET and signature:
            # Reconstruct body for HMAC check
            expected_sig = hmac.new(
                settings.RAZORPAY_WEBHOOK_SECRET.encode("utf-8"),
                json.dumps(raw_payload).encode("utf-8"),
                hashlib.sha256
            ).hexdigest()
            # If not exact due to formatting, allow if simulated/dev
            if expected_sig != signature and settings.ENVIRONMENT != "development":
                logger.warning(f"[PaymentWorker] Invalid webhook signature detected for event={webhook_event}")

        payload_data = raw_payload.get("payload", {})
        payment_entity = payload_data.get("payment", {}).get("entity", {})
        order_entity = payload_data.get("order", {}).get("entity", {})

        rzp_order_id = payment_entity.get("order_id") or order_entity.get("id") or data.get("razorpay_order_id")
        rzp_payment_id = payment_entity.get("id") or data.get("payment_id")

        logger.info(f"[PaymentWorker] Reconciling webhook event={webhook_event} rzp_order={rzp_order_id} rzp_pay={rzp_payment_id}")

        if webhook_event in ("payment.captured", "order.paid"):
            # Update order state in database
            target_order = None
            if db_manager.is_connected and db_manager.db is not None:
                target_order = await db_manager.db.orders.find_one_and_update(
                    {"razorpay_order_id": rzp_order_id},
                    {
                        "$set": {
                            "payment_status": "PAID",
                            "status": "Confirmed",
                            "razorpay_payment_id": rzp_payment_id,
                            "updated_at": datetime.utcnow()
                        }
                    },
                    return_document=True
                )
            else:
                for internal_id, order in memory_db["orders"].items():
                    if order.get("razorpay_order_id") == rzp_order_id or order.get("order_id") == rzp_order_id:
                        order["payment_status"] = "PAID"
                        order["status"] = "Confirmed"
                        order["razorpay_payment_id"] = rzp_payment_id
                        target_order = order
                        break

            # If order exists, ensure tax invoice is generated & send payment receipt via WhatsApp
            if target_order:
                order_id = target_order.get("order_id") or target_order.get("id")
                if not target_order.get("invoice_url"):
                    inv_meta = invoice_service.generate_invoice(target_order)
                    if db_manager.is_connected and db_manager.db is not None:
                        await db_manager.db.orders.update_one(
                            {"$or": [{"order_id": order_id}, {"id": order_id}]},
                            {"$set": {"invoice_url": inv_meta.get("invoice_url")}}
                        )

                phone = target_order.get("phone")
                if phone:
                    await emit_whatsapp_dispatch(
                        phone=phone,
                        template="order_confirmed",
                        params={
                            "customer_name": target_order.get("customer_name"),
                            "order_id": order_id,
                            "total": target_order.get("total"),
                            "items": target_order.get("items", []),
                            "address": target_order.get("address"),
                            "city": target_order.get("city"),
                            "pincode": target_order.get("pincode"),
                        },
                        order_id=order_id,
                    )
                logger.info(f"[PaymentWorker] ✅ Order {order_id} marked PAID and reconciled.")

        elif webhook_event == "payment.failed":
            if db_manager.is_connected and db_manager.db is not None:
                await db_manager.db.orders.update_one(
                    {"razorpay_order_id": rzp_order_id},
                    {"$set": {"payment_status": "FAILED", "updated_at": datetime.utcnow()}}
                )
            else:
                for o in memory_db["orders"].values():
                    if o.get("razorpay_order_id") == rzp_order_id:
                        o["payment_status"] = "FAILED"
                        break
            logger.info(f"[PaymentWorker] ⚠️ Payment marked FAILED for rzp_order={rzp_order_id}")

    async def _handle_refund_request(self, data: Dict[str, Any]):
        payment_id = data.get("payment_id")
        amount = data.get("amount")
        order_id = data.get("order_id")
        notes = data.get("notes")

        logger.info(f"[PaymentWorker] Processing Razorpay refund for payment={payment_id} order={order_id} amount={amount}...")
        
        # 1. Execute refund with Razorpay API (with simulation fallback)
        refund_res = await process_refund(
            payment_id=payment_id,
            amount=amount,
            order_id=order_id,
            notes=notes,
        )

        refund_id = refund_res.get("refund_id", "REFUND_UNKNOWN")
        logger.info(f"[PaymentWorker] ✅ Refund processed with ID: {refund_id}")

        # 2. Retrieve customer details and dispatch WhatsApp refund confirmation
        customer_phone = None
        customer_name = "Customer"
        if db_manager.is_connected and db_manager.db is not None:
            order = await db_manager.db.orders.find_one({"$or": [{"order_id": order_id}, {"id": order_id}]})
            if order:
                customer_phone = order.get("phone")
                customer_name = order.get("customer_name")
        else:
            for o in memory_db["orders"].values():
                if o.get("order_id") == order_id or o.get("id") == order_id:
                    customer_phone = o.get("phone")
                    customer_name = o.get("customer_name")
                    break

        if customer_phone:
            await emit_whatsapp_dispatch(
                phone=customer_phone,
                template="refund_processed",
                params={
                    "customer_name": customer_name,
                    "order_id": order_id,
                    "amount": amount,
                    "refund_id": refund_id,
                },
                order_id=order_id,
            )
