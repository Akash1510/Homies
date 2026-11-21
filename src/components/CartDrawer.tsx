"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { X, ShoppingBag } from 'lucide-react';
import { CartFreeShippingBar } from './cart/CartFreeShippingBar';
import { CartItemRow } from './cart/CartItemRow';
import { CartCouponSection } from './cart/CartCouponSection';
import { CartAuthGate } from './cart/CartAuthGate';
import { CartSummaryFooter } from './cart/CartSummaryFooter';
import { CartBundleUpsell } from './cart/CartBundleUpsell';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    isHydrated,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryCharge,
    freeDeliveryRemaining,
    total,
    totalSavings,
    setIsCheckoutOpen,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponDiscount,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const [showAuthGate, setShowAuthGate] = useState(false);

  if (!isCartOpen) return null;

  const handleProceedClick = () => {
    if (!isAuthenticated) {
      setShowAuthGate(true);
    } else {
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    }
  };

  const handleAuthGateProceed = () => {
    setShowAuthGate(false);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10" onClick={(e) => e.stopPropagation()}>
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-600" />
              <h2 className="text-base font-bold text-slate-900">
                Your Cleaning Basket ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setShowAuthGate(false);
              }}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <CartFreeShippingBar subtotal={subtotal} freeDeliveryRemaining={freeDeliveryRemaining} />

          {/* Skeleton or AuthGate or Cart Items */}
          {!isHydrated ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex gap-3.5 p-3 rounded-2xl border border-slate-100 bg-slate-50/70">
                  <div className="w-18 h-18 bg-slate-200 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-200 rounded-md w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : showAuthGate ? (
            <CartAuthGate onBack={() => setShowAuthGate(false)} onProceed={handleAuthGateProceed} />
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center text-sky-500">
                    <ShoppingBag className="w-8 h-8 opacity-60" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Your cart is empty</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Explore our floor cleaners, mops, and toilet care products to get started.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 rounded-full bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-600/20 hover:bg-sky-500 transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <CartItemRow
                      key={item.product.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                  <CartBundleUpsell />
                </>
              )}
            </div>
          )}

          {/* Footer Summary & Coupons */}
          {cart.length > 0 && !showAuthGate && (
            <div className="space-y-2">
              <div className="px-4 sm:px-5 pt-3">
                <CartCouponSection
                  appliedCoupon={appliedCoupon}
                  couponDiscount={couponDiscount}
                  onApplyCoupon={applyCoupon}
                  onRemoveCoupon={removeCoupon}
                />
              </div>
              <CartSummaryFooter
                subtotal={subtotal}
                deliveryCharge={deliveryCharge}
                couponDiscount={couponDiscount}
                appliedCoupon={appliedCoupon}
                totalSavings={totalSavings}
                total={total}
                onProceed={handleProceedClick}
                onClear={clearCart}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
