"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { OrdersHistoryModal } from '@/components/OrdersHistoryModal';
import { Footer } from '@/components/Footer';
import { INITIAL_PRODUCTS, STORE_SETTINGS } from '@/data/products';
import { ProductCategory, Product } from '@/types/product';
import { Sparkles, Image as ImageIcon, CheckCircle, SearchX, ShieldAlert } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [showImageGuide, setShowImageGuide] = useState(true);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => {
      // Category filter
      const matchesCategory =
        activeCategory === 'all' || product.category === activeCategory;

      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.categoryLabel.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        (product.fragranceOrType && product.fragranceOrType.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default / featured
    });
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Sticky Header with Search & Cart */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Hero Banner */}
        <HeroBanner
          onSelectCategory={(cat) => {
            setActiveCategory(cat as ProductCategory);
            window.scrollTo({ top: 380, behavior: 'smooth' });
          }}
        />

        {/* Product Images Integration Helper Note */}
        {showImageGuide && (
          <div className="relative mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-teal-50 to-emerald-50 border border-sky-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-sky-600 text-white shrink-0 mt-0.5">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>Ready to add your custom product photos?</span>
                  <span className="text-[10px] font-bold bg-sky-200/70 text-sky-800 px-2 py-0.5 rounded-full">
                    Easy Setup
                  </span>
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  We created a dedicated <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-sky-700">public/products/</code> folder. You can drag and drop your floor cleaner, mop, and toilet cleaner images directly there, or share their names and we will map them into the catalog!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowImageGuide(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 self-end sm:self-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Category Selector & Sorting */}
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          productCount={filteredProducts.length}
        />

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-slate-200 p-8 my-4">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <SearchX className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No cleaning products found</h3>
              <p className="text-xs text-slate-500 mt-1">
                We couldn&apos;t find anything matching &quot;{searchQuery}&quot;. Try a different term or clear filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition-colors"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Orders History Drawer/Modal */}
      <OrdersHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
