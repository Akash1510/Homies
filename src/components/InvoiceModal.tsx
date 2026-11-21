"use client";

import React from 'react';
import { OrderDetails } from '@/types/product';
import { STORE_SETTINGS } from '@/data/products';
import { X, Printer, Sparkles, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  order: OrderDetails | null;
  onClose: () => void;
}

export function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar (hidden on print) */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between print:hidden bg-slate-50">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-sky-600" />
            <span className="font-bold text-xs text-slate-800">Printable Invoice & Dispatch Slip</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800 print:p-0 print:m-0">
          
          {/* Top Brand Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-tight text-slate-900">
                  Homies<span className="text-sky-600">Clean</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{STORE_SETTINGS.tagline}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                GSTIN: {STORE_SETTINGS.gstNumber} • Admin: +91 7776032964
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                TAX INVOICE
              </span>
              <h3 className="font-mono font-bold text-base text-sky-700 mt-0.5">
                {order.orderId}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Billing & Delivery Addresses */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <span className="font-extrabold uppercase text-slate-400 tracking-wider text-[10px]">
                Delivered To (Customer):
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">{order.customerName}</h4>
              <p className="text-slate-600 mt-0.5 leading-relaxed">{order.address}</p>
              <p className="text-slate-600 font-medium">{order.city} - {order.pincode}</p>
              <p className="text-slate-700 font-semibold mt-1">Phone: {order.phone}</p>
            </div>

            <div className="space-y-1.5 text-right">
              <span className="font-extrabold uppercase text-slate-400 tracking-wider text-[10px] block">
                Payment Summary:
              </span>
              <p className="text-slate-600">
                Payment Method: <strong className="text-slate-900">{order.paymentMethod}</strong>
              </p>
              <p className="text-slate-600">
                Payment Status:{' '}
                <strong className={order.paymentStatus === 'PAID' ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                  {order.paymentStatus}
                </strong>
              </p>
              {order.razorpayPaymentId && (
                <p className="text-[10px] font-mono text-slate-400">
                  Ref ID: {order.razorpayPaymentId}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase text-[10px]">
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">Unit</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <tr key={idx} className="py-2">
                  <td className="py-2.5 font-medium text-slate-900">
                    {item.product.name}
                    {item.isSubscription && (
                      <span className="text-[9px] text-emerald-700 font-bold ml-1.5 bg-emerald-50 px-1.5 py-0.2 rounded">
                        Monthly Refill
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-center text-slate-500">{item.product.unit}</td>
                  <td className="py-2.5 text-center font-bold text-slate-900">{item.quantity}</td>
                  <td className="py-2.5 text-right text-slate-600">
                    {STORE_SETTINGS.currencySymbol}{item.product.price}
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-900">
                    {STORE_SETTINGS.currencySymbol}{item.quantity * item.product.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Breakdown */}
          <div className="border-t border-slate-200 pt-3 flex justify-end text-xs space-y-1.5">
            <div className="w-56 space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{STORE_SETTINGS.currencySymbol}{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge:</span>
                <span>{order.deliveryCharge === 0 ? 'FREE' : `${STORE_SETTINGS.currencySymbol}${order.deliveryCharge}`}</span>
              </div>
              {order.couponDiscount && order.couponDiscount > 0 ? (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon ({order.couponCode}):</span>
                  <span>-{STORE_SETTINGS.currencySymbol}{order.couponDiscount}</span>
                </div>
              ) : null}
              <div className="border-t border-slate-200 pt-1.5 flex justify-between font-black text-sm text-slate-900">
                <span>Total Amount:</span>
                <span className="text-sky-700">{STORE_SETTINGS.currencySymbol}{order.total}</span>
              </div>
            </div>
          </div>

          {/* Footer declaration */}
          <div className="border-t border-dashed border-slate-200 pt-4 text-[10px] text-slate-400 text-center space-y-1">
            <p>This is a computer-generated invoice for your online cleaning supplies order.</p>
            <p>For support or returns, chat with Akash on WhatsApp: +91 7776032964</p>
          </div>

        </div>
      </div>
    </div>
  );
}
