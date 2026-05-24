'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import OrdersTableClient from '@/components/admin/OrdersTableClient';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.get('/admin/orders');
        setOrders(response.data.orders || []);
      } catch (error) {
        setError(error.data?.message || 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingCount = orders.filter((order) => order.status === 'pending').length;
  const processingCount = orders.filter((order) => order.status === 'processing').length;
  const deliveredCount = orders.filter((order) => order.status === 'delivered').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1">Track, update, and manage every purchase.</p>
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading orders...</p> : null}
      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-400">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="metric-card relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground relative z-10">Total Revenue</p>
          <p className="mt-2 text-3xl font-bold text-foreground relative z-10">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="metric-card relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground relative z-10">Pending</p>
          <p className="mt-2 text-3xl font-bold text-foreground relative z-10">{pendingCount}</p>
        </div>
        <div className="metric-card relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground relative z-10">Processing</p>
          <p className="mt-2 text-3xl font-bold text-foreground relative z-10">{processingCount}</p>
        </div>
        <div className="metric-card relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground relative z-10">Delivered</p>
          <p className="mt-2 text-3xl font-bold text-foreground relative z-10">{deliveredCount}</p>
        </div>
      </div>

      <OrdersTableClient orders={orders} />
    </div>
  );
}
