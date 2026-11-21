"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { STORE_SETTINGS } from '@/data/products';
import { OrderDetails, OrderStatus } from '@/types/product';
import {
  Search,
  ArrowLeft,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageCircle,
  AlertCircle
} from 'lucide-react';

export default function OrderTrackingPage() {
  const { orders } = useCart();
  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // If order in query string or recent orders exist, default to the latest
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

  const getTimelineSteps = (status: OrderStatus) => {
    const steps = [
      { key: 'Pending', label: 'Order Placed', desc: 'Received & Queued' },
      { key: 'Confirmed', label: 'Confirmed', desc: 'Payment & Stock Verified' },
      { key: 'Processing', label: 'Packing', desc: 'Boxed at Warehouse' },
      { key: 'Shipped', label: 'Dispatched', desc: 'Out for Doorstep Delivery' },
      { key: 'Delivered', label: 'Delivered', desc: 'Package Handed Over' },
    ];

    const statusWeights: Record<string, number> = {
      Pending: 1,
      Confirmed: 2,
      Processing: 3,
      Shipped: 4,
      Delivered: 5,
      Cancelled: 0,
    };

    const currentWeight = statusWeights[status] || 1;
    return steps.map((s, idx) => ({
      ...s,
      completed: idx + 1 <= currentWeight,
      current: idx + 1 === currentWeight,
    }));
  };

  const handleWhatsAppStatusInquiry = (orderId: string) => {
    const text = encodeURIComponent(
      `Hello ${STORE_SETTINGS.storeName}, I am tracking order *${orderId}*. Please share live courier tracking details.`
    );
    window.open(`https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>
          <span className="text-xs text-slate-400">Homies Clean Live Dispatch</span>
        </div>

        {/* Search Order Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900">
                Live Order & Courier Tracking
              </h1>
              <p className="text-xs text-slate-500">
                Enter your order ID (e.g. HMY-XXXXXX) to view real-time delivery status
              </p>
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
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-slate-900 uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Selected Order Tracking Timeline */}
        {selectedOrder ? (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-8 animate-fadeIn">
            
            {/* Top Order Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tracking Reference
                </span>
                <h2 className="text-lg sm:text-xl font-mono font-black text-sky-600">
                  {selectedOrder.orderId}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  selectedOrder.status === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedOrder.status === 'Shipped'
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>Status: {selectedOrder.status}</span>
                </span>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  Amount: {STORE_SETTINGS.currencySymbol}{selectedOrder.total} ({selectedOrder.paymentMethod})
                </p>
              </div>
            </div>

            {/* Visual Step Timeline */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Delivery Milestones
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
                {getTimelineSteps(selectedOrder.status).map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      step.current
                        ? 'border-sky-500 bg-sky-50/70 shadow-xs'
                        : step.completed
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-slate-100 bg-slate-50/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                      )}
                      <span className="font-bold text-xs text-slate-900">{step.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Destination & Package Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Shipping Destination
                </span>
                <h4 className="font-bold text-slate-900">{selectedOrder.customerName}</h4>
                <p className="text-slate-600">{selectedOrder.address}</p>
                <p className="text-slate-600 font-semibold">{selectedOrder.city} - {selectedOrder.pincode}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Package Contents ({selectedOrder.items.length} items)
                </span>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-slate-700">
                    <span>{item.quantity}× {item.product.name}</span>
                    <span className="font-bold">
                      {STORE_SETTINGS.currencySymbol}{item.quantity * item.product.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action: Ping on WhatsApp */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Need urgent status or change in address?
              </p>
              <button
                onClick={() => handleWhatsAppStatusInquiry(selectedOrder.orderId)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask Akash on WhatsApp</span>
              </button>
            </div>

          </div>
        ) : searched ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No order found with ID &ldquo;{searchId}&rdquo;</h3>
            <p className="text-xs text-slate-400">
              Please double check the order reference number from your SMS/WhatsApp confirmation.
            </p>
          </div>
        ) : null}

      </div>
    </div>
  );
}
