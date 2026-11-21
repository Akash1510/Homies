"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Truck, CheckCircle2, Clock } from 'lucide-react';

export function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<{
    serviced: boolean;
    days: string;
    city?: string;
    express: boolean;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('homies_pincode');
    if (saved) {
      setPincode(saved);
      checkPincodeService(saved);
    }
  }, []);

  const checkPincodeService = (pin: string) => {
    const cleanPin = pin.trim();
    if (cleanPin.length !== 6 || !/^\d+$/.test(cleanPin)) {
      setResult(null);
      return;
    }

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      // Metro regions (11xxxx Delhi, 40xxxx Mumbai, 56xxxx Bangalore, 50xxxx Hyderabad, etc.)
      const isMetro = /^(11|40|56|50|60|70|41|38)/.test(cleanPin);

      setResult({
        serviced: true,
        days: isMetro ? 'Tomorrow or within 24-48 Hours' : '2-3 Business Days',
        city: isMetro ? 'Express Metro Zone' : 'Standard Delivery Zone',
        express: isMetro,
      });

      localStorage.setItem('homies_pincode', cleanPin);
    }, 300);
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    checkPincodeService(pincode);
  };

  return (
    <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-sky-600" />
          <span>Delivery Availability & Timeline</span>
        </span>
        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
          All-India Delivery
        </span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value);
            if (e.target.value.length === 6) checkPincodeService(e.target.value);
          }}
          className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-slate-800"
        />
        <button
          type="submit"
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
        >
          {isChecking ? 'Checking...' : 'Check'}
        </button>
      </form>

      {result && (
        <div className="pt-1 flex items-start gap-2 text-xs animate-fadeIn">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-900 text-[11px] leading-tight">
              {result.days}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Doorstep dispatch via express courier to {result.city}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
