"use client";

import React from 'react';
import { DollarSign, Clock, Truck, CheckCircle, AlertTriangle } from 'lucide-react';
import { STORE_SETTINGS } from '@/data/products';

interface AdminMetricsBarProps {
  totalRevenue: number;
  totalOrdersCount: number;
  pendingCount: number;
  shippedCount: number;
  deliveredCount: number;
  lowStockCount: number;
  onSelectLowStock: () => void;
}

export function AdminMetricsBar({
  totalRevenue,
  totalOrdersCount,
  pendingCount,
  shippedCount,
  deliveredCount,
  lowStockCount,
  onSelectLowStock,
}: AdminMetricsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
          <DollarSign className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900">
          {STORE_SETTINGS.currencySymbol}{totalRevenue}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">{totalOrdersCount} total orders</p>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
          <Clock className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-amber-600">
          {pendingCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Needs packing</p>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">In Transit</span>
          <Truck className="w-4 h-4 text-sky-600" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-sky-600">
          {shippedCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Out for delivery</p>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Delivered</span>
          <CheckCircle className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-emerald-600">
          {deliveredCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Completed orders</p>
      </div>

      <div
        onClick={onSelectLowStock}
        className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-rose-300 transition-colors"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Low Stock</span>
          <AlertTriangle className="w-4 h-4 text-rose-600" />
        </div>
        <div className="text-xl sm:text-2xl font-black text-rose-600">
          {lowStockCount}
        </div>
        <p className="text-[11px] text-rose-500 font-semibold mt-1">≤ 5 items remaining</p>
      </div>
    </div>
  );
}
