"use client";

import React from 'react';
import { CreditCard, MessageCircle, Banknote, ShieldCheck } from 'lucide-react';

interface CheckoutPaymentSelectorProps {
  paymentMethod: 'RAZORPAY' | 'WHATSAPP' | 'COD';
  onChangeMethod: (m: 'RAZORPAY' | 'WHATSAPP' | 'COD') => void;
}

export function CheckoutPaymentSelector({ paymentMethod, onChangeMethod }: CheckoutPaymentSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
        2. Select Payment Method
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Razorpay Option */}
        <button
          type="button"
          onClick={() => onChangeMethod('RAZORPAY')}
          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
            paymentMethod === 'RAZORPAY'
              ? 'border-sky-600 bg-sky-50/50 shadow-xs ring-1 ring-sky-500'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <CreditCard className="w-4 h-4 text-sky-600" />
            <span className="text-[10px] font-extrabold uppercase bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">
              Online
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xs font-bold text-slate-900 block">Razorpay Gateway</span>
            <p className="text-[10px] text-slate-500">UPI, Cards, NetBanking</p>
          </div>
        </button>

        {/* WhatsApp Option */}
        <button
          type="button"
          onClick={() => onChangeMethod('WHATSAPP')}
          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
            paymentMethod === 'WHATSAPP'
              ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
              Direct
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xs font-bold text-slate-900 block">WhatsApp Order</span>
            <p className="text-[10px] text-slate-500">Send to +91 7776032964</p>
          </div>
        </button>

        {/* Cash On Delivery */}
        <button
          type="button"
          onClick={() => onChangeMethod('COD')}
          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
            paymentMethod === 'COD'
              ? 'border-slate-800 bg-slate-50 shadow-xs ring-1 ring-slate-800'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <Banknote className="w-4 h-4 text-slate-700" />
            <span className="text-[10px] font-extrabold uppercase bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
              Cash
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xs font-bold text-slate-900 block">Cash on Delivery</span>
            <p className="text-[10px] text-slate-500">Doorstep Cash / QR UPI</p>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/60 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Fail-safe architecture: Instant 1-click fallback to WhatsApp if gateway cancels.</span>
      </div>
    </div>
  );
}
