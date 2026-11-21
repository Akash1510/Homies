"use client";

import React from 'react';
import { STORE_SETTINGS } from '@/data/products';
import { Sparkles, MessageCircle, ShieldCheck, HeartHandshake, PhoneCall, MapPin } from 'lucide-react';

export function Footer() {
  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(`Hi ${STORE_SETTINGS.storeName}, I want to know more about your products.`);
    window.open(`https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <footer className="mt-16 bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top 3 Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-slate-800 text-center sm:text-left">
          <div className="flex items-center gap-3.5 bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">99.9% Antibacterial Shield</h4>
              <p className="text-xs text-slate-400">Hospital-tested floor & toilet hygiene formulas.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Tough On Dirt, Safe for Pets</h4>
              <p className="text-xs text-slate-400">Non-corrosive, fresh natural aromas.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Direct WhatsApp Assistance</h4>
              <p className="text-xs text-slate-400">Real human help for questions or custom bulk orders.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-teal-400 flex items-center justify-center text-slate-900 font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white">{STORE_SETTINGS.storeName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your one-stop destination for hospital-grade disinfectant floor cleaners, deep limescale toilet gels, and effortless microfiber spin mops.
            </p>
          </div>

          {/* Quick Categories */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-extrabold text-slate-200 tracking-wider">
              Product Categories
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-400">
              <li>• Disinfectant Floor Cleaners (Citrus, Pine, Herbal)</li>
              <li>• Power Toilet Cleaner & Grout Scale Removers</li>
              <li>• 360 Spin Mops, Flat Mops & Rubber Floor Wipers</li>
              <li>• Glass & Multi-Surface Sparkle Sprays</li>
              <li>• Value Household Hygiene Starter Combos</li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold text-slate-200 tracking-wider">
              Customer Support & Orders
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-sky-400" />
                <span>{STORE_SETTINGS.supportHours}</span>
              </p>
              <button
                onClick={handleWhatsAppContact}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 {STORE_SETTINGS.storeName}. All rights reserved.</p>
          <p className="text-slate-400">
            Built with Next.js & Tailwind CSS for modern home care ecommerce.
          </p>
        </div>

      </div>
    </footer>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
