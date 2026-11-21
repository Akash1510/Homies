"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { STORE_SETTINGS } from '@/data/products';
import { X, Star, CheckCircle2, Droplet, Plus, Minus, MessageCircle, ShoppingBag } from 'lucide-react';
import { PincodeChecker } from '@/components/PincodeChecker';
import { ProductReviews } from '@/components/ProductReviews';
import { ProductDetailGallery } from './product-detail/ProductDetailGallery';
import { ProductSubscriptionSelector } from './product-detail/ProductSubscriptionSelector';
import { ProductDetailComboUpsell } from './product-detail/ProductDetailComboUpsell';

export function ProductDetailModal() {
  const { selectedProductForModal, setSelectedProductForModal, addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);

  if (!selectedProductForModal) return null;

  const product = selectedProductForModal;
  const unitPrice = isSubscription ? Math.round(product.price * 0.85) : product.price;
  const totalPrice = unitPrice * qty;
  const discountPercent = Math.round(((product.originalPrice - unitPrice) / product.originalPrice) * 100);

  const handleWhatsAppQuickBuy = () => {
    const text = encodeURIComponent(
      `Hello ${STORE_SETTINGS.storeName}! I want to order:\n📦 Product: ${product.name} (${product.unit})\n` +
      `🔢 Quantity: ${qty}\n` + (isSubscription ? `🔄 Option: Monthly Auto-Refill (15% OFF)\n` : '') +
      `💰 Total: ${STORE_SETTINGS.currencySymbol}${totalPrice}\nPlease confirm delivery.`
    );
    window.open(`https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setSelectedProductForModal(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <ProductDetailGallery product={product} />

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full uppercase tracking-wide">
                  {product.categoryLabel}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-snug">{product.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {product.category !== 'mops-tools' && (
                <ProductSubscriptionSelector
                  isSubscription={isSubscription}
                  onToggleSubscription={setIsSubscription}
                />
              )}

              {/* Pricing & Stepper */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{STORE_SETTINGS.currencySymbol}{unitPrice}</span>
                    {product.originalPrice > unitPrice && (
                      <span className="text-sm text-slate-400 line-through">{STORE_SETTINGS.currencySymbol}{product.originalPrice}</span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{discountPercent}% OFF</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Unit: {product.unit}</p>
                </div>

                <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-2xs">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2 text-slate-600 hover:text-slate-900"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="w-7 text-center font-bold text-sm text-slate-800">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="p-2 text-slate-600 hover:text-slate-900"><Plus className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => { addToCart(product, qty, isSubscription); setSelectedProductForModal(null); }}
                  className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart ({STORE_SETTINGS.currencySymbol}{totalPrice}){isSubscription ? ' • 15% Off Refill' : ''}</span>
                </button>
                <button
                  onClick={handleWhatsAppQuickBuy}
                  className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /><span>Instant Order on WhatsApp</span>
                </button>
              </div>

              <PincodeChecker />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-4">
            <ProductDetailComboUpsell currentProduct={product} />

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Product Description</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {product.benefits && product.benefits.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Key Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-sky-50/60 p-2.5 rounded-xl border border-sky-100/80">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.usageInstructions && (
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-2xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                  <Droplet className="w-3.5 h-3.5 text-amber-600" /><span>Directions For Use</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">{product.usageInstructions}</p>
              </div>
            )}

            <ProductReviews productId={product.id} reviews={product.reviews} />
          </div>
        </div>
      </div>
    </div>
  );
}
