"use client";

import React from 'react';
import { Product } from '@/types/product';
import { AlertTriangle } from 'lucide-react';

interface AdminLowStockTabProps {
  lowStockProducts: Product[];
  onRestock: (product: Product, quantity: number) => void;
}

export function AdminLowStockTab({ lowStockProducts, onRestock }: AdminLowStockTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Low Stock Urgency Monitor</h3>
            <p className="text-xs text-slate-500">Products with 5 or fewer items remaining</p>
          </div>
        </div>
        <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
          {lowStockProducts.length} Items Need Restocking
        </span>
      </div>

      {lowStockProducts.length === 0 ? (
        <div className="p-10 text-center text-slate-500 text-xs">
          All products have healthy inventory levels (&gt; 5 items).
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {lowStockProducts.map((prod) => (
            <div key={prod.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{prod.name}</h4>
                  <span className="text-[11px] font-bold text-rose-600">
                    Hurry: only {prod.stockCount} units remaining
                  </span>
                </div>
              </div>

              <button
                onClick={() => onRestock(prod, 20)}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs"
              >
                + Restock 20 Units
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
