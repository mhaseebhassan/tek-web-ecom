'use client';


import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCartIcon, UserIcon, ArrowRightOnRectangleIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import SearchOverlay from './SearchOverlay';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path) => pathname === path;

  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
      isScrolled 
        ? 'py-2 px-4' 
        : 'py-4 px-6 bg-gradient-to-b from-white/20 to-transparent'
    }`}>
      <div className={`max-w-7xl mx-auto transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isScrolled 
          ? 'glass-panel border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-[2rem] px-4 md:px-8' 
          : 'bg-transparent border-transparent px-0'
      }`}>
        <div className={`flex justify-between items-center transition-all duration-700 ${isScrolled ? 'h-14' : 'h-16'}`}>

          {/* Logo & Primary Navigation */}
          <div className="flex items-center gap-10">
            <Link href="/" className="group transition-transform active:scale-95">
              <Logo className={`transition-all duration-500 ${isScrolled ? 'h-7' : 'h-8'}`} />
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {[
                { name: 'Home', href: '/' },
                { name: 'Catalog', href: '/products' }
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 group ${
                    isActive(item.href)
                      ? 'text-teal-600'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-500 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
                  )}
                  <span className="absolute inset-0 bg-slate-100/50 rounded-xl scale-0 group-hover:scale-100 transition-transform -z-10" />
                </Link>
              ))}
            </div>
          </div>

          {/* User Actions & Cart */}
          <div className="flex items-center gap-3">
            {/* Auth State Menu */}
            <div className="hidden sm:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3 p-1 pl-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-sm border-shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-tr from-teal-400 to-emerald-400 rounded-full flex items-center justify-center shadow-inner">
                      <UserIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 tracking-tight">{user.name?.split(' ')[0] || 'User'}</span>
                  </div>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.1em] text-amber-600 bg-amber-50/80 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-all border border-amber-100/50">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all active:scale-90"
                    title="Sign Out"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-[10px] font-black uppercase tracking-[0.15em] text-white bg-slate-900 hover:bg-teal-600 px-6 py-2.5 rounded-full transition-all hover:shadow-[0_8px_20px_rgba(20,184,166,0.2)] active:scale-95"
                >
                  Join Tekron
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="h-10 w-10 flex items-center justify-center text-slate-700 bg-white/50 backdrop-blur-md hover:bg-white rounded-full transition-all border border-white/60 shadow-sm hover:shadow-md active:scale-90 group"
                title="Search (Cmd+K)"
              >
                <MagnifyingGlassIcon className="h-5 w-5 group-hover:text-teal-600 transition-colors" />
              </button>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative h-10 w-10 flex items-center justify-center text-slate-700 bg-white/50 backdrop-blur-md hover:bg-white rounded-full transition-all border border-white/60 shadow-sm hover:shadow-md active:scale-90 group"
              >
                <ShoppingCartIcon className="h-5 w-5 group-hover:text-teal-600 transition-colors" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in-50 duration-300">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
                className="md:hidden h-10 w-10 flex items-center justify-center text-slate-700 bg-white/50 backdrop-blur-md hover:bg-white rounded-full transition-all border border-white/60 shadow-sm hover:shadow-md active:scale-90"
              >
                {isMobileMenuOpen
                  ? <XMarkIcon className="h-5 w-5" />
                  : <Bars3Icon className="h-5 w-5" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`md:hidden fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="mt-20 mx-4 mb-4 bg-white/90 backdrop-blur-3xl rounded-[2rem] shadow-[0_32px_64px_rgba(0,0,0,0.12)] border border-white/60 overflow-hidden">
          {/* Nav Links */}
          <div className="p-6 space-y-1">
            {[
              { name: 'Home', href: '/' },
              { name: 'Catalog', href: '/products' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.15em] transition-all ${
                  isActive(item.href)
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.name}
                {isActive(item.href) && <span className="ml-auto w-1.5 h-1.5 bg-teal-400 rounded-full" />}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-6 border-t border-slate-100" />

          {/* Auth Section */}
          <div className="p-6">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-tr from-teal-400 to-emerald-400 rounded-full flex items-center justify-center shadow">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{user.name?.split(' ')[0] || 'User'}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-rose-500 bg-rose-50 hover:bg-rose-100 transition-all"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-slate-900 text-white text-sm font-black uppercase tracking-widest hover:bg-teal-600 transition-all active:scale-95"
              >
                Join Tekron
              </Link>
            )}
          </div>
        </div>
      </div>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}
