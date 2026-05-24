'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import Logo from './Logo';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import SearchOverlay from './SearchOverlay';

const navItems = (user) => [
  { name: 'Home', href: '/' },
  { name: 'Catalog', href: '/products' },
  ...(user ? [{ name: 'Orders', href: '/orders' }] : []),
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cart, openCartDrawer } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path) => pathname === path;
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const items = navItems(user);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-smooth ${
        isScrolled ? 'border-b border-border/70 bg-background/[0.86] shadow-sm backdrop-blur-xl' : 'bg-background/[0.72] backdrop-blur-md'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="shrink-0 transition-smooth hover:opacity-85">
            <Logo />
          </Link>

          <div className="hidden items-center rounded-lg border border-border/70 bg-card/80 p-1 shadow-sm md:flex">
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`rounded-md px-4 py-2 text-sm font-bold transition-smooth ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="icon-button hidden sm:inline-flex"
              title="Search"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {user?.role === 'admin' && (
              <Link href="/admin" className="icon-button hidden sm:inline-flex" aria-label="Admin">
                <Squares2X2Icon className="h-5 w-5" />
              </Link>
            )}

            <button type="button" onClick={openCartDrawer} className="icon-button relative" aria-label="Cart">
              <ShoppingCartIcon className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[10px] font-black text-secondary-foreground shadow-sm">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            <div className="hidden items-center gap-2 sm:flex">
              {user ? (
                <>
                  <div className="hidden items-center gap-2 rounded-lg border border-border/70 bg-card px-3 py-2 lg:flex">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="max-w-24 truncate text-sm font-bold text-foreground">
                      {user.name?.split(' ')[0] || 'Account'}
                    </span>
                  </div>
                  <button type="button" onClick={logout} className="icon-button" aria-label="Sign out">
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <Link href="/auth/login" className="btn-primary px-4 py-2.5">
                  Sign in
                </Link>
              )}
            </div>

            <button
              type="button"
              className="icon-button md:hidden"
              onClick={() => setIsMobileMenuOpen((p) => !p)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden border-t border-border/70 bg-card/95 backdrop-blur-xl transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-[440px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-2 px-4 py-5">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block rounded-lg px-4 py-3 text-sm font-bold transition-smooth ${
                isActive(item.href) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-muted-foreground transition-smooth hover:bg-muted/60 hover:text-foreground"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            Search
          </button>

          <div className="border-t border-border/70 pt-3">
            {user ? (
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-muted-foreground transition-smooth hover:bg-muted/60 hover:text-foreground"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Sign out
              </button>
            ) : (
              <Link href="/auth/login" className="btn-primary w-full">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}
