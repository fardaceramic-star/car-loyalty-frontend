'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { formatToman } from '@/lib/utils';

export default function HistoryPage() {
  const { customer } = useAuth();
  const [visits, setVisits] = useState<any[]>([]);

  useEffect(() => {
    if (customer) api.get('/visits/my-history').then(({ data }) => setVisits(data.data));
  }, [customer]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">تاریخچه مراجعات</h1>
      {visits.length === 0 ? (
        <p className="bg-white p-6 rounded-xl text-center text-gray-500">خالی</p>
      ) : (
        <div className="space-y-3">
          {visits.map((v) => (
            <div key={v.id} className="bg-white p-4 rounded-xl shadow flex justify-between">
              <div>
                <p className="font-bold">{v.visit_type}</p>
                <p className="text-sm text-gray-500">{new Date(v.created_at).toLocaleDateString('fa-IR')}</p>
              </div>
              <div className="text-left">
                <p className="font-bold">{formatToman(v.final_amount)}</p>
                <p className="text-xs text-primary">+{v.points_earned} امتیاز</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}