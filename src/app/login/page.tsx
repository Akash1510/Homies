"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { STORE_SETTINGS } from '@/data/products';
import { Sparkles, ArrowLeft, Lock, Mail, User, Phone, MapPin, CheckCircle, ShieldCheck, LogIn, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, user, isAuthenticated, logout } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick 1-Click Credentials Fill
  const handleFillCustomer = () => {
    setMode('login');
    setLoginEmail('test@gmail.com');
    setLoginPassword('akash123456');
    setError('');
  };

  const handleFillAdmin = () => {
    setMode('login');
    setLoginEmail('akashgj777@gmail.com');
    setLoginPassword('7776032964');
    setError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const res = await login(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (res.success) {
      setSuccess('Signed in successfully! Redirecting...');
      setTimeout(() => {
        if (loginEmail.toLowerCase().includes('akashgj777')) {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }, 700);
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setError('Please provide your name, email, and password.');
      return;
    }

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const res = await signup({
      email: signupEmail.trim(),
      password: signupPassword,
      full_name: fullName.trim(),
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      city: city.trim() || undefined,
      pincode: pincode.trim() || undefined,
    });
    setIsSubmitting(false);

    if (res.success) {
      setSuccess('Account created! Your address is auto-synced for checkout. Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 900);
    } else {
      setError(res.error || 'Failed to create account');
    }
  };

  // If already logged in, show profile card
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Logged In as {user.role === 'admin' ? 'Store Administrator' : 'Verified Customer'}
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-2">{user.full_name}</h2>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Mobile:</span>
              <span className="font-semibold text-slate-800">{user.phone || 'Not set'}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Saved Address:</span>
              <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">
                {user.address ? `${user.address}, ${user.city} - ${user.pincode}` : 'Not set'}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Go to Admin Dashboard</span>
              </Link>
            )}

            <Link
              href="/"
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Back to Shopping</span>
            </Link>

            <button
              onClick={logout}
              className="w-full py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Back to Storefront Link */}
      <div className="max-w-md w-full mx-auto mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Homies Clean</span>
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-sky-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Homies<span className="text-sky-600">Clean</span>
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to auto-sync your delivery address & checkout with 1 click
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            {success}
          </div>
        )}

        {/* Quick Demo Credentials Fill Pills */}
        {mode === 'login' && (
          <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-2xl space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-900 block">
              ⚡ Quick Fill Test Credentials:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleFillCustomer}
                className="px-2.5 py-1 rounded-lg bg-white border border-sky-200 hover:border-sky-400 text-[11px] font-bold text-sky-800 transition-colors shadow-2xs"
              >
                Customer: test@gmail.com
              </button>
              <button
                type="button"
                onClick={handleFillAdmin}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:border-slate-500 text-[11px] font-bold text-slate-800 transition-colors shadow-2xs"
              >
                Admin: Akash
              </button>
            </div>
          </div>
        )}

        {/* MODE 1: LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="test@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/25 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Verifying Session...' : 'Sign In with Secure JWT'}</span>
            </button>
          </form>
        ) : (
          /* MODE 2: SIGNUP FORM (WITH ADDRESS AUTO-SYNC) */
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="customer@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp</label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
              />
            </div>

            {/* Address fields for auto-sync before payment */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                Delivery Address (Auto-synced into Payment)
              </span>

              <input
                type="text"
                placeholder="Flat / Building, Street, Landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City (e.g. Mumbai)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
                <input
                  type="text"
                  placeholder="Pincode (e.g. 400001)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>{isSubmitting ? 'Creating Profile...' : 'Complete Profile & Auto-Sync Checkout'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
