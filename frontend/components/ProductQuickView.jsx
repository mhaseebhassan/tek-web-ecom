'use client';

import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { getAvailability, getProductImage } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { XMarkIcon, ShoppingCartIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function ProductQuickView({ product, isOpen, onClose }) {
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const productHref = `/products/${product.slug}`;
  const { isOutOfStock, label: stockLabel, className: stockClass } = getAvailability(product);

  const handleAdd = async () => {
    if (isOutOfStock) return;
    await addToCart(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-8">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close quick view"
      />
      <div className="surface-panel relative z-10 grid max-h-[92vh] w-full max-w-5xl overflow-y-auto p-4 md:grid-cols-[0.95fr_1.05fr] md:p-6">
        <button type="button" onClick={onClose} className="icon-button absolute right-4 top-4 z-20" aria-label="Close quick view">
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="relative min-h-[360px] overflow-hidden rounded-[1.5rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.13),rgba(255,255,255,0.04)_46%,rgba(250,197,100,0.09))] p-8">
          <div className="aurora-sheen opacity-55" />
          <SafeImage
            src={getProductImage(product)}
            alt={product.name}
            fill
            className="object-contain p-10 drop-shadow-[0_30px_42px_rgb(0_0_0/0.48)]"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>

        <div className="flex flex-col justify-center px-2 py-6 md:px-8">
          <div className="mb-4 flex flex-wrap gap-2">
            {product.category && <span className="label label-primary">{product.category}</span>}
            <span className={`label ${stockClass}`}>{stockLabel}</span>
            {product.brand && <span className="label label-accent">{product.brand}</span>}
          </div>
          <h2 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">{product.name}</h2>
          <p className="mt-4 text-3xl font-black tracking-tight text-foreground">${Number(product.price).toLocaleString()}</p>
          <p className="mt-5 text-base font-medium leading-8 text-muted-foreground">{product.description}</p>
          {product.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={handleAdd} disabled={isOutOfStock} className={isOutOfStock ? 'btn-outline opacity-60' : 'btn-primary'}>
              <ShoppingCartIcon className="h-5 w-5" />
              {isOutOfStock ? 'Out of stock' : 'Add to cart'}
            </button>
            <Link href={productHref} onClick={onClose} className="btn-outline">
              View details
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
