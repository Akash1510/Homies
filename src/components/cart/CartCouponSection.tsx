"use client";

import React, { useState } from 'react';
import { Coupon } from '@/types/product';
import { STORE_SETTINGS } from '@/data/products';
import { Tag, Check } from 'lucide-react';

interface CartCouponSectionProps {
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  onRemoveCoupon: () => void;
}

export function CartCouponSection({
  appliedCoupon,
  couponDiscount,
  onApplyCoupon,
  onRemoveCoupon,
}: CartCouponSectionProps) {
  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApply = (codeToApply: string) => {
    if (!codeToApply.trim()) return;
    const res = onApplyCoupon(codeToApply.trim());
    setCouponFeedback(res);
    if (res.success) setCouponCode('');
  };

  return (
    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-sky-600" />
          <span>Apply Promo Code</span>
        </span>
        {appliedCoupon && (
          <button
            onClick={onRemoveCoupon}
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
              onClick={() => handleApply(couponCode)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Apply
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[10px] text-slate-400 font-semibold">Try:</span>
            {['HOMIES50', 'CLEAN20', 'FIRST10'].map((c) => (
              <button
                key={c}
                onClick={() => handleApply(c)}
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
  );
}
