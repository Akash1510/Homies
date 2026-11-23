"""High-level event emitter helpers for the Homies Clean web tier."""
import logging
from typing import Optional, Dict, Any
from backend.app.producers.rabbitmq import mq_producer

logger = logging.getLogger("homies.events")

async def emit_order_created(order_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Emits order.created event immediately after order is saved to DB.
    Triggered from POST /api/orders in under 5ms.
    """
    order_id = order_data.get("order_id") or order_data.get("id")
    return await mq_producer.publish(
        routing_key="order.created",
        event_type="order.created",
        payload={
            "order_id": order_id,
            "id": order_data.get("id"),
            "customer_name": order_data.get("customer_name"),
            "phone": order_data.get("phone"),
            "email": order_data.get("email"),
            "address": order_data.get("address"),
            "city": order_data.get("city"),
            "pincode": order_data.get("pincode"),
            "items": order_data.get("items", []),
            "subtotal": order_data.get("subtotal"),
            "delivery_charge": order_data.get("delivery_charge"),
            "discount": order_data.get("discount"),
            "total": order_data.get("total"),
            "payment_method": order_data.get("payment_method"),
            "payment_status": order_data.get("payment_status"),
            "status": order_data.get("status"),
            "razorpay_order_id": order_data.get("razorpay_order_id"),
            "razorpay_payment_id": order_data.get("razorpay_payment_id"),
            "created_at": str(order_data.get("created_at")),
        },
        correlation_id=order_id,
    )

async def emit_webhook_received(
    event_type: str,
    raw_payload: Dict[str, Any],
    signature: Optional[str] = None
) -> Dict[str, Any]:
    """
    Emits payment.webhook_received event for Razorpay webhooks.
    Allows POST /api/payment/razorpay/webhook to immediately return HTTP 200 OK (< 5ms)
    without blocking while verifying HMAC or reconciling DB.
    """
    payment_entity = raw_payload.get("payload", {}).get("payment", {}).get("entity", {})
    payment_id = payment_entity.get("id")
    order_id = payment_entity.get("order_id")

    return await mq_producer.publish(
        routing_key="payment.webhook_received",
        event_type="payment.webhook_received",
        payload={
            "webhook_event": event_type,
            "signature": signature,
            "payment_id": payment_id,
            "razorpay_order_id": order_id,
            "amount": payment_entity.get("amount"),
            "raw_payload": raw_payload,
        },
        correlation_id=payment_id or order_id,
    )

async def emit_refund_requested(
    payment_id: str,
    amount: Optional[float] = None,
    order_id: Optional[str] = None,
    notes: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Emits payment.refund_requested event for asynchronous refund reconciliation.
    """
    return await mq_producer.publish(
        routing_key="payment.refund_requested",
        event_type="payment.refund_requested",
        payload={
            "payment_id": payment_id,
            "amount": amount,
            "order_id": order_id,
            "notes": notes or {},
        },
        correlation_id=order_id or payment_id,
    )

async def emit_whatsapp_dispatch(
    phone: str,
    template: str,
    params: Dict[str, Any],
    order_id: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Emits notification.whatsapp_dispatch event for rate-limited async dispatch.
    """
    return await mq_producer.publish(
        routing_key="notification.whatsapp_dispatch",
        event_type="notification.whatsapp_dispatch",
        payload={
            "phone": phone,
            "template": template,
            "params": params,
            "order_id": order_id,
        },
        correlation_id=order_id,
    )
