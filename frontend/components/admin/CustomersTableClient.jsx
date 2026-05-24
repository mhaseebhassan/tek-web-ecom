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
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Search customers</label>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="input-field mt-2"
            placeholder="Search by name or email"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Sort by</label>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="select-field mt-2 w-full appearance-none pr-10 text-xs uppercase tracking-widest"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-panel">
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/[0.055]">
          <h2 className="text-xl font-bold text-foreground">Customer Directory</h2>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full">{formattedCustomers.length} customers</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="table-head">
              <tr>
                <th className="px-8 py-4 text-left">Customer</th>
                <th className="px-8 py-4 text-left">Orders</th>
                <th className="px-8 py-4 text-left">Total Spent</th>
                <th className="px-8 py-4 text-left">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {formattedCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-12 text-center text-muted-foreground font-medium">
                    No customers found.
                  </td>
                </tr>
              ) : (
                formattedCustomers.map((customer) => (
                  <tr key={customer.id} className="table-row">
                    <td className="px-8 py-5 text-sm text-muted-foreground">
                      <div className="font-semibold text-foreground">{customer.name || 'Unnamed customer'}</div>
                      <div className="text-xs text-muted-foreground/80 mt-0.5">{customer.email || 'No email provided'}</div>
                    </td>
                    <td className="px-8 py-5 text-sm font-semibold text-foreground">{customer.orders.length}</td>
                    <td className="px-8 py-5 text-sm font-bold text-foreground">{currency.format(customer.totalSpent)}</td>
                    <td className="px-8 py-5 text-sm text-muted-foreground">
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
