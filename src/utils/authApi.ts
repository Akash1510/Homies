import { UserProfile } from '@/context/AuthContext';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function apiFetchProfile(jwtToken: string): Promise<UserProfile | null> {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${jwtToken}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiLogin(email: string, password: string) {
  return fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });
}

export async function apiSignup(data: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
}) {
  return fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function apiUpdateProfile(data: Partial<UserProfile>, token: string) {
  return fetch(`${API_BASE_URL}/api/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export function getMockUser(email: string, password: string): { user: UserProfile; token: string } | null {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === 'test@gmail.com' && password === 'akash123456') {
    return {
      user: {
        id: 'user-test-customer',
        email: 'test@gmail.com',
        full_name: 'Akash Test Customer',
        phone: '+91 9876543210',
        role: 'customer',
        address: 'Flat 402, Sunshine Apartments, MG Road',
        city: 'Mumbai',
        pincode: '400001',
      },
      token: 'mock_jwt_test_customer_session',
    };
  }

  if (cleanEmail === 'akashgj777@gmail.com' && (password === '7776032964' || password === 'AdminPassword@777')) {
    return {
      user: {
        id: 'admin-akash',
        email: 'akashgj777@gmail.com',
        full_name: 'Akash (Administrator)',
        phone: '+91 7776032964',
        role: 'admin',
        address: 'Admin HQ, Homies Clean Hub',
        city: 'Mumbai',
        pincode: '400001',
      },
      token: 'mock_jwt_admin_session',
    };
  }

  return null;
}
