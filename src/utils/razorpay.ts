import { STORE_SETTINGS } from '@/data/products';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

/**
 * Step 1: Ensure Razorpay Standard Checkout script is injected and ready.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayPaymentOptions {
  amount: number; // in rupees
  customerName: string;
  email: string;
  phone: string;
  orderDescription: string;
  onSuccess: (paymentId: string, orderId: string) => void;
  onDismissOrFailure: (reason?: string) => void;
}

/**
 * Executes Razorpay Standard 4-Step Payment Workflow:
 * 1. Load SDK
 * 2. Create Order on Server (Backend /api/payment/razorpay/create-order)
 * 3. Open Razorpay Checkout modal with returned order_id
 * 4. Verify Payment Signature on Server (/api/payment/razorpay/verify)
 */
export async function initiateRazorpayPayment({
  amount,
  customerName,
  email,
  phone,
  orderDescription,
  onSuccess,
  onDismissOrFailure,
}: RazorpayPaymentOptions) {
  // 1. Load Checkout SDK
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    onDismissOrFailure('Razorpay Checkout SDK could not be loaded. Please use WhatsApp or Cash on Delivery fallback.');
    return;
  }

  // 2. Create Order on Server
  let orderData;
  try {
    const res = await fetch('/api/payment/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        receipt: `rcpt_${Date.now()}`,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to create order on server (Status ${res.status})`);
    }

    orderData = await res.json();
  } catch (err) {
    onDismissOrFailure((err as Error).message || 'Server error creating Razorpay order. Switching to fallback.');
    return;
  }

  const razorpayOrderId = orderData.razorpay_order_id;
  const key = orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || STORE_SETTINGS.razorpayKeyId;

  // 3. Open Checkout with returned order_id
  const options = {
    key,
    amount: orderData.amount, // in paise
    currency: orderData.currency || 'INR',
    name: STORE_SETTINGS.storeName,
    description: orderDescription || 'Home Cleaning Supplies Order',
    image: 'https://cdn-icons-png.flaticon.com/512/995/995053.png',
    order_id: razorpayOrderId,
    prefill: {
      name: customerName,
      email: email || 'customer@example.com',
      contact: phone,
    },
    notes: {
      store: STORE_SETTINGS.storeName,
      customer: customerName,
    },
    theme: {
      color: '#0284c7', // sky-600
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: async function (response: any) {
      // 4. Verify Payment Signature on Server
      try {
        const verifyRes = await fetch('/api/payment/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id || razorpayOrderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature || 'simulated_sig',
          }),
        });

        if (verifyRes.ok) {
          onSuccess(response.razorpay_payment_id, response.razorpay_order_id || razorpayOrderId);
        } else {
          const errData = await verifyRes.json();
          onDismissOrFailure(errData.error || 'Payment signature could not be verified on server.');
        }
      } catch (err) {
        onDismissOrFailure((err as Error).message || 'Server verification failed.');
      }
    },
    modal: {
      ondismiss: function () {
        onDismissOrFailure('Payment modal closed. You can complete your order below via WhatsApp or Cash on Delivery.');
      },
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rzp.on('payment.failed', function (response: any) {
      const reason = response?.error?.description || 'Payment was unsuccessful.';
      onDismissOrFailure(reason);
    });
    rzp.open();
  } catch (err) {
    onDismissOrFailure((err as Error).message || 'Razorpay checkout launch failed.');
  }
}
