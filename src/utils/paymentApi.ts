export async function apiIssueRefund(params: {
  payment_id: string;
  amount?: number;
  order_id?: string;
  notes?: Record<string, string>;
}): Promise<{ status: string; message: string; refund_id?: string; error?: string }> {
  try {
    const res = await fetch('/api/payment/razorpay/refund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (e: any) {
    return { status: 'error', message: e?.message || 'Network error while initiating refund' };
  }
}
