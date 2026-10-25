'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { formatToman } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  description: string;
  image_url?: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    api.get('/products/filters').then(({ data }) => {
      setCategories(data.data.categories || []);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/products', { params: { search, category, sort } })
      .then(({ data }) => setProducts(data.data))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  const getImageUrl = (path?: string) => {
    if (!path || path.trim() === '') return null;
    if (path.startsWith('http')) return path;
    return `http://172.30.23.57:8000/storage/${path}`;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">🛒 فروشگاه قطعات برقی</h1>

      {/* فیلترها */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6 grid md:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="جستجو..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
          <option value="">همه دسته‌بندی‌ها</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
          <option value="newest">جدیدترین</option>
          <option value="cheapest">ارزان‌ترین</option>
          <option value="expensive">گران‌ترین</option>
        </select>
      </div>

      {/* محصولات */}
      {loading ? (
        <p className="text-center py-10">در حال بارگذاری...</p>
      ) : products.length === 0 ? (
        <p className="text-center py-10 text-gray-500">محصولی یافت نشد</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => {
            const imageUrl = getImageUrl(p.image_url);
            return (
              <Link
                key={p.id}
                href={`/shop/${p.id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                {/* کادر عکس با ارتفاع ثابت و مخفی کردن سرریز */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px', // ارتفاع ثابت برای همه عکس‌ها
                    backgroundColor: '#f3f4f6',
                    overflow: 'hidden',
                  }}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={p.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain', // ✅ کل عکس دیده می‌شود
                        padding: '8px', // فاصله کمی از لبه‌ها برای زیبایی
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px',
                      }}
                    >
                      🔌
                    </div>
                  )}
                </div>

                {/* اطلاعات محصول */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: '14px',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {p.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                    {p.brand} · {p.category}
                  </p>
                  <p
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#667EEA',
                      marginTop: 'auto',
                    }}
                  >
                    {formatToman(p.price)}
                  </p>
                  {p.stock < 5 && (
                    <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                      موجودی محدود
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}