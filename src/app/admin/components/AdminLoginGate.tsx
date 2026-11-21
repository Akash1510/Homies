"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';

interface AdminLoginGateProps {
  onSuccess: () => void;
}

export function AdminLoginGate({ onSuccess }: AdminLoginGateProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [authError, setAuthError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPin = loginPin.trim();

    if (
      (cleanEmail === 'akashgj777@gmail.com' || cleanEmail === 'admin') &&
      (cleanPin === '7776032964' || cleanPin === 'admin123' || cleanPin === '777')
    ) {
      onSuccess();
      setAuthError('');
    } else {
      setAuthError("Invalid credentials. Use Akash's email: akashgj777@gmail.com & phone PIN.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-sky-600/30">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Admin Control Center</h1>
          <p className="text-xs text-slate-500">Authorized Portal for Akash (+91 7776032964)</p>
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {authError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="akashgj777@gmail.com"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Passcode / PIN</label>
            <input
              type="password"
              required
              value={loginPin}
              onChange={(e) => setLoginPin(e.target.value)}
              placeholder="Your mobile: 7776032964"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">Hint: Use your phone number or PIN: 7776032964</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/20 active:scale-98 transition-all"
          >
            Sign In to Admin Panel
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
