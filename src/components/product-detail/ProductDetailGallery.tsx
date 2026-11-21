"use client";

import React, { useState } from 'react';
import { Product } from '@/types/product';

interface ProductDetailGalleryProps {
  product: Product;
}

export function ProductDetailGallery({ product }: ProductDetailGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const currentImg = selectedImage || product.image;
  const allImages = [product.image, ...(product.additionalImages || [])];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={currentImg} alt={product.name} className="w-full h-full object-cover" />
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
  );
}
