"use client";

import React from 'react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { Star } from 'lucide-react';
import { ProductCardMedia } from './product/ProductCardMedia';
import { ProductCardPricing } from './product/ProductCardPricing';

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
      <ProductCardMedia
        product={product}
        discountPercent={discountPercent}
        onOpenModal={() => setSelectedProductForModal(product)}
      />

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
        <ProductCardPricing
          product={product}
          quantityInCart={quantityInCart}
          onAddToCart={() => addToCart(product, 1)}
          onUpdateQuantity={(q) => updateQuantity(product.id, q)}
        />
      </div>
    </div>
  );
}

