"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, OrderDetails, OrderStatus, Coupon, ProductReview } from '@/types/product';
import { INITIAL_PRODUCTS } from '@/data/products';
import { calculateCartTotals, buildNewReview, syncOrderToBackend, validateCoupon, buildOrder } from '@/utils/cartCalculations';

interface CartContextType {
  products: Product[];
  addProduct: (newProd: Product) => void;
  updateProduct: (updated: Product) => void;
  resetProducts: () => void;
  addReview: (productId: string, review: { userName: string; rating: number; comment: string }) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, isSubscription?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  couponDiscount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isHydrated: boolean;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  totalItems: number;
  subtotal: number;
  deliveryCharge: number;
  freeDeliveryRemaining: number;
  total: number;
  totalSavings: number;
  orders: OrderDetails[];
  lastOrder: OrderDetails | null;
  isOrderSuccessOpen: boolean;
  setIsOrderSuccessOpen: (open: boolean) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  createOrder: (details: {
    customerName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    pincode: string;
    paymentMethod: 'COD' | 'WHATSAPP' | 'RAZORPAY';
    paymentStatus?: 'PAID' | 'PENDING' | 'FAILED';
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
  }) => OrderDetails;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [lastOrder, setLastOrder] = useState<OrderDetails | null>(null);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const p = localStorage.getItem('homies_products');
      if (p) setProducts(JSON.parse(p));
      const c = localStorage.getItem('homies_cart');
      if (c) setCart(JSON.parse(c));
      const o = localStorage.getItem('homies_orders');
      if (o) setOrders(JSON.parse(o));
      const cp = localStorage.getItem('homies_coupon');
      if (cp) setAppliedCoupon(JSON.parse(cp));
    } catch {} finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('homies_products', JSON.stringify(products)); } catch {}
  }, [products]);

  useEffect(() => {
    try { localStorage.setItem('homies_cart', JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem('homies_orders', JSON.stringify(orders)); } catch {}
  }, [orders]);

  const addProduct = (p: Product) => setProducts((prev) => [p, ...prev]);
  const updateProduct = (u: Product) => setProducts((prev) => prev.map((p) => (p.id === u.id ? u : p)));
  const resetProducts = () => { setProducts(INITIAL_PRODUCTS); localStorage.removeItem('homies_products'); };

  const addReview = (productId: string, reviewData: { userName: string; rating: number; comment: string }) => {
    const newRev = buildNewReview(reviewData);
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedRev = [newRev, ...(p.reviews || [])];
          return {
            ...p,
            reviews: updatedRev,
            reviewsCount: updatedRev.length,
            rating: Number((updatedRev.reduce((s, r) => s + r.rating, 0) / updatedRev.length).toFixed(1)),
          };
        }
        return p;
      })
    );
  };

  const addToCart = (product: Product, quantity = 1, isSubscription = false) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.isSubscription === isSubscription);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.isSubscription === isSubscription
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity, isSubscription, subscriptionDays: isSubscription ? 30 : undefined }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.product.id !== id));
  const updateQuantity = (id: string, q: number) => {
    if (q <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((i) => (i.product.id === id ? { ...i, quantity: q } : i)));
  };
  const clearCart = () => { setCart([]); setAppliedCoupon(null); localStorage.removeItem('homies_coupon'); };

  const applyCoupon = (code: string) => {
    const res = validateCoupon(code, subtotal);
    if (!res.success || !res.coupon) return { success: false, message: res.message };
    setAppliedCoupon(res.coupon);
    localStorage.setItem('homies_coupon', JSON.stringify(res.coupon));
    return { success: true, message: res.message };
  };

  const removeCoupon = () => { setAppliedCoupon(null); localStorage.removeItem('homies_coupon'); };

  const { subtotal, freeDeliveryRemaining, deliveryCharge, couponDiscount, totalSavings, total, totalItems } =
    calculateCartTotals(cart, appliedCoupon);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, status } : o)));
  };
  const deleteOrder = (orderId: string) => setOrders((prev) => prev.filter((o) => o.orderId !== orderId));

  const createOrder = (details: any): OrderDetails => {
    const newOrder = buildOrder(details, cart, subtotal, deliveryCharge, totalSavings, appliedCoupon, couponDiscount, total);
    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);
    syncOrderToBackend(newOrder);
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        products, addProduct, updateProduct, resetProducts, addReview,
        cart, addToCart, removeFromCart, updateQuantity, clearCart,
        appliedCoupon, applyCoupon, removeCoupon, couponDiscount,
        isCartOpen, setIsCartOpen, isCheckoutOpen, setIsCheckoutOpen, isHydrated,
        selectedProductForModal, setSelectedProductForModal,
        totalItems, subtotal, deliveryCharge, freeDeliveryRemaining, total, totalSavings,
        orders, lastOrder, isOrderSuccessOpen, setIsOrderSuccessOpen,
        updateOrderStatus, deleteOrder, createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
