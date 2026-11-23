import json
from fastapi import APIRouter, Request, Header, HTTPException
from backend.app.models.order import (
    RazorpayCreateOrderRequest,
    RazorpayVerifyRequest,
    RazorpayRefundRequest,
)
from backend.app.core.razorpay_service import (
    create_order,
    verify_signature,
    process_refund,
    process_webhook,
)
from backend.app.producers.events import (
    emit_webhook_received,
    emit_refund_requested,
)

router = APIRouter(prefix="/payment", tags=["Payment Integration"])

@router.post("/razorpay/create-order")
async def create_razorpay_order(payload: RazorpayCreateOrderRequest):
    """Create an order on Razorpay server and return order ID to frontend."""
    return await create_order(payload.amount, payload.currency, payload.receipt)

@router.post("/razorpay/verify")
async def verify_razorpay_payment(payload: RazorpayVerifyRequest):
    """Verify payment signature from Razorpay checkout callback."""
    return await verify_signature(
        payload.razorpay_order_id,
        payload.razorpay_payment_id,
        payload.razorpay_signature,
    )

@router.post("/razorpay/refund")
async def refund_razorpay_payment(payload: RazorpayRefundRequest):
    """
    Trigger an instant refund for a cancelled prepaid order via RabbitMQ async pipeline.
    Reconciliation and customer WhatsApp notifications run asynchronously in queue:payments.
    """
    publish_result = await emit_refund_requested(
        payment_id=payload.payment_id,
        amount=payload.amount,
        order_id=payload.order_id,
        notes=payload.notes,
    )

    return {
        "status": "queued",
        "message": "Refund request accepted and queued for processing via RabbitMQ",
        "payment_id": payload.payment_id,
        "order_id": payload.order_id,
        "amount": payload.amount,
        "publish_meta": publish_result,
    }

@router.post("/razorpay/webhook")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(None, alias="X-Razorpay-Signature"),
):
    """
    High-throughput asynchronous webhook receiver.
    Emits payment.webhook_received to RabbitMQ in < 5ms and returns HTTP 200 OK immediately
    to prevent webhook delivery timeouts from Razorpay.
    """
    body = await request.body()
    try:
        raw_payload = json.loads(body.decode("utf-8"))
        event_type = raw_payload.get("event", "unknown")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON webhook payload")

    publish_result = await emit_webhook_received(
        event_type=event_type,
        raw_payload=raw_payload,
        signature=x_razorpay_signature,
    )

    return {
        "status": "queued",
        "event": event_type,
        "message": "Webhook queued for async processing",
        "publish_meta": publish_result,
    }
