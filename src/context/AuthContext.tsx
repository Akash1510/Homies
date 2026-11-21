"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'customer';
  address?: string;
  city?: string;
  pincode?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    address?: string;
    city?: string;
    pincode?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('homies_token');
    const savedUser = localStorage.getItem('homies_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // ignore
      }
      // Revalidate with server in background
      fetchProfile(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = async (jwtToken: string) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem('homies_user', JSON.stringify(userData));
      } else if (res.status === 401) {
        logout();
      }
    } catch {
      // Backend not running, retain cached session
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.detail || 'Invalid email or password' };
      }

      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('homies_token', data.access_token);
      localStorage.setItem('homies_user', JSON.stringify(data.user));
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      // Fallback mock authentication for test customer and admin if backend isn't reached
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail === 'test@gmail.com' && password === 'akash123456') {
        const mockUser: UserProfile = {
          id: 'user-test-customer',
          email: 'test@gmail.com',
          full_name: 'Akash Test Customer',
          phone: '+91 9876543210',
          role: 'customer',
          address: 'Flat 402, Sunshine Apartments, MG Road',
          city: 'Mumbai',
          pincode: '400001',
        };
        const mockToken = 'mock_jwt_test_customer_session';
        setToken(mockToken);
        setUser(mockUser);
        localStorage.setItem('homies_token', mockToken);
        localStorage.setItem('homies_user', JSON.stringify(mockUser));
        return { success: true };
      }

      if (cleanEmail === 'akashgj777@gmail.com' && (password === '7776032964' || password === 'AdminPassword@777')) {
        const mockAdmin: UserProfile = {
          id: 'admin-akash',
          email: 'akashgj777@gmail.com',
          full_name: 'Akash (Administrator)',
          phone: '+91 7776032964',
          role: 'admin',
          address: 'Admin HQ, Homies Clean Hub',
          city: 'Mumbai',
          pincode: '400001',
        };
        const mockToken = 'mock_jwt_admin_session';
        setToken(mockToken);
        setUser(mockAdmin);
        localStorage.setItem('homies_token', mockToken);
        localStorage.setItem('homies_user', JSON.stringify(mockAdmin));
        return { success: true };
      }

      return { success: false, error: (err as Error).message || 'Connection failed' };
    }
  };

  const signup = async (data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    address?: string;
    city?: string;
    pincode?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: resData.detail || 'Signup failed' };
      }

      setToken(resData.access_token);
      setUser(resData.user);
      localStorage.setItem('homies_token', resData.access_token);
      localStorage.setItem('homies_user', JSON.stringify(resData.user));
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: (err as Error).message || 'Signup failed' };
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        localStorage.setItem('homies_user', JSON.stringify(updated));
        return { success: true };
      }
    } catch {
      // Local update
    }

    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('homies_user', JSON.stringify(updatedUser));
      return { success: true };
    }

    return { success: false, error: 'Update failed' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('homies_token');
    localStorage.removeItem('homies_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        signup,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
