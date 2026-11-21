"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, ExternalLink, LogOut } from 'lucide-react';

interface AdminNavbarProps {
  onLogout: () => void;
}

export function AdminNavbar({ onLogout }: AdminNavbarProps) {
  return (
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
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
