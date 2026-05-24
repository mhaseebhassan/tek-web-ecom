'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import PageShell from '@/components/PageShell';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const statConfig = [
  { key: 'revenue', label: 'Revenue', icon: CurrencyDollarIcon, format: (v) => `$${(v || 0).toLocaleString()}` },
  { key: 'orders', label: 'Orders', icon: ShoppingCartIcon, format: (v) => (v || 0).toLocaleString() },
  { key: 'customers', label: 'Customers', icon: UsersIcon, format: (v) => (v || 0).toLocaleString() },
  { key: 'products', label: 'Products', icon: CubeIcon, format: (v) => (v || 0).toLocaleString() },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.stats);
      setError('');
    } catch {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    const backendUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1').replace(
      '/api/v1',
      ''
    );
    if (!token) return undefined;

    const socket = io(backendUrl, { auth: { token }, withCredentials: true });
    socket.on('new-order', (data) => {
      toast.success(data.message || 'New order received!');
      fetchStats();
    });
    return () => socket.disconnect();
  }, []);

  return (
    <PageShell
      title="Dashboard"
      subtitle="Live overview of your store performance."
      className="!py-0 !px-0 space-y-8"
    >
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="surface-card h-40 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[1.25rem] border border-rose-400/25 bg-rose-400/[0.12] p-8 text-center font-semibold text-rose-300">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statConfig.map((item, idx) => (
              <ScrollReveal key={item.key} delay={idx * 80}>
                <div className="metric-card group relative overflow-hidden">
                  <div className="aurora-sheen opacity-0 transition-opacity duration-700 group-hover:opacity-40" />
                  <div className="relative z-10 flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-[1.2rem] bg-primary/[0.15] text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1.5">
                      <ArrowTrendingUpIcon className="h-3 w-3" />
                      Live
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground">{item.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1 tracking-tight">
                    {item.format(stats?.[item.key])}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {stats?.lowStockProducts?.length > 0 && (
            <ScrollReveal delay={200}>
              <div className="surface-panel p-8 md:p-10 relative overflow-hidden mt-10">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <span className="text-xs uppercase tracking-widest font-bold bg-rose-100 text-rose-600 px-3 py-1 rounded-full">Low stock</span>
                  {stats.lowStock} products need attention
                </h3>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.055] overflow-hidden">
                  <ul className="divide-y divide-white/10">
                    {stats.lowStockProducts.map((p) => (
                      <li
                        key={p.id}
                        className="flex justify-between items-center px-6 py-4 hover:bg-white/[0.06] transition-colors"
                      >
                        <span className="font-semibold text-foreground text-sm">{p.name}</span>
                        <span className="label label-rose">{p.stock} left</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          )}
        </>
      )}
    </PageShell>
  );
}
