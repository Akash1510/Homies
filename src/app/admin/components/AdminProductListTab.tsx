"use client";

import React from 'react';
import { Product } from '@/types/product';
import { STORE_SETTINGS } from '@/data/products';
import { Plus, ToggleLeft, ToggleRight } from 'lucide-react';

interface AdminProductListTabProps {
  products: Product[];
  showAddModal: boolean;
  onToggleAddModal: () => void;
  onUpdateProduct: (product: Product) => void;
  onResetProducts: () => void;
}

export function AdminProductListTab({
  products,
  showAddModal,
  onToggleAddModal,
  onUpdateProduct,
  onResetProducts,
}: AdminProductListTabProps) {
  return (
    <div className="space-y-4">
      {/* Top action header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Live Inventory & Stock Status</h3>
          <p className="text-xs text-slate-500">Toggle item availability, adjust stock numbers, or upload new products</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAddModal}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddModal ? 'Close Form' : 'Add New Product'}</span>
          </button>

          <button
            onClick={onResetProducts}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Product Items */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 divide-y divide-slate-100">
        {products.map((prod) => (
          <div key={prod.id} className="py-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">{prod.name}</h4>
                <p className="text-[11px] text-slate-500">
                  {prod.categoryLabel} • {prod.unit}
                  {prod.stockCount <= 5 && (
                    <span className="ml-2 font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                      Only {prod.stockCount} left
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Stock Stepper */}
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 text-xs">
                <button
                  onClick={() => onUpdateProduct({ ...prod, stockCount: Math.max(0, prod.stockCount - 1) })}
                  className="px-2 py-1 text-slate-600 hover:text-slate-900"
                >
                  -
                </button>
                <span className="px-2 font-bold text-slate-800">{prod.stockCount} in stock</span>
                <button
                  onClick={() => onUpdateProduct({ ...prod, stockCount: prod.stockCount + 1 })}
                  className="px-2 py-1 text-slate-600 hover:text-slate-900"
                >
                  +
                </button>
              </div>

              <span className="font-extrabold text-sm text-slate-800">
                {STORE_SETTINGS.currencySymbol}{prod.price}
              </span>

              <button
                onClick={() => onUpdateProduct({ ...prod, inStock: !prod.inStock })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  prod.inStock
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {prod.inStock ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-600" />
                    <span>In Stock</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-rose-500" />
                    <span>Out of Stock</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
