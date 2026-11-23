import logging
from typing import Dict, Any
import aio_pika
from backend.app.consumers.base import BaseConsumer
from backend.app.core.config import settings
from backend.app.db.mongodb import db_manager, memory_db
from backend.app.services.invoice_service import invoice_service
from backend.app.producers.events import emit_whatsapp_dispatch

logger = logging.getLogger("homies.order_worker")

class OrderWorker(BaseConsumer):
    """
    Consumer worker for queue:orders.
    Handles order.created:
    1. Generates PDF Tax Invoice via ReportLab asynchronously.
    2. Persists invoice URL & number to MongoDB / memory DB.
    3. Emits notification.whatsapp_dispatch event for instant customer confirmation.
    """
    def __init__(self):
        super().__init__(
            queue_name=settings.QUEUE_ORDERS,
            prefetch_count=20,
            worker_name="OrderWorker",
        )

    async def process_event(
        self,
        event_type: str,
        data: Dict[str, Any],
        raw_message: aio_pika.abc.AbstractIncomingMessage
    ):
        if event_type == "order.created":
            await self._handle_order_created(data)
        else:
            logger.info(f"[OrderWorker] Unhandled event type: {event_type}")

    async def _handle_order_created(self, order_data: Dict[str, Any]):
        order_id = order_data.get("order_id") or order_data.get("id")
        logger.info(f"[OrderWorker] Generating Tax Invoice for order {order_id}...")

        # 1. Generate PDF Tax Invoice
        invoice_meta = invoice_service.generate_invoice(order_data)
        invoice_url = invoice_meta.get("invoice_url")
        invoice_number = invoice_meta.get("invoice_number")

        # 2. Persist Invoice Metadata to Order Record in Database
        if db_manager.is_connected and db_manager.db is not None:
            await db_manager.db.orders.update_one(
                {"$or": [{"order_id": order_id}, {"id": order_id}]},
                {"$set": {"invoice_url": invoice_url, "invoice_number": invoice_number}}
            )
        else:
            for internal_id, order in memory_db["orders"].items():
                if order.get("order_id") == order_id or order.get("id") == order_id:
                    order["invoice_url"] = invoice_url
                    order["invoice_number"] = invoice_number
                    break

        logger.info(f"[OrderWorker] ✅ Tax invoice {invoice_number} attached to order {order_id}.")

        # 3. Emit Async WhatsApp Confirmation
        customer_phone = order_data.get("phone")
        if customer_phone:
            await emit_whatsapp_dispatch(
                phone=customer_phone,
                template="order_confirmed",
                params={
                    "customer_name": order_data.get("customer_name"),
                    "order_id": order_id,
                    "total": order_data.get("total"),
                    "items": order_data.get("items", []),
                    "address": order_data.get("address"),
                    "city": order_data.get("city"),
                    "pincode": order_data.get("pincode"),
                    "invoice_url": invoice_url,
                },
                order_id=order_id,
            )
