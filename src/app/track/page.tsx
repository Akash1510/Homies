"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { STORE_SETTINGS } from '@/data/products';
import { OrderDetails } from '@/types/product';
import { Search, ArrowLeft, Truck, PackageCheck, AlertCircle } from 'lucide-react';
import { TrackTimelineView } from './components/TrackTimelineView';

export default function OrderTrackingPage() {
  const { orders } = useCart();
  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (orders.length > 0 && !selectedOrder) {
      setSelectedOrder(orders[0]);
      setSearchId(orders[0].orderId);
    }
  }, [orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const clean = searchId.trim().toUpperCase();
    const found = orders.find((o) => o.orderId.toUpperCase() === clean);
    setSelectedOrder(found || null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>
          <span className="text-xs text-slate-400">Homies Clean Live Dispatch</span>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900">Live Order & Courier Tracking</h1>
              <p className="text-xs text-slate-500">Enter order ID (e.g. HMY-XXXXXX) for live milestone status</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. HMY-123456)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-mono text-slate-900 uppercase"
              />
            </div>
            <button type="submit" className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all">
              Track Order
            </button>
          </form>
        </div>

        {selectedOrder ? (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-8 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tracking Reference</span>
                <h2 className="text-lg sm:text-xl font-mono font-black text-sky-600">{selectedOrder.orderId}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Status:</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <TrackTimelineView order={selectedOrder} />

            {/* Item summary */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Shipment Contents</span>
              <div className="space-y-2">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 rounded-xl">
                    <span className="font-semibold text-slate-800">{it.quantity}× {it.product.name} ({it.product.unit})</span>
                    <span className="font-bold text-slate-900">{STORE_SETTINGS.currencySymbol}{it.quantity * it.product.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          searched && (
            <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Order Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Could not find an order with ID &quot;{searchId}&quot;. Please verify your order receipt.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
