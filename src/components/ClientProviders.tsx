"use client";

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from './CartDrawer';
import { ProductDetailModal } from './ProductDetailModal';
import { CheckoutModal } from './CheckoutModal';
import { OrderSuccessModal } from './OrderSuccessModal';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <CartDrawer />
        <ProductDetailModal />
        <CheckoutModal />
        <OrderSuccessModal />
      </CartProvider>
    </AuthProvider>
  );
}
