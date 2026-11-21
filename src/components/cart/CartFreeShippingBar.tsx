"use client";

import React from 'react';
import { Truck } from 'lucide-react';
import { STORE_SETTINGS } from '@/data/products';

interface CartFreeShippingBarProps {
  subtotal: number;
  freeDeliveryRemaining: number;
}

export function CartFreeShippingBar({ subtotal, freeDeliveryRemaining }: CartFreeShippingBarProps) {
  const freeDeliveryProgress = Math.min(
    100,
    (subtotal / STORE_SETTINGS.freeDeliveryThreshold) * 100
  );

  return (
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
  );
}
