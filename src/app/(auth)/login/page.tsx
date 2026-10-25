'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [referral, setReferral] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login(phone, {
        full_name: fullName || undefined,
        referral: referral || undefined,
      });
      router.push('/discounts');
    } catch (e: any) {
      setError(e.response?.data?.message || 'خطا در ورود');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-2">ورود / ثبت‌نام</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          شماره موبایل خود را وارد کنید
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="09123456789"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-3 text-left"
          dir="ltr"
        />
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="نام و نام خانوادگی (اختیاری)"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-3"
        />
        <input
          value={referral}
          onChange={(e) => setReferral(e.target.value)}
          placeholder="کد معرف (اختیاری)"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
        />
        <button
          onClick={handleLogin}
          disabled={loading || phone.length !== 11}
          className="w-full bg-primary text-white font-bold py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? 'در حال ورود...' : 'ورود'}
        </button>
      </div>
    </div>
  );
}