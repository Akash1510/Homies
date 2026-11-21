"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageCircle, PackageCheck, ShieldCheck, User, LogIn, LogOut, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { STORE_SETTINGS } from '@/data/products';
import { CleanCoinsBadge } from '@/components/common/CleanCoinsBadge';

interface HeaderNavActionsProps {
  onOpenOrders: () => void;
}

export function HeaderNavActions({ onOpenOrders }: HeaderNavActionsProps) {
  const { totalItems, setIsCartOpen, orders } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(`Hi ${STORE_SETTINGS.storeName}, I have a question about your home cleaning products.`);
    window.open(`https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* CleanCoins Loyalty Badge */}
      <CleanCoinsBadge compact />

      {/* User Account / Login State */}
      {isAuthenticated && user ? (
        <div className="flex items-center gap-1.5">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition-colors"
            title="View saved profile & address"
          >
            <User className="w-3.5 h-3.5 text-sky-600" />
            <span className="max-w-[80px] truncate">{user.full_name.split(' ')[0]}</span>
          </Link>
          <button onClick={logout} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors" title="Sign Out">
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

      {/* Admin Portal Quick Link - Shown ONLY to Admin */}
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
          title="Admin Control Hub"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden md:inline">Admin</span>
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
  );
}
