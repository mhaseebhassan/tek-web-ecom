'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Products', href: '/admin/products', icon: CubeIcon },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCartIcon },
  { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth/login?redirect=/admin');
      return;
    }
    if (!isAdmin) router.replace('/');
  }, [loading, user, isAdmin, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground animate-pulse">
        Verifying admin access
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {sidebarOpen && <button className="fixed inset-0 z-40 bg-black/[0.55] lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-card/80 shadow-[var(--shadow-soft)] backdrop-blur-2xl transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin" className="transition-smooth hover:opacity-85">
            <Logo />
          </Link>
          <button className="icon-button lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-4 py-6">
          <div className="mb-4 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Operations</div>
          <div className="space-y-2">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-[1.1rem] px-4 py-3 text-sm font-extrabold transition-smooth ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-[0_16px_34px_rgb(250_197_100/0.18)]'
                      : 'text-muted-foreground hover:bg-white/[0.08] hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-background/[0.78] px-4 backdrop-blur-2xl sm:px-6 lg:px-10">
          <button type="button" className="icon-button lg:hidden" onClick={() => setSidebarOpen((o) => !o)} aria-label="Toggle sidebar">
            <Bars3Icon className="h-5 w-5" />
          </button>
          <div className="hidden lg:block">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Tekron Control Room</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-foreground">
            {user.name || 'Admin'}
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-8 animate-page-in sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
