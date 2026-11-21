import { CartItem, Coupon, OrderDetails, OrderStatus, ProductReview } from '@/types/product';
import { STORE_SETTINGS, AVAILABLE_COUPONS } from '@/data/products';

export function calculateCartTotals(cart: CartItem[], appliedCoupon: Coupon | null) {
  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.isSubscription ? Math.round(item.product.price * 0.85) : item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const totalOriginalPrice = cart.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );

  const freeDeliveryRemaining = Math.max(0, STORE_SETTINGS.freeDeliveryThreshold - subtotal);
  const deliveryCharge = subtotal >= STORE_SETTINGS.freeDeliveryThreshold || subtotal === 0 ? 0 : STORE_SETTINGS.deliveryFee;

  let couponDiscount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.discountType === 'fixed') {
      couponDiscount = appliedCoupon.discountValue;
    } else {
      couponDiscount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    }
  }

  const totalSavings = Math.max(0, totalOriginalPrice - subtotal + couponDiscount);
  const total = Math.max(0, subtotal + deliveryCharge - couponDiscount);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal,
    totalOriginalPrice,
    freeDeliveryRemaining,
    deliveryCharge,
    couponDiscount,
    totalSavings,
    total,
    totalItems,
  };
}

export function validateCoupon(code: string, subtotal: number): { success: boolean; coupon?: Coupon; message: string } {
  const clean = code.trim().toUpperCase();
  const found = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === clean);
  if (!found) return { success: false, message: `Invalid coupon "${clean}".` };
  if (subtotal < found.minOrderAmount) {
    return { success: false, message: `Min order ${STORE_SETTINGS.currencySymbol}${found.minOrderAmount} required.` };
  }
  return { success: true, coupon: found, message: `Coupon "${clean}" applied!` };
}

export function buildOrder(
  details: any,
  cart: CartItem[],
  subtotal: number,
  deliveryCharge: number,
  totalSavings: number,
  appliedCoupon: Coupon | null,
  couponDiscount: number,
  total: number
): OrderDetails {
  const orderId = `HMY-${Date.now().toString().slice(-6)}`;
  return {
    orderId,
    customerName: details.customerName,
    phone: details.phone,
    email: details.email,
    address: details.address,
    city: details.city,
    pincode: details.pincode,
    items: [...cart],
    subtotal,
    deliveryCharge,
    discount: totalSavings,
    couponCode: appliedCoupon?.code,
    couponDiscount,
    total,
    paymentMethod: details.paymentMethod,
    paymentStatus: details.paymentStatus || (details.paymentMethod === 'RAZORPAY' ? 'PAID' : 'PENDING'),
    status: details.paymentMethod === 'RAZORPAY' ? 'Confirmed' : 'Pending',
    razorpayPaymentId: details.razorpayPaymentId,
    razorpayOrderId: details.razorpayOrderId,
    createdAt: new Date().toISOString(),
  };
}

export function buildNewReview(reviewData: { userName: string; rating: number; comment: string }): ProductReview {
  return {
    id: `rev-${Date.now()}`,
    userName: reviewData.userName,
    rating: reviewData.rating,
    date: 'Just now',
    comment: reviewData.comment,
    verifiedBuyer: true,
  };
}

export async function syncOrderToBackend(order: OrderDetails) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  try {
    await fetch(`${apiBase}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: order.customerName,
        phone: order.phone,
        email: order.email,
        address: order.address,
        city: order.city,
        pincode: order.pincode,
        items: order.items.map((i) => ({
          product_id: i.product.id,
          name: i.product.name,
          unit: i.product.unit,
          price: i.isSubscription ? Math.round(i.product.price * 0.85) : i.product.price,
          quantity: i.quantity,
        })),
        subtotal: order.subtotal,
        delivery_charge: order.deliveryCharge,
        discount: order.discount,
        total: order.total,
        payment_method: order.paymentMethod,
        razorpay_payment_id: order.razorpayPaymentId,
        razorpay_order_id: order.razorpayOrderId,
      }),
    });
  } catch {
    // If backend is unavailable, order remains safely in client storage
  }
}
