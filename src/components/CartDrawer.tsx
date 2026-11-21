"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { STORE_SETTINGS } from '@/data/products';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Lock,
  Mail,
  UserCheck,
  Sparkles,
  ArrowLeft,
  Tag,
  Check
} from 'lucide-react';

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

  const { isAuthenticated, user, login } = useAuth();

  // In-drawer auth prompt state
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const freeDeliveryProgress = Math.min(
    100,
    (subtotal / STORE_SETTINGS.freeDeliveryThreshold) * 100
  );

  const handleProceedClick = () => {
    if (!isAuthenticated) {
      // Prompt customer to login first so address & order history are synced
      setShowAuthGate(true);
      setAuthError('');
    } else {
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    }
  };

  const handleQuickCustomerLogin = async () => {
    setIsLoggingIn(true);
    setAuthError('');
    const res = await login('test@gmail.com', 'akash123456');
    setIsLoggingIn(false);

    if (res.success) {
      setShowAuthGate(false);
      setIsCartOpen(false);
      setIsCheckoutOpen(true); // Proceeds with basket data properly visible!
    } else {
      setAuthError(res.error || 'Login failed');
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please enter your email and password');
      return;
    }

    setIsLoggingIn(true);
    setAuthError('');
    const res = await login(authEmail.trim(), authPassword);
    setIsLoggingIn(false);

    if (res.success) {
      setShowAuthGate(false);
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    } else {
      setAuthError(res.error || 'Invalid credentials');
    }
  };

  const handleContinueAsGuest = () => {
    setShowAuthGate(false);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div 
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
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
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tracker */}
          <div className="p-3.5 bg-sky-50 border-b border-sky-100 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-semibold">
              <span className="flex items-center gap-1.5 text-sky-900">
                <Truck className="w-4 h-4 text-sky-600" />
                {freeDeliveryRemaining > 0
                  ? `Add ${STORE_SETTINGS.currencySymbol}${freeDeliveryRemaining} more for FREE Delivery`
                  : '🎉 Congratulations! You unlocked FREE Delivery!'}
              </span>
              <span className="text-sky-700 font-bold">{Math.round(freeDeliveryProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-sky-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* SKELETON LOADING STATE (Avoids content flash) */}
          {!isHydrated ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex gap-3.5 p-3 rounded-2xl border border-slate-100 bg-slate-50/70">
                  <div className="w-18 h-18 bg-slate-200 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-200 rounded-md w-1/3" />
                    <div className="h-4 bg-slate-200 rounded-md w-1/4 pt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : showAuthGate ? (
            /* IN-BASKET AUTH GATE: Customer logs in first, then basket proceeds properly */
            <div className="flex-1 overflow-y-auto p-5 space-y-5 animate-fadeIn">
              <button
                onClick={() => setShowAuthGate(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Basket Items</span>
              </button>

              <div className="text-center space-y-1.5 pt-2">
                <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-900">Sign In to Complete Order</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Log in so your delivery address auto-syncs into checkout and your order tracking is saved.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                  {authError}
                </div>
              )}

              {/* 1-Click Quick Customer Fill Button */}
              <div className="p-3.5 bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-200 rounded-2xl space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>1-Click Test Customer Sign In:</span>
                </span>
                <button
                  type="button"
                  onClick={handleQuickCustomerLogin}
                  disabled={isLoggingIn}
                  className="w-full py-2.5 px-3 bg-white hover:bg-sky-50/80 border border-sky-300 rounded-xl text-xs font-bold text-sky-900 flex items-center justify-between shadow-2xs transition-all active:scale-98"
                >
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>test@gmail.com</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Auto-Fill Address ➔
                  </span>
                </button>
              </div>

              {/* Standard Login Inputs */}
              <form onSubmit={handleCustomLogin} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="your-email@gmail.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 active:scale-98 transition-all"
                >
                  {isLoggingIn ? 'Signing In...' : 'Sign In & Proceed to Checkout'}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Continue as Guest without account ➔
                </button>
              </div>
            </div>
          ) : (
            /* NORMAL BASKET ITEMS LIST */
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
                cart.map(({ product, quantity, isSubscription }) => {
                  const itemUnitPrice = isSubscription ? Math.round(product.price * 0.85) : product.price;
                  return (
                    <div
                      key={product.id}
                      className="flex gap-3.5 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 shrink-0"
                      />

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                              {product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{product.unit}</p>

                          {isSubscription && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md mt-1 w-fit border border-teal-200/60">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              <span>Refill every 30 days (15% Saved)</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="font-extrabold text-sm text-slate-900">
                            {STORE_SETTINGS.currencySymbol}{itemUnitPrice * quantity}
                          </span>

                          {/* Stepper */}
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-2xs">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && !showAuthGate && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-3.5">
              
              {/* Promo Code Input & Chips */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-sky-600" />
                    <span>Apply Promo Code</span>
                  </span>
                  {appliedCoupon && (
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] font-bold text-rose-500 hover:text-rose-700 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Coupon &quot;{appliedCoupon.code}&quot; Applied (-{STORE_SETTINGS.currencySymbol}{couponDiscount})</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="e.g. HOMIES50"
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase font-mono font-bold"
                      />
                      <button
                        onClick={() => {
                          if (!couponCode.trim()) return;
                          const res = applyCoupon(couponCode.trim());
                          setCouponFeedback(res);
                          if (res.success) setCouponCode('');
                        }}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="text-[10px] text-slate-400 font-semibold">Try:</span>
                      {['HOMIES50', 'CLEAN20', 'FIRST10'].map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            const res = applyCoupon(c);
                            setCouponFeedback(res);
                          }}
                          className="text-[10px] font-bold bg-white text-sky-700 px-2 py-0.5 rounded-md border border-sky-200 hover:bg-sky-50 transition-colors"
                        >
                          {c}
                        </button>
                      ))}
                    </div>

                    {couponFeedback && (
                      <p className={`text-[11px] font-medium ${couponFeedback.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {couponFeedback.message}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Cost breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {STORE_SETTINGS.currencySymbol}{subtotal}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <strong className="text-emerald-600 uppercase text-[11px]">FREE</strong>
                    ) : (
                      `${STORE_SETTINGS.currencySymbol}${deliveryCharge}`
                    )}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-teal-600 font-semibold">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span>-{STORE_SETTINGS.currencySymbol}{couponDiscount}</span>
                  </div>
                )}

                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Total Discount Saved</span>
                    <span>-{STORE_SETTINGS.currencySymbol}{totalSavings}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm sm:text-base font-black text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-sky-600">{STORE_SETTINGS.currencySymbol}{total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedClick}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-sky-600/25 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Order ({STORE_SETTINGS.currencySymbol}{total})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  COD & Razorpay Supported
                </span>
                <button
                  onClick={clearCart}
                  className="hover:text-rose-500 transition-colors"
                >
                  Clear all
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
