'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.stats);
    } catch (err) {
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
    const backendUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1').replace('/api/v1', '');
    
    if (token) {
      const socket = io(backendUrl, {
        auth: { token },
        withCredentials: true
      });

      socket.on('new-order', (data) => {
        toast.success(data.message || 'New order received!', {
          duration: 6000,
          icon: '🛍️',
        });
        fetchStats(); // Update stats automatically
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);


  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const statCards = [
    {
      name: 'Total Revenue',
      value: `$${(stats?.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+12.5%',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Total Orders',
      value: (stats?.orders || 0).toLocaleString(),
      change: '+8.2%',
      icon: ShoppingCartIcon,
    },
    {
      name: 'Total Customers',
      value: (stats?.customers || 0).toLocaleString(),
      change: '+5.1%',
      icon: UsersIcon,
    },
    {
      name: 'Total Products',
      value: (stats?.products || 0).toLocaleString(),
      change: '+2',
      icon: CubeIcon,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Real-time performance metrics for Tekron.</p>
      </div>

      {/* Stats Rows */}
      <div className="glass-panel rounded-[2rem] shadow-xl shadow-teal-500/10 border border-amber-200/60 overflow-hidden">
        <div className="divide-y divide-amber-200/60 flex flex-col md:flex-row md:divide-y-0 md:divide-x">
          {statCards.map((stat) => (
            <div key={stat.name} className="flex-1 flex flex-col px-8 py-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${stat.name.includes('Revenue') ? 'bg-emerald-50 text-emerald-600' :
                  stat.name.includes('Orders') ? 'bg-teal-50 text-teal-600' :
                    stat.name.includes('Customers') ? 'bg-amber-50 text-amber-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                  <stat.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Total</span>
                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-slate-600">{stat.name.replace('Total ', '')}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-black text-slate-900">{stat.value}</span>
                <span className={`label flex-shrink-0 ${stat.change.startsWith('+') ? 'label-emerald' : 'label-rose'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
