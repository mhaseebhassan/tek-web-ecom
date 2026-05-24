'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import CustomersTableClient from '@/components/admin/CustomersTableClient';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await api.get('/admin/customers');
        setCustomers(response.data.customers || []);
      } catch (error) {
        setError(error.data?.message || 'Failed to load customers');
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Customers</h1>
        <p className="text-muted-foreground mt-1">Know your highest value buyers and their recent activity.</p>
      </div>
      {isLoading ? <p className="text-muted-foreground">Loading customers...</p> : null}
      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-400">
          {error}
        </div>
      ) : null}
      <CustomersTableClient customers={customers} />
    </div>
  );
}
