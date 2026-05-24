'use client';

import { useMemo, useState } from 'react';
import OrderStatusControl from '@/components/admin/OrderStatusControl';
import { TruckIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const ORDER_STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['all', 'pending', 'completed', 'failed'];

export default function OrdersTableClient({ orders }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;

      if (!normalizedQuery) {
        return matchesStatus && matchesPayment;
      }

      const orderId = order.id.slice(-6).toLowerCase();
      const customerName = (order.user?.name || 'guest').toLowerCase();
      const customerEmail = (order.user?.email || '').toLowerCase();
      const itemNames = order.items
        .map((item) => item.product?.name || '')
        .join(' ')
        .toLowerCase();

      const matchesQuery =
        orderId.includes(normalizedQuery) ||
        customerName.includes(normalizedQuery) ||
        customerEmail.includes(normalizedQuery) ||
        itemNames.includes(normalizedQuery);

      return matchesStatus && matchesPayment && matchesQuery;
    });
  }, [orders, query, statusFilter, paymentFilter]);

  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Search orders</label>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Search by order ID, customer, or product"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Status</label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-3 py-3 text-xs font-semibold uppercase tracking-widest text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Payment</label>
            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-3 py-3 text-xs font-semibold uppercase tracking-widest text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[2.5rem] shadow-xl shadow-teal-500/10 border border-amber-200/60 overflow-hidden">
        <div className="px-8 py-6 border-b border-amber-200/60 flex items-center justify-between bg-amber-100/40">
          <h2 className="text-xl font-bold text-slate-900">Latest Orders</h2>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{filteredOrders.length} shown</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-amber-200/60">
            <thead className="bg-amber-100/40">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Order</th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Customer</th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Items</th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Total</th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-12 text-center text-slate-400 font-medium">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  return (
                    <tr key={order.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="px-8 py-5 text-sm font-bold text-slate-900">#{order.id.slice(-6).toUpperCase()}</td>
                      <td className="px-8 py-5 text-sm text-slate-600">
                        <div className="font-semibold text-slate-800">{order.user?.name || 'Guest'}</div>
                        <div className="text-xs text-slate-400">{order.user?.email || 'No email'}</div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-600">
                        <div className="font-semibold">{itemCount} items</div>
                        <div className="text-xs text-slate-400">
                          {order.items.map((item) => item.product?.name).filter(Boolean).slice(0, 2).join(', ')}
                          {order.items.length > 2 ? '...' : ''}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-900">{currency.format(order.totalAmount)}</td>
                      <td className="px-8 py-5">
                        <div className={`label flex items-center gap-1 ${order.status === 'delivered'
                          ? 'label-emerald'
                          : order.status === 'processing' || order.status === 'shipped'
                            ? 'label-teal'
                            : order.status === 'pending'
                              ? 'label-amber'
                              : 'label-rose'
                          }`}
                        >
                          {order.status === 'delivered' ? <CheckCircleIcon className="h-3.5 w-3.5" /> : null}
                          {order.status === 'processing' || order.status === 'shipped' ? <TruckIcon className="h-3.5 w-3.5" /> : null}
                          {order.status === 'pending' ? <ClockIcon className="h-3.5 w-3.5" /> : null}
                          {order.status === 'cancelled' ? <XCircleIcon className="h-3.5 w-3.5" /> : null}
                          {order.status}
                        </div>
                        <div className="mt-2">
                          <span className={`label flex items-center gap-1 ${order.paymentStatus === 'completed'
                            ? 'label-emerald'
                            : order.paymentStatus === 'failed'
                              ? 'label-rose'
                              : 'label-amber'
                            }`}
                          >
                            {order.paymentStatus === 'completed' ? <CheckCircleIcon className="h-3.5 w-3.5" /> : null}
                            {order.paymentStatus === 'failed' ? <XCircleIcon className="h-3.5 w-3.5" /> : null}
                            {order.paymentStatus === 'pending' ? <ClockIcon className="h-3.5 w-3.5" /> : null}
                            {order.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <OrderStatusControl
                          orderId={order.id}
                          initialStatus={order.status}
                          initialPaymentStatus={order.paymentStatus}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
