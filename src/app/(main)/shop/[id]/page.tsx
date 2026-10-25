'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { formatToman } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { customer } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data.data));
  }, [id]);

  const handleAddToCart = async () => {
    if (!customer) {
      router.push('/login');
      return;
    }
    try {
      await addItem(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (e: any) {
      alert(e.response?.data?.message || e.message || 'خطا');
    }
  };

  const getImageUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://172.30.23.57:8000/storage/${path}`;
  };

  if (!product) return <div className="p-20 text-center">...</div>;

  const imageUrl = getImageUrl(product.image_url);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div 
        style={{ 
          backgroundColor: '#fff', 
          borderRadius: '24px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
          overflow: 'hidden' 
        }}
      >
        <div className="grid md:grid-cols-2">
          {/* کادر عکس محصول */}
          <div 
            style={{ 
              position: 'relative', 
              width: '100%', 
              height: '400px', // ارتفاع ثابت برای صفحه محصول (بزرگتر از فروشگاه)
              backgroundColor: '#f3f4f6', 
              overflow: 'hidden' 
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain', // کل عکس دیده شود
                  padding: '20px', // فاصله از لبه‌ها
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-9xl">
                🔌
              </div>
            )}
          </div>

          {/* اطلاعات محصول */}
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-500 mb-4">
              {product.brand} · {product.category}
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <p className="text-3xl font-bold text-primary mb-6">
              {formatToman(product.price)}
            </p>

            <div className="flex items-center gap-3 mb-6">
              <label className="font-medium">تعداد:</label>
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded-xl px-4 py-2 w-24 text-center"
              />
              <span className="text-sm text-gray-500">از {product.stock} عدد</span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-secondary transition disabled:opacity-50"
              >
                {added ? '✅ به سبد اضافه شد' : '🛒 افزودن به سبد خرید'}
              </button>

              <button
                onClick={() => {
                  handleAddToCart();
                  router.push('/cart');
                }}
                disabled={product.stock === 0}
                className="w-full border-2 border-primary text-primary font-bold py-3 rounded-xl hover:bg-primary hover:text-white transition disabled:opacity-50"
              >
                خرید سریع
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}