'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import PageShell from '@/components/PageShell';
import EmptyState from '@/components/ui/EmptyState';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders || []);
      setError('');
    } catch (err) {
      setError(err.data?.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth/login?redirect=/orders');
      return;
    }
    fetchOrders();
  }, [loading, user, router]);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1').replace('/api/v1', '');

    if (!token || !user) return undefined;

    const socket = io(socketUrl, { auth: { token }, withCredentials: true });

    socket.on('order-status-updated', (data) => {
      toast.success(data.message || 'Order status updated');
      fetchOrders();
    });

    return () => socket.disconnect();
  }, [user]);

  const cancelOrder = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) {
      toast.error(err.data?.message || 'Unable to cancel order');
    }
  };

  if (loading || isLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Loading orders</div>;
  }

  return (
    <PageShell title="My orders" subtitle="Track purchases and live status updates.">
      {error ? (
        <div className="mb-6 rounded-[1rem] border border-rose-400/25 bg-rose-400/[0.12] px-4 py-3 text-sm font-semibold text-rose-300">{error}</div>
      ) : null}

      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBagIcon}
          title="No orders yet"
          description="When you place an order, it will appear here with live status updates."
          actionLabel="Browse products"
          actionHref="/products"
        />
      ) : (
        <div className="space-y-5">
          {orders.map((order, index) => (
            <ScrollReveal key={order.id} delay={Math.min(index * 50, 220)}>
              <article className="surface-card group relative overflow-hidden p-5 md:p-6 transition-smooth hover:-translate-y-1 hover:border-primary/25">
                <div className="aurora-sheen opacity-0 transition-opacity duration-700 group-hover:opacity-45" />
                <div className="relative z-10">
                  <div className="grid gap-5 border-b border-white/10 pb-5 md:grid-cols-3 md:items-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Order ID</p>
                      <p className="mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 font-mono text-sm font-bold text-foreground">{order.id}</p>
                    </div>
                    <div className="md:text-center">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Status</p>
                      <span
                        className={`label mt-2 ${
                          order.status === 'delivered'
                            ? 'label-emerald'
                            : order.status === 'cancelled'
                              ? 'label-rose'
                              : 'label-primary'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="md:text-right">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Total</p>
                      <p className="mt-2 text-3xl font-black tracking-tight text-foreground">${order.total?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-4">
                    <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Items</p>
                    <ul className="space-y-3 text-sm">
                      {(order.items || []).map((item, itemIndex) => (
                        <li key={`${order.id}-${itemIndex}`} className="flex items-center justify-between gap-4 text-foreground">
                          <span className="flex min-w-0 items-center gap-3 font-semibold">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-black text-primary-foreground">{item.quantity}x</span>
                            <span className="truncate">{item.name}</span>
                          </span>
                          <span className="font-bold text-muted-foreground">${item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {['pending', 'confirmed'].includes(order.status) ? (
                    <div className="mt-5 flex justify-end">
                      <button type="button" onClick={() => cancelOrder(order.id)} className="btn-outline border-rose-400/25 text-rose-300 hover:border-rose-400/40">
                        Cancel order
                      </button>
                    </div>
                  ) : null}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      )}
    </PageShell>
  );
}
