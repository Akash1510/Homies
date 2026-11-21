"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { STORE_SETTINGS } from '@/data/products';
import { HeaderSearchBar } from './header/HeaderSearchBar';
import { HeaderNavActions } from './header/HeaderNavActions';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenOrders: () => void;
}

export function Header({ searchQuery, setSearchQuery, onOpenOrders }: HeaderProps) {
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

          {/* Desktop Search */}
          <HeaderSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {/* Navigation & Action Buttons */}
          <HeaderNavActions onOpenOrders={onOpenOrders} />
        </div>

        {/* Mobile Search Input */}
        <HeaderSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} isMobile />
      </div>
    </header>
  );
}
