"use client";

import React from 'react';
import { Sparkles, User, ShieldCheck } from 'lucide-react';

interface OneClickDemoAccountsProps {
  onFillCustomer: () => void;
  onFillAdmin: () => void;
}

export function OneClickDemoAccounts({ onFillCustomer, onFillAdmin }: OneClickDemoAccountsProps) {
  return (
    <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-2xl space-y-2">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>1-Click Quick Fill Credentials:</span>
      </span>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onFillCustomer}
          className="p-2 bg-white hover:bg-sky-100/60 border border-sky-200 rounded-xl text-left transition-colors"
        >
          <span className="font-bold text-xs text-sky-900 flex items-center gap-1">
            <User className="w-3 h-3 text-emerald-600" />
            <span>Test Customer</span>
          </span>
          <span className="text-[10px] text-slate-500 block">test@gmail.com</span>
        </button>

        <button
          type="button"
          onClick={onFillAdmin}
          className="p-2 bg-white hover:bg-sky-100/60 border border-sky-200 rounded-xl text-left transition-colors"
        >
          <span className="font-bold text-xs text-sky-900 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-sky-600" />
            <span>Admin Akash</span>
          </span>
          <span className="text-[10px] text-slate-500 block">akashgj777@gmail.com</span>
        </button>
      </div>
    </div>
  );
}
