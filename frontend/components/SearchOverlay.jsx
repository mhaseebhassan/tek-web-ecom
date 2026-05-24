'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      if (query.length > 1) {
        try {
          const response = await fetch('/api/products');
          if (response.ok) {
            const products = await response.json();
            const filtered = products.filter(p => 
              p.name.toLowerCase().includes(query.toLowerCase()) ||
              p.category.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
          }
        } catch (error) {
          console.error('Search fetch error:', error);
        }
      } else {
        setResults([]);
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:px-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_32px_128px_rgba(0,0,0,0.2)] border border-white/50 overflow-hidden transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] animate-in zoom-in-95 mt-4">
        <div className="p-6 flex items-center gap-6 border-b border-slate-100/50">
          <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center shadow-inner">
            <MagnifyingGlassIcon className="w-6 h-6 text-teal-600" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="What are you looking for?"
            className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-slate-900 placeholder:text-slate-300 tracking-tight"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-3 hover:bg-rose-50 rounded-full transition-all group active:scale-90"
          >
            <XMarkIcon className="w-6 h-6 text-slate-400 group-hover:text-rose-500 transition-colors" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          {query.length <= 1 ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 opacity-40">
                <MagnifyingGlassIcon className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Search Tekron Universe</p>
              <p className="text-sm mt-3 text-slate-500 font-medium">Find the latest in premium tech and lifestyle.</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid gap-2">
              {results.map((product) => (
                <Link 
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-5 p-4 rounded-3xl hover:bg-white transition-all border border-transparent hover:border-white hover:shadow-xl hover:shadow-slate-200/50 group"
                >
                  <div className="w-20 h-20 relative bg-slate-50 rounded-2xl overflow-hidden shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                    <Image src={product.image} alt={product.name} fill className="object-contain p-3" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{product.category}</span>
                    </div>
                    <h4 className="font-black text-slate-900 text-lg leading-tight group-hover:text-teal-700 transition-colors">{product.name}</h4>
                    <p className="text-xs text-slate-400 font-medium mt-1">Available Now</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-xl tracking-tighter">${product.price}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">In Stock</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <p className="text-sm font-bold">We couldn't find anything for "{query}"</p>
              <p className="text-xs mt-2 font-medium opacity-60">Try searching for a category like "Laptops"</p>
            </div>
          )}
        </div>

        <div className="p-5 bg-slate-50/80 backdrop-blur-md flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 border-t border-slate-100/50">
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <kbd className="bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm text-slate-600 font-black">ENT</kbd> 
              to select
            </span>
            <span className="flex items-center gap-2">
              <kbd className="bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm text-slate-600 font-black">ESC</kbd> 
              to close
            </span>
          </div>
          <span className="text-teal-600/60">Tekron Intelligence</span>
        </div>
      </div>
    </div>
  );
}
