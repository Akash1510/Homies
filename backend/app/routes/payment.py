from fastapi import APIRouter, Request, Header
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
    Trigger an instant refund for a cancelled prepaid order via Razorpay Payments Refund API.
    Refunds directly to customer's source account (UPI/Card/Netbanking).
    """
    return await process_refund(
        payment_id=payload.payment_id,
        amount=payload.amount,
        order_id=payload.order_id,
        notes=payload.notes,
    )

@router.post("/razorpay/webhook")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(None, alias="X-Razorpay-Signature"),
):
    """Asynchronous webhook receiver for payment.captured, payment.failed, order.paid."""
    body = await request.body()
    return await process_webhook(body, x_razorpay_signature)
