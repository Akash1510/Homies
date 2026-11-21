"use client";

import React from 'react';
import { Search } from 'lucide-react';

interface HeaderSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobile?: boolean;
}

export function HeaderSearchBar({ searchQuery, setSearchQuery, isMobile = false }: HeaderSearchBarProps) {
  if (isMobile) {
    return (
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
    );
  }

  return (
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
  );
}
