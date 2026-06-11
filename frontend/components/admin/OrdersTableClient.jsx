'use client';

import { useMemo, useState } from 'react';
import OrderStatusControl from '@/components/admin/OrderStatusControl';
import { TruckIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const ORDER_STATUSES = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['all', 'pending', 'completed', 'failed', 'refunded'];

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
      const customerName = (order.user?.name || order.guestCustomer?.name || 'guest').toLowerCase();
      const customerEmail = (order.user?.email || order.guestCustomer?.email || '').toLowerCase();
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
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Search orders</label>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="input-field mt-2"
            placeholder="Search by order ID, customer, or product"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="select-field mt-2 w-full appearance-none pr-10 text-xs uppercase tracking-widest"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Payment</label>
            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
              className="select-field mt-2 w-full appearance-none pr-10 text-xs uppercase tracking-widest"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
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

      <div className="table-panel">
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/[0.055]">
          <h2 className="text-xl font-bold text-foreground">Latest Orders</h2>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full">{filteredOrders.length} shown</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="table-head">
              <tr>
                <th className="px-8 py-4 text-left">Order</th>
                <th className="px-8 py-4 text-left">Customer</th>
                <th className="px-8 py-4 text-left">Items</th>
                <th className="px-8 py-4 text-left">Total</th>
                <th className="px-8 py-4 text-left">Status</th>
                <th className="px-8 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-12 text-center text-muted-foreground font-medium">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  return (
                    <tr key={order.id} className="table-row">
                      <td className="px-8 py-5 text-sm font-bold text-foreground">#{order.id.slice(-6).toUpperCase()}</td>
                      <td className="px-8 py-5 text-sm text-muted-foreground">
                        <div className="font-semibold text-foreground">{order.user?.name || order.guestCustomer?.name || 'Guest'}</div>
                        <div className="text-xs text-muted-foreground/80 mt-0.5">{order.user?.email || order.guestCustomer?.email || 'No email'}</div>
                      </td>
                      <td className="px-8 py-5 text-sm text-muted-foreground">
                        <div className="font-semibold text-foreground">{itemCount} items</div>
                        <div className="text-xs text-muted-foreground/80 mt-0.5">
                          {order.items.map((item) => item.product?.name).filter(Boolean).slice(0, 2).join(', ')}
                          {order.items.length > 2 ? '...' : ''}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-foreground">{currency.format(order.totalAmount)}</td>
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
                        <div className="flex flex-col gap-3">
                          <OrderStatusControl
                            orderId={order.id}
                            initialStatus={order.status}
                            initialPaymentStatus={order.paymentStatus}
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              let toastId;
                              try {
                                const toast = (await import('react-hot-toast')).default;
                                const api = (await import('@/lib/api')).default;
                                toastId = toast.loading('Downloading invoice...');
                                const response = await api.get(`/orders/${order.id}/invoice`, { responseType: 'blob' });
                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', `invoice_${order.id}.pdf`);
                                document.body.appendChild(link);
                                link.click();
                                link.parentNode.removeChild(link);
                                toast.success('Invoice downloaded', { id: toastId });
                              } catch (err) {
                                const toast = (await import('react-hot-toast')).default;
                                toast.error('Invoice is still generating or not found', { id: toastId });
                              }
                            }}
                            className="btn-outline border-primary/25 text-primary hover:border-primary/40 text-xs py-1"
                          >
                            Download Invoice
                          </button>
                        </div>
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
