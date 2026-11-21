"use client";

import React from 'react';
import { Product } from '@/types/product';
import { Eye } from 'lucide-react';

interface ProductCardMediaProps {
  product: Product;
  discountPercent: number;
  onOpenModal: () => void;
}

export function ProductCardMedia({ product, discountPercent, onOpenModal }: ProductCardMediaProps) {
  return (
    <div
      className="relative w-full aspect-square bg-slate-50 cursor-pointer overflow-hidden"
      onClick={onOpenModal}
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
            onOpenModal();
          }}
          className="px-3.5 py-1.5 rounded-full bg-white/95 text-slate-800 text-xs font-semibold shadow-md flex items-center gap-1 hover:bg-white"
        >
          <Eye className="w-3.5 h-3.5 text-sky-600" />
          Quick View
        </button>
      </div>
    </div>
  );
}
