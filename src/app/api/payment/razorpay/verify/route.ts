import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_HomiesDemoSecret';

    // If simulated order in development mode
    if (razorpay_order_id.startsWith('order_dev_') || razorpay_order_id.startsWith('order_mock_')) {
      return NextResponse.json({
        status: 'verified',
        message: 'Dev simulated payment verified',
        razorpay_payment_id,
        razorpay_order_id,
      });
    }

    // Official HMAC SHA256 verification
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      return NextResponse.json({
        status: 'verified',
        message: 'Payment signature verified successfully',
        razorpay_payment_id,
        razorpay_order_id,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid Razorpay signature. Verification failed.' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Verification error' },
      { status: 500 }
    );
  }
}
