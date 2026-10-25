'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DiscountCard from '@/components/loyalty/DiscountCard';
import api from '@/lib/api';
import { formatToman } from '@/lib/utils';

export default function DiscountsPage() {
  const { customer, loading, refresh } = useAuth();
  const router = useRouter();
  const [coupons, setCoupons] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !customer) router.push('/login');
  }, [customer, loading, router]);

  useEffect(() => {
    if (customer) {
      api.get('/discount/my-coupons').then(({ data }) => setCoupons(data.data));
    }
  }, [customer]);

  const convertPoints = async () => {
    if (!customer || customer.total_points < 1000) return alert('حداقل ۱۰۰۰ امتیاز');
    try {
      const { data } = await api.post('/points/convert', { points: 1000 });
      alert(data.message);
      await refresh();
      const c = await api.get('/discount/my-coupons');
      setCoupons(c.data.data);
    } catch (e: any) { alert(e.response?.data?.message || 'خطا'); }
  };

  if (loading || !customer) return <div className="p-20 text-center">...</div>;

  return (
    <div className="py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">طرح‌های تشویقی</h1>
      <DiscountCard customer={customer} onConvert={convertPoints} />
      <div className="max-w-3xl mx-auto mt-10">
        <h2 className="text-xl font-bold mb-4">کدهای فعال شما</h2>
        {coupons.length === 0 ? (
          <p className="text-gray-500 bg-white p-6 rounded-2xl text-center">کدی ندارید</p>
        ) : (
          <div className="space-y-3">
            {coupons.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-xl shadow flex justify-between">
                <div>
                  <h4 className="font-bold">{c.title}</h4>
                  <p className="text-sm text-gray-500">
                    {c.percent > 0 ? `${c.percent}٪` : formatToman(c.amount)}
                  </p>
                </div>
                <code className="bg-gray-100 px-3 py-1 rounded">{c.code}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}