"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, OrderDetails, OrderStatus, Coupon, ProductReview } from '@/types/product';
import { STORE_SETTINGS, INITIAL_PRODUCTS, AVAILABLE_COUPONS } from '@/data/products';

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

  // Load cart, products, and orders from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('homies_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
      const savedCart = localStorage.getItem('homies_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedOrders = localStorage.getItem('homies_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
      const savedCoupon = localStorage.getItem('homies_coupon');
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch {
      // LocalStorage unavailable
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('homies_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('homies_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('homies_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const addProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const resetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    try {
      localStorage.removeItem('homies_products');
    } catch {
      // ignore
    }
  };

  const addReview = (productId: string, reviewData: { userName: string; rating: number; comment: string }) => {
    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      userName: reviewData.userName,
      rating: reviewData.rating,
      date: 'Just now',
      comment: reviewData.comment,
      verifiedBuyer: true,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentReviews = p.reviews || [];
          const updatedReviews = [newReview, ...currentReviews];
          const newAvgRating = Number(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: p.reviewsCount + 1,
            rating: newAvgRating,
          };
        }
        return p;
      })
    );
  };

  const addToCart = (product: Product, quantity: number = 1, isSubscription: boolean = false) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.isSubscription === isSubscription
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.isSubscription === isSubscription
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          isSubscription,
          subscriptionDays: isSubscription ? 30 : undefined,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    try {
      localStorage.removeItem('homies_coupon');
    } catch {}
  };

  // Subtotal (Subscriptions get 15% discount)
  const subtotal = cart.reduce((sum, item) => {
    const basePrice = item.product.price;
    const finalPrice = item.isSubscription ? Math.round(basePrice * 0.85) : basePrice;
    return sum + finalPrice * item.quantity;
  }, 0);

  const totalOriginalPrice = cart.reduce((sum, item) => {
    return sum + item.product.originalPrice * item.quantity;
  }, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const deliveryCharge =
    subtotal === 0 || subtotal >= STORE_SETTINGS.freeDeliveryThreshold
      ? 0
      : STORE_SETTINGS.deliveryFee;

  const freeDeliveryRemaining = Math.max(
    0,
    STORE_SETTINGS.freeDeliveryThreshold - subtotal
  );

  // Coupon Engine calculations
  let couponDiscount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.discountType === 'fixed') {
      couponDiscount = appliedCoupon.discountValue;
    } else {
      couponDiscount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    }
  }

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find((c) => c.code === cleanCode);

    if (!found) {
      return { success: false, message: `Invalid coupon code "${cleanCode}". Try HOMIES50 or CLEAN20.` };
    }

    if (subtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Add ${STORE_SETTINGS.currencySymbol}${found.minOrderAmount - subtotal} more to use ${cleanCode}.`,
      };
    }

    setAppliedCoupon(found);
    try {
      localStorage.setItem('homies_coupon', JSON.stringify(found));
    } catch {}

    const discountAmount =
      found.discountType === 'fixed'
        ? `${STORE_SETTINGS.currencySymbol}${found.discountValue}`
        : `${found.discountValue}%`;

    return {
      success: true,
      message: `Coupon "${cleanCode}" applied! You saved ${discountAmount}.`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    try {
      localStorage.removeItem('homies_coupon');
    } catch {}
  };

  const totalSavings = Math.max(0, totalOriginalPrice - subtotal + couponDiscount);
  const total = Math.max(0, subtotal + deliveryCharge - couponDiscount);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.orderId === orderId ? { ...ord, status } : ord))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.orderId !== orderId));
  };

  const createOrder = ({
    customerName,
    phone,
    email,
    address,
    city,
    pincode,
    paymentMethod,
    paymentStatus = paymentMethod === 'RAZORPAY' ? 'PAID' : 'PENDING',
    razorpayPaymentId,
    razorpayOrderId,
  }: {
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
  }): OrderDetails => {
    const orderId = `HMY-${Date.now().toString().slice(-6)}`;
    const newOrder: OrderDetails = {
      orderId,
      customerName,
      phone,
      email,
      address,
      city,
      pincode,
      items: [...cart],
      subtotal,
      deliveryCharge,
      discount: totalSavings,
      couponCode: appliedCoupon?.code,
      couponDiscount,
      total,
      paymentMethod,
      paymentStatus,
      status: paymentMethod === 'RAZORPAY' ? 'Confirmed' : 'Pending',
      razorpayPaymentId,
      razorpayOrderId,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);

    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        resetProducts,
        addReview,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponDiscount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isHydrated,
        selectedProductForModal,
        setSelectedProductForModal,
        totalItems,
        subtotal,
        deliveryCharge,
        freeDeliveryRemaining,
        total,
        totalSavings,
        orders,
        lastOrder,
        isOrderSuccessOpen,
        setIsOrderSuccessOpen,
        updateOrderStatus,
        deleteOrder,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
