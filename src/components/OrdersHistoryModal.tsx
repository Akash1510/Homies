"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import { STORE_SETTINGS } from '@/data/products';
import { X, PackageCheck, Calendar, Clock, MessageCircle } from 'lucide-react';

interface OrdersHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrdersHistoryModal({ isOpen, onClose }: OrdersHistoryModalProps) {
  const { orders } = useCart();

  if (!isOpen) return null;

  const handleInquireOrder = (orderId: string) => {
    const text = encodeURIComponent(
      `Hello ${STORE_SETTINGS.storeName}, I would like to inquire about the status of my order *${orderId}*.`
    );
    window.open(`https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-sky-600" />
            <h2 className="text-base sm:text-lg font-black text-slate-900">Your Recent Orders</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              You have not placed any orders yet.
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.orderId}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                  <div>
                    <span className="font-mono font-bold text-sky-600 text-sm">
                      {ord.orderId}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        {ord.paymentMethod === 'COD' ? 'Cash on Delivery' : 'WhatsApp Order'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInquireOrder(ord.orderId)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 hover:bg-emerald-200 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Track on WhatsApp</span>
                  </button>
                </div>

                {/* Items */}
                <div className="space-y-1.5">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-700">
                      <span>
                        {item.quantity}× {item.product.name} ({item.product.unit})
                      </span>
                      <span className="font-semibold">
                        {STORE_SETTINGS.currencySymbol}{item.quantity * item.product.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer total */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs font-bold text-slate-900">
                  <span className="text-slate-500 font-normal">Delivered to: {ord.city}</span>
                  <span className="text-sm font-extrabold text-sky-700">
                    Total: {STORE_SETTINGS.currencySymbol}{ord.total}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
