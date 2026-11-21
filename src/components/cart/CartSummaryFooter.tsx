"use client";

import React from 'react';
import { STORE_SETTINGS } from '@/data/products';
import { Coupon } from '@/types/product';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface CartSummaryFooterProps {
  subtotal: number;
  deliveryCharge: number;
  couponDiscount: number;
  appliedCoupon: Coupon | null;
  totalSavings: number;
  total: number;
  onProceed: () => void;
  onClear: () => void;
}

export function CartSummaryFooter({
  subtotal,
  deliveryCharge,
  couponDiscount,
  appliedCoupon,
  totalSavings,
  total,
  onProceed,
  onClear,
}: CartSummaryFooterProps) {
  return (
    <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-3.5">
      <div className="space-y-1.5 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">{STORE_SETTINGS.currencySymbol}{subtotal}</span>
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

      <button
        onClick={onProceed}
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
        <button onClick={onClear} className="hover:text-rose-500 transition-colors">
          Clear all
        </button>
      </div>
    </div>
  );
}
