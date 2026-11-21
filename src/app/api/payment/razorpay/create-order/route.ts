import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = body.amount; // in rupees
    const amountInPaise = Math.round(Number(amount) * 100);

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_HomiesDemoKey';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_HomiesDemoSecret';

    // Attempt calling FastAPI backend first if available
    try {
      const backendRes = await fetch('http://127.0.0.1:8000/api/payment/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'INR', receipt: body.receipt }),
        signal: AbortSignal.timeout(2000),
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Backend not reached, proceed with Next.js direct order generation
    }

    // Direct Razorpay API call
    try {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: body.receipt || `rcpt_${Date.now()}`,
          notes: {
            store: 'Homies Clean',
            admin: 'akashgj777@gmail.com',
          },
        }),
      });

      if (rzpRes.ok) {
        const orderData = await rzpRes.json();
        return NextResponse.json({
          status: 'success',
          razorpay_order_id: orderData.id,
          amount: orderData.amount,
          currency: orderData.currency,
          key_id: keyId,
        });
      }
    } catch {
      // ignore
    }

    // Simulated development fallback for test mode without active keys
    return NextResponse.json({
      status: 'simulated',
      razorpay_order_id: `order_dev_${Date.now()}`,
      amount: amountInPaise,
      currency: 'INR',
      key_id: keyId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
