"use client";

import React from 'react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { STORE_SETTINGS } from '@/data/products';
import { Star, Plus, Minus, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { cart, addToCart, updateQuantity, setSelectedProductForModal } = useCart();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Product Image & Badges */}
      <div 
        className="relative w-full aspect-square bg-slate-50 cursor-pointer overflow-hidden"
        onClick={() => setSelectedProductForModal(product)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Tag */}
        {product.tag && (
          <div className="absolute top-2.5 left-2.5 bg-sky-600 text-white font-bold text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-md shadow-xs">
            {product.tag}
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
            {discountPercent}% OFF
          </div>
        )}

        {/* Low Stock Urgency Pill */}
        {product.stockCount > 0 && product.stockCount <= 5 && (
          <div className="absolute bottom-2.5 left-2.5 bg-rose-600/95 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 animate-pulse">
            <span>🔥 Only {product.stockCount} Left!</span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none sm:pointer-events-auto">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductForModal(product);
            }}
            className="px-3.5 py-1.5 rounded-full bg-white/95 text-slate-800 text-xs font-semibold shadow-md flex items-center gap-1 hover:bg-white"
          >
            <Eye className="w-3.5 h-3.5 text-sky-600" />
            Quick View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Unit */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
              {product.categoryLabel}
            </span>
            <span className="font-semibold text-slate-600">{product.unit}</span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => setSelectedProductForModal(product)}
            className="font-bold text-sm text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Fragrance or Highlight */}
          {product.fragranceOrType && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              {product.fragranceOrType}
            </p>
          )}

          {/* Rating & Subscribe Option */}
          <div className="flex items-center justify-between gap-1.5 mt-2">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[11px] font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
            </div>
            {product.category !== 'mops-tools' && (
              <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100/80">
                15% Refill Off
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart */}
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

          {/* Add / Stepper Button */}
          {!product.inStock ? (
            <button
              disabled
              className="px-3 py-2 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : quantityInCart === 0 ? (
            <button
              onClick={() => addToCart(product, 1)}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm shadow-sky-600/20 active:scale-95 transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center bg-slate-900 text-white rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                className="p-1.5 sm:p-2 hover:bg-slate-800 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 text-xs font-bold min-w-6 text-center text-sky-400">
                {quantityInCart}
              </span>
              <button
                onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                className="p-1.5 sm:p-2 hover:bg-slate-800 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
