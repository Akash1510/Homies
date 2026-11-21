"use client";

import React from 'react';
import { OrderDetails, OrderStatus } from '@/types/product';
import { STORE_SETTINGS } from '@/data/products';
import { CheckCircle2, Clock, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';

interface TrackTimelineViewProps {
  order: OrderDetails;
}

export function TrackTimelineView({ order }: TrackTimelineViewProps) {
  const getTimelineSteps = (status: OrderStatus) => {
    const steps = [
      { key: 'Pending', label: 'Order Placed', desc: 'Received & Queued' },
      { key: 'Confirmed', label: 'Confirmed', desc: 'Stock Verified' },
      { key: 'Processing', label: 'Packing', desc: 'Boxed at Warehouse' },
      { key: 'Shipped', label: 'Dispatched', desc: 'Out for Doorstep Delivery' },
      { key: 'Delivered', label: 'Delivered', desc: 'Package Handed Over' },
    ];

    const statusWeights: Record<string, number> = {
      Pending: 1, Confirmed: 2, Processing: 3, Shipped: 4, Delivered: 5, Cancelled: 0,
    };

    const currentWeight = statusWeights[status] || 1;
    return steps.map((s, idx) => ({
      ...s,
      completed: idx + 1 <= currentWeight,
      current: idx + 1 === currentWeight,
    }));
  };

  const steps = getTimelineSteps(order.status);

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello ${STORE_SETTINGS.storeName}, I am tracking order *${order.orderId}*. Please share live status.`
    );
    window.open(`https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* 5-Step Stepper */}
      <div className="relative">
        <div className="hidden sm:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0" />
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
          {steps.map((st, i) => (
            <div key={i} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                  st.current
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 scale-110'
                    : st.completed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {st.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </div>
              <div>
                <span className={`text-xs font-bold block ${st.current ? 'text-sky-600' : st.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                  {st.label}
                </span>
                <span className="text-[10px] text-slate-400 block">{st.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {order.status === 'Cancelled' && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>This order has been cancelled. Any pre-paid payments are auto-refunded to your source account.</span>
        </div>
      )}

      {/* Inquiry Trigger */}
      <div className="flex items-center justify-between p-4 bg-sky-50/70 border border-sky-100 rounded-2xl text-xs">
        <div className="flex items-center gap-2 text-sky-900 font-semibold">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>Need live courier update? Dispatch team is ready.</span>
        </div>
        <button
          onClick={handleWhatsAppInquiry}
          className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs hover:bg-emerald-500 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Ask on WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
