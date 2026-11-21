"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { OrderStatus, OrderDetails } from '@/types/product';
import { InvoiceModal } from '@/components/InvoiceModal';
import { AdminNavbar } from './components/AdminNavbar';
import { AdminMetricsBar } from './components/AdminMetricsBar';
import { AdminLoginGate } from './components/AdminLoginGate';
import { AdminOrdersTab } from './components/AdminOrdersTab';
import { AdminProductListTab } from './components/AdminProductListTab';
import { AdminCreateProductModal } from './components/AdminCreateProductModal';
import { AdminLowStockTab } from './components/AdminLowStockTab';
import { AdminCouponsTab } from './components/AdminCouponsTab';
import { Package, Sparkles, AlertTriangle, Tag } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin, logout } = useAuth();
  const { orders, updateOrderStatus, deleteOrder, products, addProduct, updateProduct, resetProducts } = useCart();

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'lowstock' | 'coupons'>('orders');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<OrderDetails | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const isAuthorized = isAdmin || isAdminLoggedIn;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Confirmed').length;
  const shippedOrders = orders.filter((o) => o.status === 'Shipped').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const lowStockProducts = products.filter((p) => p.stockCount <= 5);

  const handleStatusChange = (order: OrderDetails, newStatus: OrderStatus) => {
    updateOrderStatus(order.orderId, newStatus);
    if (newStatus === 'Shipped' || newStatus === 'Delivered') {
      const cleanNumber = order.phone.replace(/[^0-9]/g, '');
      const formatted = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://homiesclean.com';
      const msg = encodeURIComponent(
        `Hello ${order.customerName}! ✨ Your Homies Clean order *${order.orderId}* is now *${newStatus.toUpperCase()}*.\n` +
        `📦 Track package live: ${origin}/track?orderId=${order.orderId}`
      );
      if (confirm(`Order status updated to ${newStatus}. Send instant WhatsApp dispatch to ${order.customerName}?`)) {
        window.open(`https://wa.me/${formatted}?text=${msg}`, '_blank');
      }
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    logout();
    router.push('/login');
  };

  if (!isAuthorized) {
    return <AdminLoginGate onSuccess={() => setIsAdminLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <AdminNavbar onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <AdminMetricsBar
          totalRevenue={totalRevenue}
          totalOrdersCount={orders.length}
          pendingCount={pendingOrders}
          shippedCount={shippedOrders}
          deliveredCount={deliveredOrders}
          lowStockCount={lowStockProducts.length}
          onSelectLowStock={() => setActiveTab('lowstock')}
        />

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'orders' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order Tracker ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'products' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Product Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('lowstock')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'lowstock' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Low Stock ({lowStockProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'coupons' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Promo Coupons</span>
          </button>
        </div>

        {activeTab === 'orders' && (
          <AdminOrdersTab
            orders={orders}
            onStatusChange={handleStatusChange}
            onSelectInvoice={(ord) => setSelectedOrderForInvoice(ord)}
            onDelete={deleteOrder}
          />
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            {showAddProduct && (
              <AdminCreateProductModal
                onClose={() => setShowAddProduct(false)}
                onCreate={(newProd) => {
                  addProduct(newProd);
                  setShowAddProduct(false);
                }}
              />
            )}
            <AdminProductListTab
              products={products}
              showAddModal={showAddProduct}
              onToggleAddModal={() => setShowAddProduct(!showAddProduct)}
              onUpdateProduct={updateProduct}
              onResetProducts={resetProducts}
            />
          </div>
        )}

        {activeTab === 'lowstock' && (
          <AdminLowStockTab
            lowStockProducts={lowStockProducts}
            onRestock={(prod, qty) => updateProduct({ ...prod, stockCount: prod.stockCount + qty })}
          />
        )}

        {activeTab === 'coupons' && <AdminCouponsTab />}
      </main>

      <InvoiceModal
        order={selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
      />
    </div>
  );
}
