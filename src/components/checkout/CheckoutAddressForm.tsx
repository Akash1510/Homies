"use client";

import React from 'react';

interface CheckoutAddressFormProps {
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  pincode: string;
  setPincode: (v: string) => void;
}

export function CheckoutAddressForm({
  name, setName,
  phone, setPhone,
  email, setEmail,
  address, setAddress,
  city, setCity,
  pincode, setPincode,
}: CheckoutAddressFormProps) {
  return (
    <div className="space-y-3.5">
      <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
        1. Delivery & Contact Details
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Akash Sharma"
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Number (WhatsApp) *</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 9876543210"
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1">Email (Optional, for Invoice)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your-email@gmail.com"
          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1">Complete Street Address *</label>
        <textarea
          required
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="House/Flat No., Building Name, Street, Landmark"
          className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">City / Town</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Mumbai"
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Pincode *</label>
          <input
            type="text"
            required
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="400001"
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
