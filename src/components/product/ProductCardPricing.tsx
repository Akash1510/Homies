"use client";

import React from 'react';
import { Product } from '@/types/product';
import { STORE_SETTINGS } from '@/data/products';
import { Plus, Minus } from 'lucide-react';

interface ProductCardPricingProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: () => void;
  onUpdateQuantity: (newQty: number) => void;
}

export function ProductCardPricing({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
}: ProductCardPricingProps) {
  return (
    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base sm:text-lg font-black text-slate-900">
            {STORE_SETTINGS.currencySymbol}{product.price}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through">
              {STORE_SETTINGS.currencySymbol}{product.originalPrice}
            </span>
          )}
        </div>
        <p className="text-[10px] text-emerald-600 font-semibold">Taxes included</p>
      </div>

      {!product.inStock ? (
        <button
          disabled
          className="px-3 py-2 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed"
        >
          Sold Out
        </button>
      ) : quantityInCart === 0 ? (
        <button
          onClick={onAddToCart}
          className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm shadow-sky-600/20 active:scale-95 transition-all flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      ) : (
        <div className="flex items-center bg-slate-900 text-white rounded-xl overflow-hidden shadow-xs">
          <button
            onClick={() => onUpdateQuantity(quantityInCart - 1)}
            className="p-1.5 sm:p-2 hover:bg-slate-800 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="px-2 text-xs font-bold min-w-6 text-center text-sky-400">
            {quantityInCart}
          </span>
          <button
            onClick={() => onUpdateQuantity(quantityInCart + 1)}
            className="p-1.5 sm:p-2 hover:bg-slate-800 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
