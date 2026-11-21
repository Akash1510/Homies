"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import { STORE_SETTINGS } from '@/data/products';
import { Sparkles, Plus, Check } from 'lucide-react';

export function CartBundleUpsell() {
  const { products, cart, addToCart } = useCart();

  // Find products not currently in cart to recommend as quick add
  const cartIds = new Set(cart.map((i) => i.product.id));
  const suggested = products.filter((p) => p.inStock && !cartIds.has(p.id)).slice(0, 2);

  if (suggested.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-sky-50/80 to-teal-50/50 rounded-2xl p-3 border border-sky-100 my-3">
      <div className="flex items-center gap-1.5 mb-2.5">
        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
        <span className="text-xs font-bold text-slate-800">Frequently Bought Together</span>
        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-1.5 py-0.5 rounded-full">
          Save more
        </span>
      </div>

      <div className="space-y-2">
        {suggested.map((prod) => (
          <div key={prod.id} className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-100 shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover bg-slate-50 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{prod.name}</p>
                <p className="text-[11px] text-sky-700 font-semibold">
                  {STORE_SETTINGS.currencySymbol}{prod.price} <span className="line-through text-slate-400 font-normal">{STORE_SETTINGS.currencySymbol}{prod.originalPrice}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => addToCart(prod, 1)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
