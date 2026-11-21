"use client";

import React from 'react';
import { useLoyalty } from '@/context/LoyaltyContext';
import { Sparkles, Coins } from 'lucide-react';

interface CheckoutLoyaltyRewardProps {
  total: number;
}

export function CheckoutLoyaltyReward({ total }: CheckoutLoyaltyRewardProps) {
  const { calculateCoinsEarned, balance } = useLoyalty();
  const coinsToEarn = calculateCoinsEarned(total);

  return (
    <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-xs shrink-0">
          🪙
        </div>
        <div>
          <p className="font-bold text-amber-950 flex items-center gap-1">
            <span>CleanCoins Rewards</span>
            <Sparkles className="w-3 h-3 text-amber-600" />
          </p>
          <p className="text-[11px] text-amber-800">
            You will earn <strong className="text-amber-950">+{coinsToEarn} CleanCoins</strong> (₹{coinsToEarn} cashback)
          </p>
        </div>
      </div>

      <div className="text-right shrink-0">
        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
          Balance: {balance}
        </span>
      </div>
    </div>
  );
}
