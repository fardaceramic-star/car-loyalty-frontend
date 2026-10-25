'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatToman } from '@/lib/utils';

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart, loading: cartLoading } = useCart();
  const { customer, loading: authLoading } = useAuth();
  const router = useRouter();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState<any>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // اگر لاگین نیست → برو لاگین
  useEffect(() => {
    if (!authLoading && !customer) {
      router.push('/login?redirect=/checkout');
    }
  }, [customer, authLoading, router]);

  // اگر سبد خالی است → برو سبد
  useEffect(() => {
    if (!cartLoading && customer && items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, cartLoading, customer, router]);

  const checkCoupon = async () => {
    if (!couponCode || !customer) return;
    setCheckingCoupon(true);
    try {
      const { data } = await api.post('/discount/calculate', {
        customer_id: customer.id,
        amount: totalPrice,
        coupon_code: couponCode,
      });
      setDiscount(data.data);
    } catch (e: any) {
      alert(e.response?.data?.message || 'کد تخفیف نامعتبر است');
      setDiscount(null);
    } finally {
      setCheckingCoupon(false);
    }
  };

  const handleSubmit = async () => {
    if (!customer || items.length === 0) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
        coupon_code: couponCode || null,
      });

      alert(
        `✅ سفارش با موفقیت ثبت شد!\n\n` +
        `شماره سفارش: ${data.data.order_id}\n` +
        `مبلغ نهایی: ${formatToman(data.data.final_amount)}\n` +
        `تخفیف: ${formatToman(data.data.discount_amount)}`
      );

      await clearCart();
      router.push('/dashboard');
    } catch (e: any) {
      alert(e.response?.data?.message || 'خطا در ثبت سفارش');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !customer) {
    return <div className="p-20 text-center">در حال بارگذاری...</div>;
  }

  const finalAmount = discount?.final_amount ?? totalPrice;
  const discountAmount = discount?.total_discount ?? 0;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">📦 تکمیل سفارش</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* اطلاعات مشتری */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold mb-4">👤 اطلاعات شما</h2>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-500">نام: </span>
                {customer.full_name}
              </p>
              <p>
                <span className="text-gray-500">موبایل: </span>
                {customer.phone}
              </p>
            </div>
          </div>

          {/* لیست اقلام */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold mb-4">🛒 اقلام سفارش</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-bold">
                    {formatToman(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* کد تخفیف */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold mb-4">🎁 کد تخفیف</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="کد تخفیف خود را وارد کنید"
                className="flex-1 border rounded-xl px-4 py-2"
              />
              <button
                onClick={checkCoupon}
                disabled={checkingCoupon || !couponCode}
                className="bg-primary text-white px-6 rounded-xl disabled:opacity-50"
              >
                {checkingCoupon ? '...' : 'اعمال'}
              </button>
            </div>
            {discount && (
              <p className="text-sm text-green-600 mt-2">
                ✅ کد تخفیف اعمال شد
              </p>
            )}
          </div>
        </div>

        {/* خلاصه نهایی */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow sticky top-20">
            <h2 className="text-xl font-bold mb-4">خلاصه نهایی</h2>

            <div className="space-y-2 text-sm mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span>تعداد:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>جمع کل:</span>
                <span>{formatToman(totalPrice)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>تخفیف:</span>
                  <span>-{formatToman(discountAmount)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between mb-6">
              <span className="font-bold">قابل پرداخت:</span>
              <span className="font-bold text-primary text-lg">
                {formatToman(finalAmount)}
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-secondary transition disabled:opacity-50"
            >
              {submitting ? 'در حال ثبت...' : '✅ ثبت نهایی سفارش'}
            </button>

            <Link
              href="/cart"
              className="block text-center text-sm text-gray-500 mt-3"
            >
              ← بازگشت به سبد
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}