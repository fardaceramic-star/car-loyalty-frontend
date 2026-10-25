'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { customer, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          ⚡ برق‌کار
        </Link>

        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/" className="hover:text-primary">خانه</Link>
          <Link href="/shop" className="hover:text-primary">فروشگاه</Link>
          <Link href="/discounts" className="hover:text-primary font-semibold">
            🎁 طرح‌های تشویقی
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* سبد خرید */}
          <Link
            href="/cart"
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
            title="سبد خرید"
          >
            <span className="text-2xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {customer ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg"
              >
                {customer.full_name}
              </Link>
              <button onClick={logout} className="text-sm text-red-600">
                خروج
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg"
            >
              ورود / ثبت‌نام
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}