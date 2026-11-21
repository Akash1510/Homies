"use client";

import React from 'react';
import { useLoyalty } from '@/context/LoyaltyContext';
import { Coins, Sparkles } from 'lucide-react';

interface CleanCoinsBadgeProps {
  compact?: boolean;
}

export function CleanCoinsBadge({ compact = false }: CleanCoinsBadgeProps) {
  const { balance } = useLoyalty();

  if (compact) {
    return (
      <div 
        className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold"
        title="Your CleanCoins Balance (1 Coin = ₹1)"
      >
        <Coins className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
        <span>{balance}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 shadow-xs">
      <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-amber-950 font-black text-[10px] shadow-xs">
        🪙
      </div>
      <div className="text-left">
        <div className="text-xs font-black tracking-tight flex items-center gap-1">
          <span>{balance} CleanCoins</span>
          <Sparkles className="w-3 h-3 text-amber-500" />
        </div>
      </div>
    </div>
  );
}
