"use client";

import React from 'react';
import { OrderDetails, OrderStatus } from '@/types/product';
import { STORE_SETTINGS } from '@/data/products';
import { MessageCircle, Printer, Trash2, RotateCcw } from 'lucide-react';

interface AdminOrderCardProps {
  order: OrderDetails;
  onStatusChange: (order: OrderDetails, status: OrderStatus) => void;
  onSelectInvoice: (order: OrderDetails) => void;
  onDelete: (orderId: string) => void;
  onRefund?: (order: OrderDetails) => void;
}

export function AdminOrderCard({
  order,
  onStatusChange,
  onSelectInvoice,
  onDelete,
  onRefund,
}: AdminOrderCardProps) {
  const handleChatCustomer = () => {
    const cleanNumber = order.phone.replace(/[^0-9]/g, '');
    const formatted = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://homiesclean.com';
    const message = encodeURIComponent(
      `Hello ${order.customerName}, this is Akash from ${STORE_SETTINGS.storeName}.\n` +
      `We have received your order *${order.orderId}* (Total: ${STORE_SETTINGS.currencySymbol}${order.total}).\n` +
      `📦 Track your order anytime: ${origin}/track?orderId=${order.orderId}`
    );
    window.open(`https://wa.me/${formatted}?text=${message}`, '_blank');
  };

  const isPrepaidCancelled =
    order.status === 'Cancelled' &&
    order.paymentMethod === 'RAZORPAY' &&
    order.paymentStatus === 'PAID';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      {/* Top Row: Meta & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm text-sky-600">{order.orderId}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm mt-0.5">
            {order.customerName} ({order.phone})
          </h3>
        </div>

        {/* Status Dropdown, Invoice & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order, e.target.value as OrderStatus)}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="Pending">🟡 Pending</option>
            <option value="Confirmed">🔵 Confirmed</option>
            <option value="Processing">🟠 Processing</option>
            <option value="Shipped">🚚 Shipped</option>
            <option value="Delivered">🟢 Delivered</option>
            <option value="Cancelled">🔴 Cancelled</option>
          </select>

          {isPrepaidCancelled && onRefund && (
            <button
              onClick={() => onRefund(order)}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-amber-500/20 active:scale-98 transition-all"
              title="Trigger instant source account refund"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Issue Refund</span>
            </button>
          )}

          <button
            onClick={() => onSelectInvoice(order)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            title="Print Tax Invoice PDF"
          >
            <Printer className="w-3.5 h-3.5 text-sky-600" />
            <span>Tax Invoice</span>
          </button>

          <button
            onClick={handleChatCustomer}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
            title="Send WhatsApp update"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => onDelete(order.orderId)}
            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
            title="Delete Order"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle: Items & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
          <span className="font-extrabold uppercase text-slate-400 tracking-wider text-[10px]">
            Ordered Items
          </span>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-slate-700">
              <span className="font-medium">
                {item.quantity}× {item.product.name} ({item.product.unit})
              </span>
              <span className="font-bold">
                {STORE_SETTINGS.currencySymbol}{item.quantity * item.product.price}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5 text-slate-600">
          <span className="font-extrabold uppercase text-slate-400 tracking-wider text-[10px]">
            Delivery Details
          </span>
          <p className="font-medium text-slate-800">
            📍 {order.address}, {order.city} - {order.pincode}
          </p>
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="font-semibold">Payment:</span>
            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-200 text-slate-800">
              {order.paymentMethod}
            </span>
            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
              order.paymentStatus === 'PAID'
                ? 'bg-emerald-100 text-emerald-800'
                : order.paymentStatus === 'REFUNDED'
                ? 'bg-teal-100 text-teal-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {order.paymentStatus}
            </span>
            {order.refundId && (
              <span className="font-mono text-[10px] text-teal-700 truncate max-w-[150px]">
                Refund: {order.refundId}
              </span>
            )}
            {order.razorpayPaymentId && !order.refundId && (
              <span className="font-mono text-[10px] text-slate-500 truncate max-w-[140px]">
                ID: {order.razorpayPaymentId}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Total */}
      <div className="flex justify-between items-center pt-2 text-xs">
        <span className="text-slate-500">
          Delivery: {order.deliveryCharge === 0 ? 'FREE' : `${STORE_SETTINGS.currencySymbol}${order.deliveryCharge}`}
        </span>
        <span className="text-base font-black text-slate-900">
          Total: <span className="text-sky-600">{STORE_SETTINGS.currencySymbol}{order.total}</span>
        </span>
      </div>
    </div>
  );
}
