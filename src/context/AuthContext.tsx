'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';

interface Customer {
  id: number;
  full_name: string;
  phone: string;
  referral_code: string;
  loyalty_level: number;
  level_info: { name: string; icon: string };
  total_points: number;
  total_visits: number;
  total_spent: number;
}

interface AuthContextType {
  customer: Customer | null;
  loading: boolean;
  login: (phone: string, extra?: object) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const { data } = await api.get('/me');
          setCustomer(data.customer);
        } catch {
          Cookies.remove('token');
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (phone: string, extra: object = {}) => {
     const { data } = await api.post('/auth/login', { phone, ...extra });
    Cookies.set('token', data.token, { expires: 30 });
    setCustomer(data.customer);
   };

  const logout = () => {
    Cookies.remove('token');
    setCustomer(null);
    window.location.href = '/';
  };

  const refresh = async () => {
    const { data } = await api.get('/me');
    setCustomer(data.customer);
  };

  return (
    <AuthContext.Provider value={{ customer, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};