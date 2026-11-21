"use client";

import React from 'react';
import { ShieldCheck, Truck, Sparkles, Droplets } from 'lucide-react';
import { STORE_SETTINGS } from '@/data/products';

export function HeroBanner({ onSelectCategory }: { onSelectCategory: (cat: string) => void }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-900 via-sky-800 to-teal-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 rounded-3xl my-4 sm:my-6 shadow-xl shadow-sky-900/10">
      {/* Background glow & accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left text column */}
        <div className="text-center md:text-left flex-1 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold text-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Pure Hygiene & Stain Defense</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Keep Every Floor & Bathroom <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-teal-200 to-emerald-200">
              Spotless & Fragrant
            </span>
          </h1>

          <p className="text-sm sm:text-base text-sky-100 max-w-xl leading-relaxed">
            Discover heavy-duty disinfectant floor cleaners, deep limescale toilet gels, and effortless spin mops engineered for spotless homes.
          </p>

          {/* Quick CTA buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
            <button
              onClick={() => onSelectCategory('combos')}
              className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm shadow-md transition-all active:scale-95"
            >
              Explore Value Combos
            </button>
            <button
              onClick={() => onSelectCategory('floor-cleaner')}
              className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 font-semibold text-sm transition-all"
            >
              Floor Cleaners
            </button>
            <button
              onClick={() => onSelectCategory('mops-tools')}
              className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 font-semibold text-sm transition-all"
            >
              Spin Mops & Wipers
            </button>
          </div>
        </div>

        {/* Right Feature Highlights Card */}
        <div className="w-full md:w-80 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 space-y-3.5">
          <h3 className="text-xs uppercase tracking-wider font-extrabold text-sky-200 border-b border-white/10 pb-2">
            Why Homies Clean?
          </h3>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold">99.9% Germ Protection</h4>
              <p className="text-xs text-sky-100/80">Clinically tested hospital-grade disinfectants.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Tough On Stains, Pet Safe</h4>
              <p className="text-xs text-sky-100/80">No hazardous residues after drying.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Free Fast Doorstep Delivery</h4>
              <p className="text-xs text-sky-100/80">Orders above {STORE_SETTINGS.currencySymbol}{STORE_SETTINGS.freeDeliveryThreshold} ship completely free.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
