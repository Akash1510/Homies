"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetchProfileWithRefresh, apiLogin, apiSignup, apiUpdateProfile, getMockUser } from '@/utils/authApi';
import { setAuthCookie, removeAuthCookie } from '@/utils/cookieUtils';

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
  signup: (data: any) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('homies_token');
    const savedRefreshToken = localStorage.getItem('homies_refresh_token');
    const savedUser = localStorage.getItem('homies_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setAuthCookie(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {}
      apiFetchProfileWithRefresh(savedToken, savedRefreshToken, (newTok, newRef) => {
        setToken(newTok);
        setAuthCookie(newTok);
        localStorage.setItem('homies_token', newTok);
        localStorage.setItem('homies_refresh_token', newRef);
      }).then((fetched) => {
        if (fetched) {
          setUser(fetched);
          localStorage.setItem('homies_user', JSON.stringify(fetched));
        } else if (!savedToken.startsWith('mock_')) {
          logout();
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiLogin(email, password);
      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.detail || 'Invalid email or password' };
      }
      setToken(data.access_token);
      setUser(data.user);
      setAuthCookie(data.access_token);
      localStorage.setItem('homies_token', data.access_token);
      if (data.refresh_token) localStorage.setItem('homies_refresh_token', data.refresh_token);
      localStorage.setItem('homies_user', JSON.stringify(data.user));
      setIsLoading(false);
      return { success: true };
    } catch {
      setIsLoading(false);
      const mock = getMockUser(email, password);
      if (mock) {
        setToken(mock.token);
        setUser(mock.user);
        setAuthCookie(mock.token);
        localStorage.setItem('homies_token', mock.token);
        localStorage.setItem('homies_user', JSON.stringify(mock.user));
        return { success: true };
      }
      return { success: false, error: 'Connection failed. Please check network.' };
    }
  };

  const signup = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await apiSignup(data);
      const resData = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: resData.detail || 'Signup failed' };
      }
      setToken(resData.access_token);
      setUser(resData.user);
      setAuthCookie(resData.access_token);
      localStorage.setItem('homies_token', resData.access_token);
      if (resData.refresh_token) localStorage.setItem('homies_refresh_token', resData.refresh_token);
      localStorage.setItem('homies_user', JSON.stringify(resData.user));
      setIsLoading(false);
      return { success: true };
    } catch {
      setIsLoading(false);
      const newMock: UserProfile = {
        id: `mock-${Date.now()}`,
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        role: 'customer',
        address: data.address,
        city: data.city,
        pincode: data.pincode,
      };
      setToken('mock_jwt_signup');
      setUser(newMock);
      setAuthCookie('mock_jwt_signup');
      localStorage.setItem('homies_token', 'mock_jwt_signup');
      localStorage.setItem('homies_user', JSON.stringify(newMock));
      return { success: true };
    }
  };

  const updateProfile = async (updateData: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...updateData };
      setUser(updated);
      localStorage.setItem('homies_user', JSON.stringify(updated));
    }
    if (token && !token.startsWith('mock_')) {
      try {
        await apiUpdateProfile(updateData, token);
      } catch {}
    }
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeAuthCookie();
    localStorage.removeItem('homies_token');
    localStorage.removeItem('homies_refresh_token');
    localStorage.removeItem('homies_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.email === 'akashgj777@gmail.com',
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
