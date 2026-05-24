'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AnalyticsPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await api.get('/admin/analytics');
        setOrders(response.data.orders || []);
      } catch (error) {
        setError(error.data?.message || 'Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const averageOrder = totalOrders ? totalRevenue / totalOrders : 0;

  const statusCounts = STATUSES.reduce((acc, status) => {
    acc[status] = orders.filter((order) => order.status === status).length;
    return acc;
  }, {});

  const dailyTotalsMap = new Map();
  orders.forEach((order) => {
    const dayKey = new Date(order.createdAt).toISOString().slice(0, 10);
    const current = dailyTotalsMap.get(dayKey) || 0;
    dailyTotalsMap.set(dayKey, current + order.totalAmount);
  });

  const dailyTotals = Array.from(dailyTotalsMap.entries()).map(([date, total]) => ({ date, total }));
  const maxDailyTotal = dailyTotals.reduce((max, entry) => Math.max(max, entry.total), 0);
  const chartPoints = dailyTotals
    .map((entry, index) => {
      const x = dailyTotals.length === 1 ? 0 : (index / (dailyTotals.length - 1)) * 100;
      const y = maxDailyTotal ? 100 - (entry.total / maxDailyTotal) * 100 : 100;
      return `${x},${y}`;
    })
    .join(' ');

  const productMap = new Map();
  orders.flatMap((order) => order.items || []).forEach((item) => {
    const key = item.product?.id || item.name;
    const existing = productMap.get(key) || {
      name: item.product?.name || 'Unknown',
      category: item.product?.category || 'Uncategorized',
      quantity: 0,
      revenue: 0,
    };

    existing.quantity += item.quantity;
    existing.revenue += item.price * item.quantity;
    productMap.set(key, existing);
  });

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Insights for the last 30 days.</p>
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading analytics...</p> : null}
      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-400">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="metric-card relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground relative z-10">Revenue</p>
          <p className="mt-2 text-3xl font-bold text-foreground relative z-10">{currency.format(totalRevenue)}</p>
        </div>
        <div className="metric-card relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground relative z-10">Orders</p>
          <p className="mt-2 text-3xl font-bold text-foreground relative z-10">{totalOrders}</p>
        </div>
        <div className="metric-card relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground relative z-10">Avg Order</p>
          <p className="mt-2 text-3xl font-bold text-foreground relative z-10">{currency.format(averageOrder)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="table-panel">
          <div className="px-8 py-6 border-b border-white/10 bg-white/[0.055]">
            <h2 className="text-xl font-bold text-foreground">Daily Revenue</h2>
          </div>
          <div className="px-8 py-6 space-y-6">
            {dailyTotals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data in the last 30 days.</p>
            ) : (
              <>
                <div className="w-full h-48">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                    <defs>
                      <linearGradient id="revenueStroke" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" />
                      </linearGradient>
                      <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none"
                      stroke="url(#revenueStroke)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={chartPoints}
                    />
                    <polygon
                      fill="url(#revenueFill)"
                      points={`0,100 ${chartPoints} 100,100`}
                    />
                  </svg>
                </div>
                <div className="space-y-4">
                  {dailyTotals.map((entry) => (
                    <div key={entry.date} className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                        <span>{entry.date}</span>
                        <span className="text-foreground">{currency.format(entry.total)}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/[0.08]">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary"
                          style={{ width: `${maxDailyTotal ? (entry.total / maxDailyTotal) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="table-panel">
          <div className="px-8 py-6 border-b border-white/10 bg-white/[0.055]">
            <h2 className="text-xl font-bold text-foreground">Top Products</h2>
          </div>
          <div className="px-8 py-6 space-y-4">
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No product data yet.</p>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product) => (
                  <div key={product.name} className="flex items-center justify-between p-4 bg-white/[0.055] rounded-[1.25rem] border border-white/10 hover:bg-white/[0.08] transition-colors">
                    <div>
                      <p className="text-sm font-bold text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{currency.format(product.revenue)}</p>
                      <p className="label label-primary mt-1">{product.quantity} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {STATUSES.map((status) => {
          const maxStatusCount = Math.max(...Object.values(statusCounts));
          const percent = maxStatusCount ? (statusCounts[status] / maxStatusCount) * 100 : 0;
          return (
            <div key={status} className="surface-card p-6 space-y-4">
              <span className={`label ${status === 'delivered'
                ? 'label-emerald'
                : status === 'processing' || status === 'shipped'
                  ? 'label-teal'
                  : status === 'pending'
                    ? 'label-amber'
                    : 'label-rose'
                }`}>{status}</span>
              <p className="text-3xl font-bold text-foreground tracking-tight">{statusCounts[status]}</p>
              <div className="h-1.5 w-full rounded-full bg-white/[0.08]">
                <div className="h-1.5 rounded-full bg-primary" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
