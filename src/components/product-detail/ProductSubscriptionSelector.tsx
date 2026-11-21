"use client";

import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';

interface ProductSubscriptionSelectorProps {
  isSubscription: boolean;
  onToggleSubscription: (isSub: boolean) => void;
}

export function ProductSubscriptionSelector({
  isSubscription,
  onToggleSubscription,
}: ProductSubscriptionSelectorProps) {
  return (
    <div className="p-3 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase text-teal-800 tracking-wide flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-teal-600 animate-spin-slow" />
          <span>Delivery Frequency</span>
        </span>
        <span className="text-[10px] font-extrabold bg-teal-600 text-white px-2 py-0.5 rounded-full">
          Save 15%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          type="button"
          onClick={() => onToggleSubscription(false)}
          className={`p-2 rounded-xl text-left border transition-all ${
            !isSubscription
              ? 'border-sky-600 bg-white shadow-xs font-bold text-slate-900'
              : 'border-transparent bg-white/60 text-slate-600'
          }`}
        >
          <div>One-Time</div>
          <div className="text-[11px] text-slate-500 font-normal">Standard Order</div>
        </button>

        <button
          type="button"
          onClick={() => onToggleSubscription(true)}
          className={`p-2 rounded-xl text-left border transition-all ${
            isSubscription
              ? 'border-teal-600 bg-white shadow-xs font-bold text-teal-900'
              : 'border-transparent bg-white/60 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-1 text-teal-700">
            <span>Subscribe</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </div>
          <div className="text-[11px] text-teal-600 font-medium">Refill every 30 days</div>
        </button>
      </div>
    </div>
  );
}
