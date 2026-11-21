"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { STORE_SETTINGS } from '@/data/products';
import { X, Star, CheckCircle2, Droplet, Plus, Minus, MessageCircle, ShoppingBag, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import { PincodeChecker } from '@/components/PincodeChecker';
import { ProductReviews } from '@/components/ProductReviews';

export function ProductDetailModal() {
  const { selectedProductForModal, setSelectedProductForModal, addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);

  if (!selectedProductForModal) return null;

  const product = selectedProductForModal;
  const currentImg = selectedImage || product.image;
  const allImages = [product.image, ...(product.additionalImages || [])];

  const unitPrice = isSubscription ? Math.round(product.price * 0.85) : product.price;
  const totalPrice = unitPrice * qty;

  const discountPercent = Math.round(
    ((product.originalPrice - unitPrice) / product.originalPrice) * 100
  );

  const handleWhatsAppQuickBuy = () => {
    const text = encodeURIComponent(
      `Hello ${STORE_SETTINGS.storeName}! I want to order:\n` +
      `📦 Product: ${product.name} (${product.unit})\n` +
      `🔢 Quantity: ${qty}\n` +
      (isSubscription ? `🔄 Option: Monthly Auto-Refill (15% OFF)\n` : '') +
      `💰 Total: ${STORE_SETTINGS.currencySymbol}${totalPrice}\n\n` +
      `Please let me know how to proceed with delivery.`
    );
    window.open(`https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForModal(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            
            {/* Gallery Section */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImg}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.tag && (
                  <span className="absolute top-3 left-3 bg-sky-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                    {product.tag}
                  </span>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-2">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        currentImg === img ? 'border-sky-600 scale-95' : 'border-transparent opacity-70'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta & Pricing */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full uppercase tracking-wide">
                  {product.categoryLabel}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-snug">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    ({product.reviewsCount} verified reviews)
                  </span>
                </div>
              </div>

              {/* Purchase Mode Toggle: One-Time vs Subscribe & Save 15% */}
              {product.category !== 'mops-tools' && (
                <div className="p-3 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-teal-800 tracking-wide flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-teal-600 animate-spin-slow" />
                      <span>Delivery Frequency</span>
                    </span>
                    <span className="text-[10px] font-extrabold bg-teal-600 text-white px-2 py-0.5 rounded-full">
                      Save 15%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsSubscription(false)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        !isSubscription
                          ? 'border-sky-600 bg-white shadow-xs font-bold text-slate-900'
                          : 'border-transparent bg-white/60 text-slate-600'
                      }`}
                    >
                      <div>One-Time</div>
                      <div className="text-[11px] text-slate-500 font-normal">Standard Order</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsSubscription(true)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        isSubscription
                          ? 'border-teal-600 bg-white shadow-xs font-bold text-teal-900'
                          : 'border-transparent bg-white/60 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-teal-700">
                        <span>Subscribe</span>
                        <Sparkles className="w-3 h-3 text-amber-500" />
                      </div>
                      <div className="text-[11px] text-teal-600 font-medium">Refill every 30 days</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      {STORE_SETTINGS.currencySymbol}{unitPrice}
                    </span>
                    {product.originalPrice > unitPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {STORE_SETTINGS.currencySymbol}{product.originalPrice}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Unit: {product.unit}</p>
                </div>

                {/* Quantity picker */}
                <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-2xs">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="p-2 text-slate-600 hover:text-slate-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center font-bold text-sm text-slate-800">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="p-2 text-slate-600 hover:text-slate-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    addToCart(product, qty, isSubscription);
                    setSelectedProductForModal(null);
                  }}
                  className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    Add to Cart ({STORE_SETTINGS.currencySymbol}{totalPrice})
                    {isSubscription ? ' • 15% Off Refill' : ''}
                  </span>
                </button>

                <button
                  onClick={handleWhatsAppQuickBuy}
                  className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant Order on WhatsApp</span>
                </button>
              </div>

              {/* Delivery Pincode Checker */}
              <div className="pt-2">
                <PincodeChecker />
              </div>

            </div>
          </div>

          {/* Description & Benefits */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Product Description</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Highlights */}
            {product.benefits && product.benefits.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Key Features & Protection</h4>
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

            {/* How to use */}
            {product.usageInstructions && (
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-2xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                  <Droplet className="w-3.5 h-3.5 text-amber-600" />
                  <span>Directions For Use</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {product.usageInstructions}
                </p>
              </div>
            )}

            {/* Customer Reviews & Form */}
            <ProductReviews productId={product.id} reviews={product.reviews} />
          </div>
        </div>

      </div>
    </div>
  );
}
