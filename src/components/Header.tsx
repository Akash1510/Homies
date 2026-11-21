"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, MessageCircle, PackageCheck, Search, ShieldCheck, User, LogIn, LogOut, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { STORE_SETTINGS } from '@/data/products';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenOrders: () => void;
}

export function Header({ searchQuery, setSearchQuery, onOpenOrders }: HeaderProps) {
  const { totalItems, setIsCartOpen, orders } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(`Hi ${STORE_SETTINGS.storeName}, I have a question about your home cleaning products.`);
    window.open(`https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 text-white text-xs font-medium py-1.5 px-4 text-center">
        <span>✨ {STORE_SETTINGS.deliveryPromise} | Free Shipping on orders over {STORE_SETTINGS.currencySymbol}{STORE_SETTINGS.freeDeliveryThreshold}!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Logo & Store Identity */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer select-none">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-800">
                  Homies<span className="text-sky-600">Clean</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Direct
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Floor Care • Mops & Tools • Toilet Hygiene
              </p>
            </div>
          </Link>

          {/* Search bar on desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search floor cleaner, spin mop, toilet gel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* User Account / Login State */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition-colors"
                  title="View your saved profile & address"
                >
                  <User className="w-3.5 h-3.5 text-sky-600" />
                  <span className="max-w-[90px] truncate">{user.full_name.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Admin Portal Quick Link - Shown ONLY to Admin (Akash) */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
                title="Admin Control Hub"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Hub</span>
              </Link>
            )}

            {/* Track Order Link */}
            <Link
              href="/track"
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              title="Track order status with Live Timeline"
            >
              <Truck className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">Track</span>
            </Link>

            {/* WhatsApp Help */}
            <button
              onClick={handleWhatsAppContact}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-full border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors shadow-xs"
              title="Chat with store support"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* My Orders History */}
            {orders.length > 0 && (
              <button
                onClick={onOpenOrders}
                className="relative flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                title="View previous orders"
              >
                <PackageCheck className="w-4 h-4 text-sky-600" />
                <span className="hidden sm:inline">Orders</span>
                <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[10px] flex items-center justify-center font-bold">
                  {orders.length}
                </span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 active:scale-95 transition-all shadow-md shadow-slate-900/10"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
              <span className="hidden sm:inline font-semibold">Cart</span>
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">
                {totalItems}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products, mops, cleaners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
