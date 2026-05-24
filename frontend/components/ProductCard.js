'use client';

import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ShoppingCartIcon, ArrowRightIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { getAvailability, getProductImage } from '@/lib/products';
import ProductQuickView from '@/components/ProductQuickView';

export default function ProductCard({ product, index = 0 }) {
  const [added, setAdded] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const { addToCart } = useCart();
  const productImage = getProductImage(product);
  const productHref = `/products/${product.slug}`;
  const { isOutOfStock } = getAvailability(product);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product);
    setAdded(true);
    toast.success(`${product.name} added to cart`, {
      style: {
        background: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        borderRadius: '8px',
      },
    });
    setTimeout(() => setAdded(false), 1800);
  };

  const handlePointerMove = (event) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTiltStyle({
      transform: `perspective(900px) rotateX(${(-y * 3.5).toFixed(2)}deg) rotateY(${(x * 3.5).toFixed(2)}deg) translateY(-4px)`,
    });
  };

  const resetTilt = () => {
    setTiltStyle({ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)' });
  };

  return (
    <>
      <article
        className="surface-card group flex h-full flex-col overflow-hidden transition-smooth hover:border-primary/25 hover:shadow-[var(--shadow-soft)]"
        style={{ animationDelay: `${index * 45}ms`, ...tiltStyle }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.035)_45%,rgba(250,197,100,0.08))] p-6">
          <Link href={productHref} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />
          <div className="aurora-sheen opacity-[0.35] transition-opacity duration-700 group-hover:opacity-70" />
          <SafeImage
            src={productImage}
            alt={product.name}
            fill
            className="object-contain p-6 drop-shadow-[0_24px_32px_rgb(0_0_0/0.42)] transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="icon-button absolute bottom-4 right-4 z-20 opacity-0 translate-y-2 transition-smooth group-hover:translate-y-0 group-hover:opacity-100"
            aria-label={`Quick view ${product.name}`}
          >
            <EyeIcon className="h-4 w-4" />
          </button>
        </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-1 items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={productHref} className="group/title">
              <h3 className="line-clamp-2 text-base font-black tracking-tight text-foreground transition-smooth group-hover/title:text-accent">
                {product.name}
              </h3>
            </Link>
            <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-muted-foreground">
              {product.description}
            </p>
            {product.tags?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {product.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <p className="shrink-0 text-base font-black text-foreground">
            ${Number(product.price).toLocaleString()}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-border/70 pt-4">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-extrabold transition-smooth ${
              isOutOfStock
                ? 'border border-white/10 bg-white/[0.06] text-muted-foreground opacity-70'
                : added
                ? 'bg-emerald-400/[0.12] text-emerald-300'
                : 'bg-primary text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/90'
            }`}
          >
            <ShoppingCartIcon className="h-4 w-4" />
            {isOutOfStock ? 'Sold out' : added ? 'Added' : 'Add'}
          </button>
          <Link href={productHref} className="icon-button" aria-label={`View ${product.name}`}>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
      </article>
      <ProductQuickView product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
    </>
  );
}
