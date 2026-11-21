export type ProductCategory = 
  | 'all'
  | 'floor-cleaner'
  | 'toilet-cleaner'
  | 'mops-tools'
  | 'bathroom-kitchen'
  | 'combos';

export interface ProductReview {
  id: string;
  userName: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  verifiedBuyer: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'floor-cleaner' | 'toilet-cleaner' | 'mops-tools' | 'bathroom-kitchen' | 'combos';
  categoryLabel: string;
  price: number;
  originalPrice: number;
  unit: string; // e.g. "1 Litre", "Pack of 2", "1 Piece"
  rating: number;
  reviewsCount: number;
  tag?: string; // "Bestseller", "Save 25%", "Popular"
  inStock: boolean;
  stockCount: number; // e.g. 4 (triggers low stock warning when <= 5)
  image: string;
  additionalImages?: string[];
  description: string;
  benefits: string[];
  usageInstructions: string;
  fragranceOrType?: string;
  reviews?: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  isSubscription?: boolean; // Subscribe & Save 15%
  subscriptionDays?: number; // e.g. 30 days
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 50 (₹50) or 20 (20%)
  minOrderAmount: number;
  description: string;
}

export interface OrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  couponDiscount?: number;
  total: number;
  paymentMethod: 'COD' | 'WHATSAPP' | 'RAZORPAY';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  status: OrderStatus;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
}
