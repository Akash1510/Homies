"use client";

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LoyaltyProvider } from '@/context/LoyaltyContext';
import { CartDrawer } from './CartDrawer';
import { ProductDetailModal } from './ProductDetailModal';
import { CheckoutModal } from './CheckoutModal';
import { OrderSuccessModal } from './OrderSuccessModal';
import { AbandonedCartReminder } from './common/AbandonedCartReminder';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <LoyaltyProvider>
          {children}
          <CartDrawer />
          <ProductDetailModal />
          <CheckoutModal />
          <OrderSuccessModal />
          <AbandonedCartReminder />
        </LoyaltyProvider>
      </CartProvider>
    </AuthProvider>
  );
}
