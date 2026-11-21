"use client";

import React from 'react';
import { AlertCircle, MessageCircle, Banknote } from 'lucide-react';

interface CheckoutFallbackAlertProps {
  message: string;
  onSelectWhatsApp: () => void;
  onSelectCOD: () => void;
}

export function CheckoutFallbackAlert({
  message,
  onSelectWhatsApp,
  onSelectCOD,
}: CheckoutFallbackAlertProps) {
  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs">
      <div className="flex items-start gap-2 text-amber-900 font-bold">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>Payment Gateway Interrupted / Cancelled</span>
      </div>
      <p className="text-amber-800 leading-relaxed text-[11px]">{message}</p>
      <div className="flex gap-2 pt-1 flex-wrap">
        <button
          type="button"
          onClick={onSelectWhatsApp}
          className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Switch to WhatsApp (+91 7776032964)</span>
        </button>
        <button
          type="button"
          onClick={onSelectCOD}
          className="px-3 py-1.5 bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs"
        >
          <Banknote className="w-3.5 h-3.5" />
          <span>Pay Cash on Delivery</span>
        </button>
      </div>
    </div>
  );
}
