"use client";

import React from 'react';
import { User, Mail, Lock, Phone, MapPin } from 'lucide-react';

interface SignUpFormProps {
  fullName: string; setFullName: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  address: string; setAddress: (v: string) => void;
  city: string; setCity: (v: string) => void;
  pincode: string; setPincode: (v: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function SignUpForm({
  fullName, setFullName,
  email, setEmail,
  password, setPassword,
  phone, setPhone,
  address, setAddress,
  city, setCity,
  pincode, setPincode,
  isSubmitting, onSubmit,
}: SignUpFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Akash Sharma"
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 chars"
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone (WhatsApp)</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 9876543210"
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <textarea
            rows={2} value={address} onChange={(e) => setAddress(e.target.value)}
            placeholder="Flat No, Street, Landmark"
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text" value={city} onChange={(e) => setCity(e.target.value)}
          placeholder="City (e.g. Mumbai)"
          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />
        <input
          type="text" maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value)}
          placeholder="Pincode (e.g. 400001)"
          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />
      </div>

      <button
        type="submit" disabled={isSubmitting}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 active:scale-98 transition-all"
      >
        {isSubmitting ? 'Creating Account...' : 'Sign Up & Auto-Save Profile'}
      </button>
    </form>
  );
}
