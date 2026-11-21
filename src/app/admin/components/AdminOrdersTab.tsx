"use client";

import React, { useState } from 'react';
import { OrderDetails, OrderStatus } from '@/types/product';
import { Search } from 'lucide-react';
import { AdminOrderCard } from './AdminOrderCard';

interface AdminOrdersTabProps {
  orders: OrderDetails[];
  onStatusChange: (order: OrderDetails, status: OrderStatus) => void;
  onSelectInvoice: (order: OrderDetails) => void;
  onDelete: (orderId: string) => void;
  onRefund?: (order: OrderDetails) => void;
}

export function AdminOrdersTab({
  orders,
  onStatusChange,
  onSelectInvoice,
  onDelete,
  onRefund,
}: AdminOrdersTabProps) {
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((ord) => {
    const matchesFilter = orderFilter === 'all' || ord.status.toLowerCase() === orderFilter.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ord.orderId.toLowerCase().includes(q) ||
      ord.customerName.toLowerCase().includes(q) ||
      ord.phone.includes(q) ||
      ord.city.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Order ID, Name, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setOrderFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                orderFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm">
          No orders match your filter criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <AdminOrderCard
              key={ord.orderId}
              order={ord}
              onStatusChange={onStatusChange}
              onSelectInvoice={onSelectInvoice}
              onDelete={onDelete}
              onRefund={onRefund}
            />
          ))}
        </div>
      )}
    </div>
  );
}
