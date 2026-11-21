"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLoyalty } from '@/context/LoyaltyContext';
import { STORE_SETTINGS } from '@/data/products';
import { initiateRazorpayPayment } from '@/utils/razorpay';
import { X, RefreshCw } from 'lucide-react';
import { CheckoutAddressForm } from './checkout/CheckoutAddressForm';
import { CheckoutPaymentSelector } from './checkout/CheckoutPaymentSelector';
import { CheckoutFallbackAlert } from './checkout/CheckoutFallbackAlert';
import { CheckoutLoyaltyReward } from './checkout/CheckoutLoyaltyReward';

export function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, subtotal, deliveryCharge, total, createOrder } = useCart();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { earnCoins } = useLoyalty();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'WHATSAPP' | 'COD'>('RAZORPAY');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.full_name) setName(user.full_name);
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
      if (user.address) setAddress(user.address);
      if (user.city) setCity(user.city);
      if (user.pincode) setPincode(user.pincode);
    }
  }, [user, isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleWhatsAppRedirect = (orderId: string) => {
    const itemsList = cart
      .map((item, idx) => `${idx + 1}. *${item.product.name}* (${item.product.unit}) - Qty: ${item.quantity}`)
      .join('\n');

    const msg = encodeURIComponent(
      `🛒 *NEW ORDER: ${orderId}*\n👤 *Customer:* ${name}\n📞 *Phone:* ${phone}\n📍 *Address:* ${address}, ${city} - ${pincode}\n` +
      `------------------------------------\n📦 *Items:*\n${itemsList}\n💰 *TOTAL:* ${STORE_SETTINGS.currencySymbol}${total}\n` +
      `Admin: Akash (+91 7776032964)`
    );
    window.open(`https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${msg}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      return setError('Please fill in name, phone, address, and pincode.');
    }
    if (phone.trim().length < 8) return setError('Please enter a valid phone number.');

    setError('');
    setFallbackNotice(null);

    if (isAuthenticated) {
      updateProfile({ full_name: name.trim(), phone: phone.trim(), address: address.trim(), city: city.trim(), pincode: pincode.trim() });
    }

    if (paymentMethod === 'RAZORPAY') {
      setIsProcessing(true);
      await initiateRazorpayPayment({
        amount: total,
        customerName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        orderDescription: `Order for ${cart.length} cleaning supplies`,
        onSuccess: (paymentId, orderId) => {
          setIsProcessing(false);
          const order = createOrder({
            customerName: name.trim(), phone: phone.trim(), address: address.trim(),
            city: city.trim() || 'Local Area', pincode: pincode.trim(),
            paymentMethod: 'RAZORPAY', paymentStatus: 'PAID',
            razorpayPaymentId: paymentId, razorpayOrderId: orderId,
          });
          earnCoins(total, order.orderId);
        },
        onDismissOrFailure: (reason) => {
          setIsProcessing(false);
          setFallbackNotice(reason || 'Payment cancelled. Switch to WhatsApp Order or COD below.');
        },
      });
      return;
    }

    if (paymentMethod === 'WHATSAPP') {
      const order = createOrder({
        customerName: name.trim(), phone: phone.trim(), address: address.trim(),
        city: city.trim() || 'Local Area', pincode: pincode.trim(),
        paymentMethod: 'WHATSAPP', paymentStatus: 'PENDING',
      });
      earnCoins(total, order.orderId);
      handleWhatsAppRedirect(order.orderId);
      return;
    }

    if (paymentMethod === 'COD') {
      const order = createOrder({
        customerName: name.trim(), phone: phone.trim(), address: address.trim(),
        city: city.trim() || 'Local Area', pincode: pincode.trim(),
        paymentMethod: 'COD', paymentStatus: 'PENDING',
      });
      earnCoins(total, order.orderId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Secure Checkout & Delivery</h2>
            <p className="text-xs text-slate-500">Admin: +91 7776032964 • {STORE_SETTINGS.storeName}</p>
          </div>
          <button onClick={() => setIsCheckoutOpen(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">{error}</div>}
          {fallbackNotice && (
            <CheckoutFallbackAlert
              message={fallbackNotice}
              onSelectWhatsApp={() => setPaymentMethod('WHATSAPP')}
              onSelectCOD={() => setPaymentMethod('COD')}
            />
          )}

          <CheckoutAddressForm
            name={name} setName={setName}
            phone={phone} setPhone={setPhone}
            email={email} setEmail={setEmail}
            address={address} setAddress={setAddress}
            city={city} setCity={setCity}
            pincode={pincode} setPincode={setPincode}
          />

          <CheckoutPaymentSelector paymentMethod={paymentMethod} onChangeMethod={setPaymentMethod} />

          <CheckoutLoyaltyReward total={total} />

          {/* Pricing summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between"><span>Items Subtotal:</span><span>{STORE_SETTINGS.currencySymbol}{subtotal}</span></div>
            <div className="flex justify-between"><span>Delivery:</span><span>{deliveryCharge === 0 ? 'FREE' : `${STORE_SETTINGS.currencySymbol}${deliveryCharge}`}</span></div>
            <div className="border-t border-slate-200 pt-1.5 flex justify-between font-black text-sm text-slate-900">
              <span>Payable Total:</span>
              <span className="text-sky-600">{STORE_SETTINGS.currencySymbol}{total}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-sky-600/25 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Connecting Razorpay...</span>
            ) : (
              <span>Confirm & Place Order ({STORE_SETTINGS.currencySymbol}{total})</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
