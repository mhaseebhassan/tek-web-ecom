'use client';

import { useEffect, useState } from 'react';
import AdminProfileForm from '@/components/admin/AdminProfileForm';
import StoreSettingsForm from '@/components/admin/StoreSettingsForm';
import api from '@/lib/api';

export default function SettingsPage() {
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data.stats || { products: 0, orders: 0, customers: 0 });
      } catch (error) {
        setError(error.data?.message || 'Failed to load settings summary');
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Update your admin profile and track store health.</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-400">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="metric-card relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground relative z-10">Products</p>
          <p className="mt-2 text-3xl font-bold text-foreground relative z-10">{stats.products}</p>
        </div>
        <div className="metric-card relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground relative z-10">Orders</p>
          <p className="mt-2 text-3xl font-bold text-foreground relative z-10">{stats.orders}</p>
        </div>
        <div className="metric-card relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground relative z-10">Customers</p>
          <p className="mt-2 text-3xl font-bold text-foreground relative z-10">{stats.customers}</p>
        </div>
      </div>

      <div className="table-panel">
        <div className="px-8 py-6 border-b border-white/10 bg-white/[0.055]">
          <h2 className="text-xl font-bold text-foreground">Admin Profile</h2>
        </div>
        <div className="px-8 py-8">
          <AdminProfileForm />
        </div>
      </div>

      <div className="table-panel">
        <div className="px-8 py-6 border-b border-white/10 bg-white/[0.055]">
          <h2 className="text-xl font-bold text-foreground">Store Settings</h2>
        </div>
        <div className="px-8 py-8">
          <StoreSettingsForm />
        </div>
      </div>
    </div>
  );
}
