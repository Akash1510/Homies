"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CleanCoinTransaction } from '@/types/loyalty';

interface LoyaltyContextType {
  balance: number;
  transactions: CleanCoinTransaction[];
  earnCoins: (orderTotal: number, orderId: string) => number;
  redeemCoins: (amount: number, orderId: string) => boolean;
  isRedeeming: boolean;
  setIsRedeeming: (val: boolean) => void;
  calculateCoinsEarned: (total: number) => number;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

const STORAGE_KEY_BALANCE = 'homies_cleancoins_bal';
const STORAGE_KEY_TX = 'homies_cleancoins_tx';

export function LoyaltyProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number>(50); // Start new users with 50 bonus coins (₹50 welcome bonus!)
  const [transactions, setTransactions] = useState<CleanCoinTransaction[]>([]);
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedBal = localStorage.getItem(STORAGE_KEY_BALANCE);
      const savedTx = localStorage.getItem(STORAGE_KEY_TX);
      if (savedBal !== null) setBalance(Number(savedBal));
      if (savedTx !== null) setTransactions(JSON.parse(savedTx));
    } catch {}
  }, []);

  const calculateCoinsEarned = (total: number): number => {
    // 5% cashback: 1 CleanCoin per ₹20 spent
    return Math.floor(total * 0.05);
  };

  const earnCoins = (orderTotal: number, orderId: string): number => {
    const earned = calculateCoinsEarned(orderTotal);
    if (earned <= 0) return 0;

    const newTx: CleanCoinTransaction = {
      id: `tx-${Date.now()}`,
      orderId,
      amount: earned,
      description: `Earned 5% cashback on order #${orderId}`,
      date: new Date().toISOString(),
    };

    setBalance((prev) => {
      const nextBal = prev + earned;
      try { localStorage.setItem(STORAGE_KEY_BALANCE, String(nextBal)); } catch {}
      return nextBal;
    });

    setTransactions((prev) => {
      const nextTx = [newTx, ...prev];
      try { localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(nextTx)); } catch {}
      return nextTx;
    });

    return earned;
  };

  const redeemCoins = (amount: number, orderId: string): boolean => {
    if (amount <= 0 || amount > balance) return false;

    const newTx: CleanCoinTransaction = {
      id: `tx-${Date.now()}`,
      orderId,
      amount: -amount,
      description: `Redeemed on order #${orderId}`,
      date: new Date().toISOString(),
    };

    setBalance((prev) => {
      const nextBal = prev - amount;
      try { localStorage.setItem(STORAGE_KEY_BALANCE, String(nextBal)); } catch {}
      return nextBal;
    });

    setTransactions((prev) => {
      const nextTx = [newTx, ...prev];
      try { localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(nextTx)); } catch {}
      return nextTx;
    });

    setIsRedeeming(false);
    return true;
  };

  return (
    <LoyaltyContext.Provider
      value={{
        balance,
        transactions,
        earnCoins,
        redeemCoins,
        isRedeeming,
        setIsRedeeming,
        calculateCoinsEarned,
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (!context) throw new Error('useLoyalty must be used within a LoyaltyProvider');
  return context;
}
