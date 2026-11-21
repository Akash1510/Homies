"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { OneClickDemoAccounts } from './components/OneClickDemoAccounts';
import { SignInForm } from './components/SignInForm';
import { SignUpForm } from './components/SignUpForm';

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, user, isAuthenticated, logout } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const res = await login(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (res.success) {
      setSuccess('Signed in successfully! Redirecting...');
      setTimeout(() => {
        if (loginEmail.toLowerCase().includes('akashgj777')) router.push('/admin');
        else router.push('/');
      }, 700);
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      return setError('Please provide your name, email, and password.');
    }
    if (signupPassword.length < 6) return setError('Password must be at least 6 characters.');

    setIsSubmitting(true);
    const res = await signup({
      email: signupEmail.trim(), password: signupPassword, full_name: fullName.trim(),
      phone: phone.trim() || undefined, address: address.trim() || undefined,
      city: city.trim() || undefined, pincode: pincode.trim() || undefined,
    });
    setIsSubmitting(false);

    if (res.success) {
      setSuccess('Account created! Your address is auto-synced for checkout. Redirecting...');
      setTimeout(() => router.push('/'), 900);
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Signed In as {user.full_name}</h2>
          <p className="text-xs text-slate-500">{user.email} • {user.role === 'admin' ? 'Store Administrator' : 'Customer Account'}</p>
          <div className="flex gap-2 justify-center pt-2">
            <Link href="/" className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold">Go to Storefront</Link>
            <button onClick={logout} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">Sign Out</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Storefront</span>
        </Link>
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 space-y-5">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-slate-900">{mode === 'login' ? 'Welcome Back!' : 'Create an Account'}</h1>
            <p className="text-xs text-slate-500">Homies Clean • Sparkle & Hygiene Essentials</p>
          </div>

          <OneClickDemoAccounts
            onFillCustomer={() => { setMode('login'); setLoginEmail('test@gmail.com'); setLoginPassword('akash123456'); setError(''); }}
            onFillAdmin={() => { setMode('login'); setLoginEmail('akashgj777@gmail.com'); setLoginPassword('7776032964'); setError(''); }}
          />

          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${mode === 'login' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
            >
              <LogIn className="w-3.5 h-3.5" /><span>Sign In</span>
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${mode === 'signup' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
            >
              <UserPlus className="w-3.5 h-3.5" /><span>Create Account</span>
            </button>
          </div>

          {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">{error}</div>}
          {success && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">{success}</div>}

          {mode === 'login' ? (
            <SignInForm
              email={loginEmail} setEmail={setLoginEmail}
              password={loginPassword} setPassword={setLoginPassword}
              isSubmitting={isSubmitting} onSubmit={handleLoginSubmit}
            />
          ) : (
            <SignUpForm
              fullName={fullName} setFullName={setFullName}
              email={signupEmail} setEmail={setSignupEmail}
              password={signupPassword} setPassword={setSignupPassword}
              phone={phone} setPhone={setPhone}
              address={address} setAddress={setAddress}
              city={city} setCity={setCity}
              pincode={pincode} setPincode={setPincode}
              isSubmitting={isSubmitting} onSubmit={handleSignupSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
