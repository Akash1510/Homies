"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import { STORE_SETTINGS } from '@/data/products';
import { CheckCircle, MessageCircle, Package, ArrowRight, Home } from 'lucide-react';

export function OrderSuccessModal() {
  const { isOrderSuccessOpen, setIsOrderSuccessOpen, lastOrder } = useCart();

  if (!isOrderSuccessOpen || !lastOrder) return null;

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hi ${STORE_SETTINGS.storeName}, I placed Order *${lastOrder.orderId}* for ${STORE_SETTINGS.currencySymbol}${lastOrder.total}. Could you please share the delivery updates?`
    );
    window.open(`https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Checkmark Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            Order Confirmed
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Thank you, {lastOrder.customerName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Your home cleaning essentials are being prepped for dispatch.
          </p>
        </div>

        {/* Order Card info */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left space-y-2 text-xs">
          <div className="flex justify-between font-bold text-slate-800 border-b border-slate-200 pb-2">
            <span>Order Reference:</span>
            <span className="font-mono text-sky-600">{lastOrder.orderId}</span>
          </div>

          <div className="flex justify-between text-slate-600 pt-1">
            <span>Delivery To:</span>
            <span className="text-right font-medium max-w-[200px] truncate text-slate-800">
              {lastOrder.address}, {lastOrder.city} - {lastOrder.pincode}
            </span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Payment Method:</span>
            <span className="font-semibold text-slate-800">
              {lastOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'WhatsApp Order (Direct)'}
            </span>
          </div>

          <div className="flex justify-between font-extrabold text-sm text-slate-900 border-t border-slate-200 pt-2">
            <span>Total Payable:</span>
            <span className="text-emerald-600">{STORE_SETTINGS.currencySymbol}{lastOrder.total}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleWhatsAppInquiry}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with Us on WhatsApp for Updates</span>
          </button>

          <button
            onClick={() => setIsOrderSuccessOpen(false)}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

      </div>
    </div>
  );
}
