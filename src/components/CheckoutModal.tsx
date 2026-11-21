"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { STORE_SETTINGS } from '@/data/products';
import { initiateRazorpayPayment } from '@/utils/razorpay';
import { X, MessageCircle, Banknote, CreditCard, ShieldCheck, AlertCircle, RefreshCw, Check, UserCheck, Sparkles } from 'lucide-react';

export function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    deliveryCharge,
    total,
    createOrder,
  } = useCart();

  const { user, isAuthenticated, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'WHATSAPP' | 'COD'>('RAZORPAY');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  // Auto-sync customer profile data into checkout form before payment
  useEffect(() => {
    if (user) {
      if (user.full_name) setName(user.full_name);
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
      if (user.address) setAddress(user.address);
      if (user.city) setCity(user.city);
      if (user.pincode) setPincode(user.pincode);
    }
  }, [user, isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleWhatsAppRedirect = (orderId: string) => {
    const itemsList = cart
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.product.name}* (${item.product.unit})\n   Qty: ${item.quantity} × ${STORE_SETTINGS.currencySymbol}${item.product.price} = ${STORE_SETTINGS.currencySymbol}${item.quantity * item.product.price}`
      )
      .join('\n');

    const message = 
      `🛒 *NEW ORDER: ${orderId}*\n` +
      `------------------------------------\n` +
      `👤 *Customer:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      (email ? `✉️ *Email:* ${email}\n` : '') +
      `📍 *Address:* ${address}, ${city} - ${pincode}\n` +
      `------------------------------------\n` +
      `📦 *Ordered Items:*\n${itemsList}\n` +
      `------------------------------------\n` +
      `💵 *Subtotal:* ${STORE_SETTINGS.currencySymbol}${subtotal}\n` +
      `🚚 *Delivery:* ${deliveryCharge === 0 ? 'FREE' : `${STORE_SETTINGS.currencySymbol}${deliveryCharge}`}\n` +
      `💰 *GRAND TOTAL:* ${STORE_SETTINGS.currencySymbol}${total}\n` +
      `💳 *Payment:* Cash / UPI on Delivery\n\n` +
      `Admin: Akash (+91 7776032964)\n` +
      `Please confirm order dispatch. Thank you!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${encoded}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      setError('Please fill in your name, phone number, address, and pincode.');
      return;
    }

    if (phone.trim().length < 8) {
      setError('Please enter a valid phone number.');
      return;
    }

    setError('');
    setFallbackNotice(null);

    // Auto-update user profile with latest entered address/contact if logged in
    if (isAuthenticated) {
      updateProfile({
        full_name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
      });
    }

    // Option 1: Razorpay Online Payment
    if (paymentMethod === 'RAZORPAY') {
      setIsProcessing(true);
      await initiateRazorpayPayment({
        amount: total,
        customerName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        orderDescription: `Order for ${cart.length} cleaning supplies`,
        onSuccess: (paymentId, orderId) => {
          setIsProcessing(false);
          createOrder({
            customerName: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            city: city.trim() || 'Local Area',
            pincode: pincode.trim(),
            paymentMethod: 'RAZORPAY',
            paymentStatus: 'PAID',
            razorpayPaymentId: paymentId,
            razorpayOrderId: orderId,
          });
        },
        onDismissOrFailure: (reason) => {
          setIsProcessing(false);
          setFallbackNotice(
            reason || 'Payment could not be completed. You can instantly switch to WhatsApp Order or COD below.'
          );
        },
      });
      return;
    }

    // Option 2: WhatsApp Quick Order
    if (paymentMethod === 'WHATSAPP') {
      const newOrder = createOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim() || 'Local Area',
        pincode: pincode.trim(),
        paymentMethod: 'WHATSAPP',
        paymentStatus: 'PENDING',
      });
      handleWhatsAppRedirect(newOrder.orderId);
      return;
    }

    // Option 3: Cash On Delivery
    if (paymentMethod === 'COD') {
      createOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim() || 'Local Area',
        pincode: pincode.trim(),
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Secure Checkout & Delivery</h2>
            <p className="text-xs text-slate-500">
              Admin Contact: +91 7776032964 • {STORE_SETTINGS.storeName}
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Razorpay Fallback Alert */}
          {fallbackNotice && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs">
              <div className="flex items-start gap-2 text-amber-900 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Online Payment Status: {fallbackNotice}</span>
              </div>
              <p className="text-amber-800">
                Don&apos;t worry! Your cart and details are saved. Pick a fallback method below:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('WHATSAPP');
                    setFallbackNotice(null);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Switch to WhatsApp Order</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('COD');
                    setFallbackNotice(null);
                  }}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5"
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Switch to Cash on Delivery</span>
                </button>
              </div>
            </div>
          )}

          {/* Customer & Address Details */}
          <div className="space-y-3.5">
            {/* Auto-Sync User Profile Status */}
            {isAuthenticated ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Auto-synced from your profile (<strong>{user?.email}</strong>)
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full shrink-0">
                  Ready to Pay
                </span>
              </div>
            ) : (
              <div className="p-3 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-between text-xs text-sky-800">
                <span>Already have a Homies Clean account?</span>
                <Link
                  href="/login"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="font-bold underline text-sky-700 hover:text-sky-900"
                >
                  Log In to auto-fill
                </Link>
              </div>
            )}

            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              1. Delivery Address & Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="e.g. customer@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                House / Flat No., Landmark & Full Street Address *
              </label>
              <textarea
                required
                rows={2}
                placeholder="e.g. Flat 302, Green Heights, Opp. City Mall"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Town</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai / Pune"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 400001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              2. Select Payment Mode
            </h3>

            <div className="space-y-2.5">
              {/* Option A: Razorpay */}
              <div
                onClick={() => setPaymentMethod('RAZORPAY')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'RAZORPAY'
                    ? 'border-sky-600 bg-sky-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${paymentMethod === 'RAZORPAY' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      Razorpay Gateway (UPI, Cards, NetBanking)
                    </h4>
                    <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                      Instant & Secure
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pay securely using Google Pay, PhonePe, Paytm, Debit/Credit Card or NetBanking.
                  </p>
                </div>
              </div>

              {/* Option B: WhatsApp Order */}
              <div
                onClick={() => setPaymentMethod('WHATSAPP')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'WHATSAPP'
                    ? 'border-emerald-500 bg-emerald-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${paymentMethod === 'WHATSAPP' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      WhatsApp Quick Order (Direct to Admin)
                    </h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      +91 7776032964
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Sends your full order & address directly to admin WhatsApp for real-time confirmation.
                  </p>
                </div>
              </div>

              {/* Option C: Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'COD'
                    ? 'border-slate-800 bg-slate-50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${paymentMethod === 'COD' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    Cash on Delivery (COD)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pay with cash or scan delivery agent UPI QR when your cleaning kit arrives.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
              <span className="font-bold text-slate-900">{STORE_SETTINGS.currencySymbol}{subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span>{deliveryCharge === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `${STORE_SETTINGS.currencySymbol}${deliveryCharge}`}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
              <span>Grand Total Payable</span>
              <span className="text-sky-600">{STORE_SETTINGS.currencySymbol}{total}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 ${
              isProcessing
                ? 'bg-slate-400 cursor-not-allowed'
                : paymentMethod === 'RAZORPAY'
                ? 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/25'
                : paymentMethod === 'WHATSAPP'
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'
                : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/25'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Launching Razorpay Gateway...</span>
              </>
            ) : paymentMethod === 'RAZORPAY' ? (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Pay via Razorpay ({STORE_SETTINGS.currencySymbol}{total})</span>
              </>
            ) : paymentMethod === 'WHATSAPP' ? (
              <>
                <MessageCircle className="w-4 h-4" />
                <span>Send Order to Akash on WhatsApp ({STORE_SETTINGS.currencySymbol}{total})</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Place Cash on Delivery Order ({STORE_SETTINGS.currencySymbol}{total})</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
