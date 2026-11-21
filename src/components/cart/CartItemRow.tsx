"use client";

import React from 'react';
import { CartItem } from '@/types/product';
import { STORE_SETTINGS } from '@/data/products';
import { Plus, Minus, Trash2, Sparkles } from 'lucide-react';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const { product, quantity, isSubscription } = item;
  const itemUnitPrice = isSubscription ? Math.round(product.price * 0.85) : product.price;

  return (
    <div className="flex gap-3.5 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.image}
        alt={product.name}
        className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 shrink-0"
      />

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{product.name}</h4>
            <button
              onClick={() => onRemove(product.id)}
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

          <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-2xs">
            <button
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-xs font-bold text-slate-800">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              className="p-1 hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
