'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  brand?: string;
  category?: string;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { customer, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!customer) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setItems(data.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // هر بار که کاربر لاگین/خروج کرد، سبد را از سرور بگیر
  useEffect(() => {
    if (!authLoading) {
      loadCart();
    }
  }, [customer?.id, authLoading]);

  const addItem = async (productId: number, quantity = 1) => {
    if (!customer) {
      throw new Error('لطفاً ابتدا وارد شوید');
    }
    await api.post('/cart/add', { product_id: productId, quantity });
    await loadCart();
  };

  const removeItem = async (productId: number) => {
    await api.delete(`/cart/remove/${productId}`);
    await loadCart();
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity < 1) return;
    await api.put(`/cart/update/${productId}`, { quantity });
    await loadCart();
  };

  const clearCart = async () => {
    await api.delete('/cart/clear');
    setItems([]);
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        refresh: loadCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};