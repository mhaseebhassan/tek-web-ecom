'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import { getProductImage, loadCatalogProducts } from '@/lib/products';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const run = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      const products = await loadCatalogProducts();
      const normalized = query.toLowerCase();
      setResults(
        products.filter(
          (p) =>
            p.name?.toLowerCase().includes(normalized) ||
            p.category?.toLowerCase().includes(normalized)
        )
      );
    };
    const t = setTimeout(run, 220);
    return () => clearTimeout(t);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-20 animate-fade-up md:pt-28">
      <button className="absolute inset-0 bg-primary/[0.35] backdrop-blur-md" onClick={onClose} aria-label="Close search" />

      <div className="surface-panel relative w-full max-w-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center gap-4 border-b border-border/70 p-4 sm:p-5">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </div>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search products and categories"
            className="min-w-0 flex-1 border-none bg-transparent text-lg font-extrabold text-foreground outline-none placeholder:text-muted-foreground"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" onClick={onClose} className="icon-button border-transparent bg-muted/50" aria-label="Close search">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="custom-scrollbar max-h-[54vh] overflow-y-auto p-3">
          {query.length < 2 ? (
            <div className="py-14 text-center">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Quick search</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Type at least 2 characters.</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((product) => (
                <Link
                  key={product.id || product._id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="group flex items-center gap-4 rounded-[1.1rem] border border-transparent p-3 transition-smooth hover:border-border/70 hover:bg-muted/[0.35]"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted/50">
                    <SafeImage src={getProductImage(product)} alt={product.name} fill className="object-contain p-2" sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {product.category && <span className="label label-primary">{product.category}</span>}
                    <h4 className="mt-1 truncate text-sm font-black text-foreground transition-smooth group-hover:text-accent">
                      {product.name}
                    </h4>
                  </div>
                  <p className="hidden text-sm font-black text-foreground sm:block">${Number(product.price).toLocaleString()}</p>
                  <ArrowRightIcon className="h-4 w-4 text-muted-foreground transition-smooth group-hover:text-foreground" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-14 text-center text-sm font-semibold text-muted-foreground">No results for &quot;{query}&quot;</p>
          )}
        </div>

        <div className="flex justify-between border-t border-border/70 px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
          <span>Enter opens result</span>
          <span>Esc closes</span>
        </div>
      </div>
    </div>
  );
}
