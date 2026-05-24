'use client';

import { useMemo, useState } from 'react';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most recent' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'orders', label: 'Most orders' },
  { value: 'spent', label: 'Highest spend' },
];

export default function CustomersTableClient({ customers }) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const formattedCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const mapped = customers.map((customer) => {
      const totalSpent = customer.orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const lastOrderDate = customer.orders
        .map((order) => new Date(order.createdAt))
        .sort((a, b) => b - a)[0];

      return {
        ...customer,
        totalSpent,
        lastOrderDate,
      };
    });

    const filtered = normalizedQuery
      ? mapped.filter((customer) => {
          const name = (customer.name || '').toLowerCase();
          const email = (customer.email || '').toLowerCase();
          return name.includes(normalizedQuery) || email.includes(normalizedQuery);
        })
      : mapped;

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'orders') {
        return b.orders.length - a.orders.length;
      }
      if (sortBy === 'spent') {
        return b.totalSpent - a.totalSpent;
      }
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    return sorted;
  }, [customers, query, sortBy]);

  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Search customers</label>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Search by name or email"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Sort by</label>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-amber-100 bg-white px-3 py-3 text-xs font-semibold uppercase tracking-widest text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-panel rounded-[2.5rem] shadow-xl shadow-teal-500/10 border border-amber-200/60 overflow-hidden">
        <div className="px-8 py-6 border-b border-amber-200/60 flex items-center justify-between bg-amber-100/40">
          <h2 className="text-xl font-bold text-slate-900">Customer Directory</h2>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{formattedCustomers.length} customers</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-amber-200/60">
            <thead className="bg-amber-100/40">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Customer</th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Orders</th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Total Spent</th>
                <th className="px-8 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100/60">
              {formattedCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-12 text-center text-slate-400 font-medium">
                    No customers found.
                  </td>
                </tr>
              ) : (
                formattedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="px-8 py-5 text-sm text-slate-600">
                      <div className="font-semibold text-slate-800">{customer.name || 'Unnamed customer'}</div>
                      <div className="text-xs text-slate-400">{customer.email || 'No email provided'}</div>
                    </td>
                    <td className="px-8 py-5 text-sm font-semibold text-slate-700">{customer.orders.length}</td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-900">{currency.format(customer.totalSpent)}</td>
                    <td className="px-8 py-5 text-sm text-slate-500">
                      {customer.lastOrderDate ? customer.lastOrderDate.toLocaleDateString() : 'No orders'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
