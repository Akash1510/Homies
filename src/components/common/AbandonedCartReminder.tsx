"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { STORE_SETTINGS } from '@/data/products';
import { MessageCircle, ShoppingBag, X } from 'lucide-react';

export function AbandonedCartReminder() {
  const { cart, total, isCartOpen, setIsCartOpen } = useCart();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show recovery floating reminder 6 seconds after cart has items if not open
    if (cart.length > 0 && !isCartOpen && !dismissed) {
      const timer = setTimeout(() => setVisible(true), 6000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [cart.length, isCartOpen, dismissed]);

  if (!visible || dismissed || cart.length === 0) return null;

  const handleWhatsAppHelp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const itemsList = cart.map(i => `${i.product.name} (x${i.quantity})`).join(', ');
    const text = encodeURIComponent(
      `Hi ${STORE_SETTINGS.storeName}, I have items in my cart (${itemsList}, Total: ₹${total}). Can you help me complete this order?`
    );
    window.open(`https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-30 max-w-sm bg-white rounded-2xl border border-sky-200 shadow-xl p-3.5 flex items-center gap-3 animate-slide-up">
      <div 
        onClick={() => setIsCartOpen(true)}
        className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center cursor-pointer shrink-0"
      >
        <ShoppingBag className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setIsCartOpen(true)}>
        <p className="text-xs font-bold text-slate-800 truncate">
          {cart.length} item{cart.length > 1 ? 's' : ''} waiting in cart (₹{total})
        </p>
        <p className="text-[11px] text-slate-500">Need help or want to order via WhatsApp?</p>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={handleWhatsAppHelp}
          className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
          title="Instant WhatsApp Order Assistance"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
