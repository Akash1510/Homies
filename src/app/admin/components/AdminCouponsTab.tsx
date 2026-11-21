"use client";

import React from 'react';
import { AVAILABLE_COUPONS, STORE_SETTINGS } from '@/data/products';

export function AdminCouponsTab() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-900">Active Discount & Promo Coupons</h3>
        <p className="text-xs text-slate-500">Available promotional vouchers for customer checkout</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {AVAILABLE_COUPONS.map((cpn) => (
          <div key={cpn.code} className="p-4 rounded-2xl border border-teal-200 bg-teal-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-sm text-teal-800 bg-white px-2.5 py-1 rounded-lg border border-teal-300">
                {cpn.code}
              </span>
              <span className="text-xs font-bold text-emerald-700">
                {cpn.discountType === 'fixed' ? `₹${cpn.discountValue} OFF` : `${cpn.discountValue}% OFF`}
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium">{cpn.description}</p>
            <p className="text-[10px] text-slate-500">
              Min Order: {STORE_SETTINGS.currencySymbol}{cpn.minOrderAmount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
