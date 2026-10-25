'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { formatNumber, formatToman, LEVELS } from '@/lib/utils';

export default function DashboardPage() {
  const { customer, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !customer) router.push('/login');
  }, [customer, loading, router]);

  if (loading || !customer) return <div className="p-20 text-center">...</div>;
  const level = LEVELS[customer.loyalty_level];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">داشبورد من</h1>
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { l: 'سطح', v: `${level.icon} ${level.name}` },
          { l: 'مراجعات', v: formatNumber(customer.total_visits) },
          { l: 'امتیاز', v: formatNumber(customer.total_points) },
          { l: 'مجموع خرید', v: formatToman(customer.total_spent) },
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500">{s.l}</p>
            <p className="text-xl font-bold mt-1">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/discounts" className="bg-gradient-to-br from-primary to-secondary text-white p-6 rounded-2xl">
          <h3 className="text-xl font-bold">🎁 طرح‌های تشویقی</h3>
        </Link>
        <Link href="/history" className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-xl font-bold">📜 تاریخچه</h3>
        </Link>
      </div>
    </div>
  );
}