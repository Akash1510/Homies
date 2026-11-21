"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Lock, Sparkles, UserCheck } from 'lucide-react';

interface CartAuthGateProps {
  onBack: () => void;
  onProceed: () => void;
}

export function CartAuthGate({ onBack, onProceed }: CartAuthGateProps) {
  const { login } = useAuth();
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleQuickCustomerLogin = async () => {
    setIsLoggingIn(true);
    setAuthError('');
    const res = await login('test@gmail.com', 'akash123456');
    setIsLoggingIn(false);
    if (res.success) onProceed();
    else setAuthError(res.error || 'Login failed');
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      return setAuthError('Please enter email and password');
    }
    setIsLoggingIn(true);
    setAuthError('');
    const res = await login(authEmail.trim(), authPassword);
    setIsLoggingIn(false);
    if (res.success) onProceed();
    else setAuthError(res.error || 'Invalid credentials');
  };

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5 animate-fadeIn">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Basket Items</span>
      </button>

      <div className="text-center space-y-1.5 pt-2">
        <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-slate-900">Sign In to Complete Order</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          Log in so your delivery address auto-syncs into checkout.
        </p>
      </div>

      {authError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
          {authError}
        </div>
      )}

      {/* 1-Click Fill Button */}
      <div className="p-3.5 bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-200 rounded-2xl space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>1-Click Test Customer Sign In:</span>
        </span>
        <button
          type="button"
          onClick={handleQuickCustomerLogin}
          disabled={isLoggingIn}
          className="w-full py-2.5 px-3 bg-white hover:bg-sky-50/80 border border-sky-300 rounded-xl text-xs font-bold text-sky-900 flex items-center justify-between shadow-2xs"
        >
          <span className="flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>test@gmail.com</span>
          </span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
            Auto-Fill Address ➔
          </span>
        </button>
      </div>

      <form onSubmit={handleCustomLogin} className="space-y-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            placeholder="your-email@gmail.com"
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Password</label>
          <input
            type="password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20"
        >
          {isLoggingIn ? 'Signing In...' : 'Sign In & Proceed to Checkout'}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100">
        <button type="button" onClick={onProceed} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
          Continue as Guest without account ➔
        </button>
      </div>
    </div>
  );
}
