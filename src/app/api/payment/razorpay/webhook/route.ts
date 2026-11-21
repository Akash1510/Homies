import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature if secret configured
    if (secret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payloadData = event.payload || {};

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = payloadData.payment?.entity;
      const orderEntity = payloadData.order?.entity;
      const rzpOrderId = paymentEntity?.order_id || orderEntity?.id;
      const rzpPaymentId = paymentEntity?.id;

      // Forward or handle payment confirmation
      const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      try {
        await fetch(`${backendUrl}/api/payment/razorpay/webhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(signature ? { 'x-razorpay-signature': signature } : {}),
          },
          body: rawBody,
        });
      } catch {
        // Backend offline or running standalone
      }
    }

    return NextResponse.json({ status: 'received', event: eventType });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 400 });
  }
}
