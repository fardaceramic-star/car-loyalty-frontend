'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatToman } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    loading,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();
  const { customer } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!customer) {
      router.push('/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  const handleRemove = async (id: number) => {
    try {
      await removeItem(id);
    } catch {
      alert('خطا در حذف محصول');
    }
  };

  const handleQty = async (id: number, qty: number) => {
    try {
      await updateQuantity(id, qty);
    } catch {
      alert('خطا در به‌روزرسانی تعداد');
    }
  };

  const handleClear = async () => {
    if (!confirm('سبد خرید خالی شود؟')) return;
    try {
      await clearCart();
    } catch {
      alert('خطا در خالی کردن سبد');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-4 text-center">
        <div className="text-6xl mb-4 animate-bounce">🛒</div>
        <p className="text-gray-500">در حال بارگذاری سبد...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold mb-4">سبد خرید شما خالی است</h1>
        <p className="text-gray-500 mb-8">
          هنوز هیچ محصولی به سبد اضافه نکرده‌اید
        </p>
        <Link
          href="/shop"
          className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-secondary transition"
        >
          رفتن به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">
        🛒 سبد خرید
        <span className="text-sm font-normal text-gray-500 mr-2">
          ({totalItems} قلم)
        </span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* لیست محصولات */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl shadow flex items-center gap-4"
            >
              <Link
                href={`/shop/${item.id}`}
                className="bg-gray-100 w-20 h-20 rounded-xl flex items-center justify-center text-4xl flex-shrink-0"
              >
                🔌
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/shop/${item.id}`}
                  className="font-bold truncate block hover:text-primary"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">
                  {item.brand} · {item.category}
                </p>
                <p className="text-primary font-bold mt-1">
                  {formatToman(item.price)}
                </p>
                {item.quantity >= item.stock && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ حداکثر موجودی
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => handleQty(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 font-bold min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQty(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  حذف
                </button>
              </div>

              <div className="text-left hidden md:block min-w-[100px]">
                <p className="text-xs text-gray-500">جمع</p>
                <p className="font-bold">
                  {formatToman(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Link
              href="/shop"
              className="text-sm text-primary hover:underline"
            >
              ← ادامه خرید
            </Link>
            <button
              onClick={handleClear}
              className="text-sm text-red-500 hover:underline"
            >
              🗑️ خالی کردن سبد
            </button>
          </div>
        </div>

        {/* خلاصه سفارش */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow sticky top-20">
            <h2 className="text-xl font-bold mb-4">خلاصه سفارش</h2>

            <div className="space-y-2 text-sm mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span className="text-gray-500">تعداد اقلام:</span>
                <span className="font-bold">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">جمع کل:</span>
                <span className="font-bold">{formatToman(totalPrice)}</span>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <span className="font-bold">مبلغ قابل پرداخت:</span>
              <span className="font-bold text-primary text-lg">
                {formatToman(totalPrice)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-secondary transition"
            >
              ادامه و تکمیل سفارش
            </button>

            {!customer ? (
              <p className="text-xs text-gray-500 text-center mt-3">
                برای تکمیل سفارش باید وارد شوید
              </p>
            ) : (
              <p className="text-xs text-green-600 text-center mt-3">
                ✅ وارد شده‌اید به عنوان {customer.full_name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}