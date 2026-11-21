import { Coupon } from '@/types/product';

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'HOMIES50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 399,
    description: 'Flat ₹50 OFF on orders above ₹399',
  },
  {
    code: 'CLEAN20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 599,
    description: '20% Mega Savings on orders above ₹599',
  },
  {
    code: 'FIRST10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 199,
    description: '10% OFF on your first home cleaning kit',
  },
];
