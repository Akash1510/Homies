"use client";

import React from 'react';
import { CATEGORIES } from '@/data/products';
import { ProductCategory } from '@/types/product';
import { Sparkles, ShieldCheck, Brush, SprayCan, Package, ArrowUpDown } from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  productCount: number;
}

export function CategoryFilter({
  activeCategory,
  onSelectCategory,
  sortBy,
  setSortBy,
  productCount,
}: CategoryFilterProps) {
  
  const getIcon = (id: string) => {
    switch (id) {
      case 'floor-cleaner':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'toilet-cleaner':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'mops-tools':
        return <Brush className="w-3.5 h-3.5" />;
      case 'bathroom-kitchen':
        return <SprayCan className="w-3.5 h-3.5" />;
      case 'combos':
        return <Package className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-4 my-6">
      {/* Category Pills Slider */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full md:w-auto">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as ProductCategory)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25 scale-[1.02]'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50'
                }`}
              >
                {getIcon(cat.id)}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort & Count Controls */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3 text-xs text-slate-500">
          <span className="font-medium">
            Showing <strong className="text-slate-900">{productCount}</strong> items
          </span>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
