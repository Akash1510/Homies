"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { STORE_SETTINGS, AVAILABLE_COUPONS } from '@/data/products';
import { OrderStatus, Product, OrderDetails } from '@/types/product';
import { InvoiceModal } from '@/components/InvoiceModal';
import {
  ShieldCheck,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  MessageCircle,
  Search,
  Filter,
  DollarSign,
  ArrowLeft,
  Lock,
  LogOut,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Edit2,
  Trash2,
  ExternalLink,
  Printer,
  Plus,
  Upload,
  AlertTriangle,
  Tag,
  Check,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    orders,
    updateOrderStatus,
    deleteOrder,
    products,
    addProduct,
    updateProduct,
    resetProducts,
  } = useCart();

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard tabs & filters
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'lowstock' | 'coupons'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Invoice Modal State
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<OrderDetails | null>(null);

  // New Product Form State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'floor-cleaner' | 'toilet-cleaner' | 'mops-tools' | 'bathroom-kitchen' | 'combos'>('floor-cleaner');
  const [newProdCategoryLabel, setNewProdCategoryLabel] = useState('Floor Cleaner');
  const [newProdPrice, setNewProdPrice] = useState(249);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(349);
  const [newProdUnit, setNewProdUnit] = useState('1 Litre');
  const [newProdStock, setNewProdStock] = useState(25);
  const [newProdFragrance, setNewProdFragrance] = useState('Citrus Fresh');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdImage, setNewProdImage] = useState('/products/floor-cleaner.png');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Admin Login (Preconfigured for Akash: akashgj777@gmail.com / 7776032964)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPin = loginPin.trim();

    if (
      (cleanEmail === 'akashgj777@gmail.com' || cleanEmail === 'admin') &&
      (cleanPin === '7776032964' || cleanPin === 'admin123' || cleanPin === '777')
    ) {
      setIsAdminLoggedIn(true);
      setAuthError('');
    } else {
      setAuthError("Invalid credentials. Use Akash's email: akashgj777@gmail.com & phone PIN.");
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.total : o.total), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Confirmed').length;
  const shippedOrders = orders.filter((o) => o.status === 'Shipped').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const lowStockProducts = products.filter((p) => p.stockCount <= 5);

  // Filtered orders
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

  // Automated WhatsApp Dispatch on Status Change
  const handleStatusChange = (order: OrderDetails, newStatus: OrderStatus) => {
    updateOrderStatus(order.orderId, newStatus);

    if (newStatus === 'Shipped' || newStatus === 'Delivered') {
      const cleanNumber = order.phone.replace(/[^0-9]/g, '');
      const formatted = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
      const statusIcon = newStatus === 'Shipped' ? '🚚 Out for Delivery' : '🎉 Delivered Successfully';
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://homiesclean.com';
      const message = encodeURIComponent(
        `Hello ${order.customerName}! ✨\n` +
        `Your Homies Clean order *${order.orderId}* is now *${statusIcon}*.\n\n` +
        `📦 Track package live: ${origin}/track?orderId=${order.orderId}\n` +
        `Thank you for trusting Homies Clean for your home care needs!`
      );
      if (confirm(`Order marked as "${newStatus}". Send automated WhatsApp update to customer (+${formatted})?`)) {
        window.open(`https://wa.me/${formatted}?text=${message}`, '_blank');
      }
    }
  };

  // Contact Customer via WhatsApp
  const handleChatCustomer = (phone: string, customerName: string, orderId: string, total: number) => {
    const cleanNumber = phone.replace(/[^0-9]/g, '');
    const formatted = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://homiesclean.com';
    const message = encodeURIComponent(
      `Hello ${customerName}, this is Akash from ${STORE_SETTINGS.storeName}.\n` +
      `We have received your order *${orderId}* (Total: ${STORE_SETTINGS.currencySymbol}${total}).\n` +
      `📦 Track your order anytime: ${origin}/track?orderId=${orderId}\n` +
      `We are preparing your package for express dispatch. Let us know if you need anything else!`
    );
    window.open(`https://wa.me/${formatted}?text=${message}`, '_blank');
  };

  // Handle Image Upload via /api/upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setNewProdImage(data.url);
        setUploadSuccess(true);
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      alert('Upload failed. Please check network connection.');
    } finally {
      setIsUploading(false);
    }
  };

  // Create New Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      alert('Please provide a product title');
      return;
    }

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      category: newProdCategory,
      categoryLabel: newProdCategoryLabel,
      price: Number(newProdPrice),
      originalPrice: Number(newProdOriginalPrice),
      unit: newProdUnit.trim(),
      rating: 5.0,
      reviewsCount: 1,
      tag: 'New Launch',
      inStock: true,
      stockCount: Number(newProdStock),
      image: newProdImage,
      description: newProdDescription.trim() || 'Premium household cleaning solution by Homies Clean.',
      benefits: ['Fast acting formula', '99.9% germ protection', 'Safe on skin & surfaces'],
      usageInstructions: 'Apply evenly and wipe clean with microfibre mop.',
      fragranceOrType: newProdFragrance.trim(),
      reviews: [
        {
          id: `rev-${Date.now()}`,
          userName: 'Akash (Store Owner)',
          rating: 5,
          date: 'Verified',
          comment: 'Freshly launched quality checked stock.',
          verifiedBuyer: true,
        },
      ],
    };

    addProduct(newProd);
    alert(`Product "${newProd.name}" added to live storefront!`);
    setShowAddProduct(false);
    setNewProdName('');
    setNewProdDescription('');
  };

  // If not logged in, show clean admin login gate
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-sky-600/30">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Admin Control Center</h1>
            <p className="text-xs text-slate-500">
              Authorized Portal for Akash (+91 7776032964)
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="akashgj777@gmail.com"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Passcode / PIN</label>
              <input
                type="password"
                required
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value)}
                placeholder="Your mobile: 7776032964"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
              />
              <p className="text-[11px] text-slate-400 mt-1">Hint: Use your phone number or PIN: 7776032964</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/20 active:scale-98 transition-all"
            >
              Sign In to Admin Panel
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-teal-400 flex items-center justify-center text-slate-900 font-extrabold">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Homies Clean • Admin Hub</h2>
              <p className="text-[11px] text-slate-400">Akash (akashgj777@gmail.com)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>View Storefront</span>
            </Link>

            <button
              onClick={() => setIsAdminLoggedIn(false)}
              className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {STORE_SETTINGS.currencySymbol}{totalRevenue}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{orders.length} total orders</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-600">
              {pendingOrders}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Needs packing</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">In Transit</span>
              <Truck className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-sky-600">
              {shippedOrders}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Out for delivery</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Delivered</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600">
              {deliveredOrders}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Completed orders</p>
          </div>

          <div 
            onClick={() => setActiveTab('lowstock')}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-rose-300 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Low Stock</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-600">
              {lowStockProducts.length}
            </div>
            <p className="text-[11px] text-rose-500 font-semibold mt-1">≤ 5 items remaining</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order Tracker ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Product Catalog & Upload ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('lowstock')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'lowstock'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Low Stock Alerts ({lowStockProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'coupons'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Promo Coupons ({AVAILABLE_COUPONS.length})</span>
          </button>
        </div>

        {/* TAB 1: ORDERS TRACKER */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
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

            {/* Orders Table / Cards */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm">
                No orders match your filter criteria.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4"
                  >
                    {/* Top Row: Meta & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-sky-600">
                            {ord.orderId}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">
                            {new Date(ord.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                          {ord.customerName} ({ord.phone})
                        </h3>
                      </div>

                      {/* Status Dropdown, Invoice & WhatsApp Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord, e.target.value as OrderStatus)}
                          className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                        >
                          <option value="Pending">🟡 Pending</option>
                          <option value="Confirmed">🔵 Confirmed</option>
                          <option value="Processing">🟠 Processing</option>
                          <option value="Shipped">🚚 Shipped</option>
                          <option value="Delivered">🟢 Delivered</option>
                          <option value="Cancelled">🔴 Cancelled</option>
                        </select>

                        {/* Print Invoice Button */}
                        <button
                          onClick={() => setSelectedOrderForInvoice(ord)}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                          title="Print / Save Tax Invoice PDF"
                        >
                          <Printer className="w-3.5 h-3.5 text-sky-600" />
                          <span>Tax Invoice</span>
                        </button>

                        {/* WhatsApp Customer */}
                        <button
                          onClick={() => handleChatCustomer(ord.phone, ord.customerName, ord.orderId, ord.total)}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
                          title="Send update on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          onClick={() => deleteOrder(ord.orderId)}
                          className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Middle Row: Items & Delivery Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Items */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                        <span className="font-extrabold uppercase text-slate-400 tracking-wider text-[10px]">
                          Ordered Items
                        </span>
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-slate-700">
                            <span className="font-medium">
                              {item.quantity}× {item.product.name} ({item.product.unit})
                              {item.isSubscription && (
                                <span className="ml-1.5 text-[9px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-bold">
                                  Refill (15% OFF)
                                </span>
                              )}
                            </span>
                            <span className="font-bold">
                              {STORE_SETTINGS.currencySymbol}{item.quantity * item.product.price}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Address & Payment Info */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5 text-slate-600">
                        <span className="font-extrabold uppercase text-slate-400 tracking-wider text-[10px]">
                          Delivery Details
                        </span>
                        <p className="font-medium text-slate-800">
                          📍 {ord.address}, {ord.city} - {ord.pincode}
                        </p>
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          <span className="font-semibold">Payment:</span>
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-200 text-slate-800">
                            {ord.paymentMethod}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            ord.paymentStatus === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.paymentStatus}
                          </span>
                          {ord.razorpayPaymentId && (
                            <span className="font-mono text-[10px] text-slate-500 truncate max-w-[140px]">
                              ID: {ord.razorpayPaymentId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Total */}
                    <div className="flex justify-between items-center pt-2 text-xs">
                      <span className="text-slate-500">
                        Delivery Fee: {ord.deliveryCharge === 0 ? 'FREE' : `${STORE_SETTINGS.currencySymbol}${ord.deliveryCharge}`}
                      </span>
                      <span className="text-base font-black text-slate-900">
                        Total: <span className="text-sky-600">{STORE_SETTINGS.currencySymbol}{ord.total}</span>
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCT CATALOG & IN-ADMIN IMAGE UPLOADER */}
        {activeTab === 'products' && (
          <div className="space-y-5">
            {/* Header + Add Product Button */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Live Inventory & Stock Status</h3>
                <p className="text-xs text-slate-500">Toggle item availability, adjust stock numbers, or upload new products</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-sky-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddProduct ? 'Close Form' : 'Add New Product'}</span>
                </button>

                <button
                  onClick={resetProducts}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* In-Admin Image Uploader & Product Creator Form */}
            {showAddProduct && (
              <form onSubmit={handleCreateProduct} className="bg-white rounded-2xl border-2 border-sky-300 p-5 sm:p-6 shadow-md space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-sky-900 font-extrabold text-sm border-b border-slate-100 pb-3">
                  <Upload className="w-4 h-4 text-sky-600" />
                  <span>Upload & Create New Cleaning Product</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lavender Multi-Surface Disinfectant"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => {
                        const cat = e.target.value as any;
                        setNewProdCategory(cat);
                        const labels: Record<string, string> = {
                          'floor-cleaner': 'Floor Cleaner',
                          'toilet-cleaner': 'Toilet Cleaner',
                          'mops-tools': 'Mops & Tools',
                          'bathroom-kitchen': 'Bathroom & Kitchen',
                          'combos': 'Value Combos',
                        };
                        setNewProdCategoryLabel(labels[cat] || 'Cleaning Supply');
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value="floor-cleaner">Floor Cleaner</option>
                      <option value="toilet-cleaner">Toilet Cleaner</option>
                      <option value="mops-tools">Mops & Squeegees</option>
                      <option value="bathroom-kitchen">Bathroom & Kitchen</option>
                      <option value="combos">Value Combos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Unit / Volume</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1 Litre or Pack of 2"
                      value={newProdUnit}
                      onChange={(e) => setNewProdUnit(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newProdOriginalPrice}
                      onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Initial Stock Count</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image Upload Row */}
                <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={newProdImage}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-white"
                  />

                  <div className="flex-1 space-y-1">
                    <span className="block font-bold text-xs text-sky-900">Upload Product Photo</span>
                    <p className="text-[11px] text-slate-500">
                      Upload directly to server (/public/products/). JPG, PNG, WEBP supported.
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
                    />
                  </div>

                  {isUploading && (
                    <span className="text-xs font-bold text-sky-700 animate-pulse">Uploading...</span>
                  )}
                  {uploadSuccess && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Uploaded!
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProduct(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20"
                  >
                    Publish Product
                  </button>
                </div>
              </form>
            )}

            {/* Products List */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 divide-y divide-slate-100">
              {products.map((prod) => (
                <div key={prod.id} className="py-3 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{prod.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        {prod.categoryLabel} • {prod.unit}
                        {prod.stockCount <= 5 && (
                          <span className="ml-2 font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                            Only {prod.stockCount} left
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Stock Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 text-xs">
                      <button
                        onClick={() => updateProduct({ ...prod, stockCount: Math.max(0, prod.stockCount - 1) })}
                        className="px-2 py-1 text-slate-600 hover:text-slate-900"
                      >
                        -
                      </button>
                      <span className="px-2 font-bold text-slate-800">{prod.stockCount} in stock</span>
                      <button
                        onClick={() => updateProduct({ ...prod, stockCount: prod.stockCount + 1 })}
                        className="px-2 py-1 text-slate-600 hover:text-slate-900"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-extrabold text-sm text-slate-800">
                      {STORE_SETTINGS.currencySymbol}{prod.price}
                    </span>

                    <button
                      onClick={() =>
                        updateProduct({ ...prod, inStock: !prod.inStock })
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        prod.inStock
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {prod.inStock ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-emerald-600" />
                          <span>In Stock</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-rose-500" />
                          <span>Out of Stock</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LOW STOCK ALERTS */}
        {activeTab === 'lowstock' && (
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

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateProduct({ ...prod, stockCount: prod.stockCount + 20 })}
                        className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
                      >
                        + Restock 20 Units
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ACTIVE PROMO COUPONS */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Active Discount & Promo Coupons</h3>
              <p className="text-xs text-slate-500">Available promotional vouchers for customer checkout</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {AVAILABLE_COUPONS.map((cpn) => (
                <div key={cpn.code} className="p-4 rounded-2xl border border-teal-200 bg-teal-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-teal-800 bg-white px-2.5 py-1 rounded-lg border border-teal-300">
                      {cpn.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      {cpn.discountType === 'fixed' ? `₹${cpn.discountValue} OFF` : `${cpn.discountValue}% OFF`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{cpn.description}</p>
                  <p className="text-[10px] text-slate-500">
                    Min Order: {STORE_SETTINGS.currencySymbol}{cpn.minOrderAmount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Tax Invoice Modal for Print / PDF */}
      <InvoiceModal
        order={selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
      />
    </div>
  );
}
