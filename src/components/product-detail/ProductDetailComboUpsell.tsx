"use client";

import React from 'react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { STORE_SETTINGS } from '@/data/products';
import { Sparkles, Plus } from 'lucide-react';

interface ProductDetailComboUpsellProps {
  currentProduct: Product;
}

export function ProductDetailComboUpsell({ currentProduct }: ProductDetailComboUpsellProps) {
  const { products, addToCart } = useCart();

  // Pick complementary product
  const complement = products.find(
    (p) => p.id !== currentProduct.id && p.inStock && p.category !== currentProduct.category
  );

  if (!complement) return null;

  const comboTotal = currentProduct.price + complement.price;
  const comboDiscounted = Math.round(comboTotal * 0.9); // 10% combo discount
  const savings = comboTotal - comboDiscounted;

  const handleAddCombo = () => {
    addToCart(currentProduct, 1);
    addToCart(complement, 1);
  };

  return (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-3.5 border border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
          <Sparkles className="w-4 h-4 animate-spin" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900">
            Combo Deal: Add {complement.name}
          </p>
          <p className="text-[11px] text-teal-800 font-medium">
            Buy together for <span className="font-extrabold text-teal-900">{STORE_SETTINGS.currencySymbol}{comboDiscounted}</span> (Save {STORE_SETTINGS.currencySymbol}{savings}!)
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddCombo}
        className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Combo</span>
      </button>
    </div>
  );
}
