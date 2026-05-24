'use client';

import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  ShoppingCartIcon,
  ArrowLeftIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { getAvailability, getProductImage, loadProductBySlug } from '@/lib/products';
import ProductDetailSkeleton from '@/components/ui/ProductDetailSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { CubeIcon } from '@heroicons/react/24/outline';

const promiseItems = [
  { title: 'Fast shipping', value: 'Free over $500', icon: TruckIcon },
  { title: 'Warranty', value: '1-year coverage', icon: ShieldCheckIcon },
  { title: 'Payment', value: 'Secure checkout', icon: CreditCardIcon },
];

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const slug = params?.slug;

  useEffect(() => {
    if (!slug) return;
    loadProductBySlug(slug).then((data) => {
      setProduct(data);
      setSelectedImage(data ? getProductImage(data) : '');
      setIsLoading(false);
    });
  }, [slug]);

  if (isLoading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="page-shell flex min-h-[50vh] items-center justify-center">
        <EmptyState
          icon={CubeIcon}
          title="Product not found"
          description="This item may have been removed from the catalog."
          actionLabel="Back to catalog"
          actionHref="/products"
        />
      </div>
    );
  }

  const { isOutOfStock, label: stockLabel, className: stockClass } = getAvailability(product);
  const galleryImages = [...new Set([...(product.images || []), product.image].filter(Boolean).map((image) => getProductImage({ image })))];
  const specs = [
    ['Category', product.category],
    ['Brand', product.brand],
    ['Price', `$${Number(product.price).toLocaleString()}`],
    ['Availability', stockLabel],
    ...(product.tags || []).slice(0, 4).map((tag, index) => [`Highlight ${index + 1}`, tag]),
  ].filter(([, value]) => value);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="page-shell animate-page-in">
      <Link href="/products" className="mb-8 inline-flex items-center text-sm font-bold text-muted-foreground transition-smooth hover:text-foreground">
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back to catalog
      </Link>

      <div className="surface-panel overflow-hidden p-4 md:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="space-y-4">
            <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[1.6rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.13),rgba(255,255,255,0.04)_46%,rgba(250,197,100,0.09))] p-8 md:min-h-[560px]">
              <div className="aurora-sheen opacity-60" />
              <SafeImage
                src={selectedImage || getProductImage(product)}
                alt={product.name}
                width={680}
                height={680}
                className="float-soft relative z-10 max-h-[480px] w-full object-contain drop-shadow-[0_32px_44px_rgb(0_0_0/0.5)] transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
            {galleryImages.length > 0 && (
              <div className="flex gap-3 overflow-x-auto">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-[1rem] border bg-white/[0.06] p-2 transition-smooth ${
                      (selectedImage || getProductImage(product)) === image ? 'border-primary/60' : 'border-white/10 hover:border-primary/35'
                    }`}
                    aria-label={`View ${product.name} image ${index + 1}`}
                  >
                    <SafeImage src={image} alt="" fill className="object-contain p-2" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex h-full flex-col justify-center">
              <div className="mb-5 flex flex-wrap gap-2">
                {product.category && <span className="label label-primary">{product.category}</span>}
                <span className={`label ${stockClass}`}>{stockLabel}</span>
                {product.brand && <span className="label label-emerald">{product.brand}</span>}
              </div>

              <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl lg:text-6xl">
                {product.name}
              </h1>

              <p className="mt-6 text-4xl font-black tracking-tight text-foreground">
                ${Number(product.price).toLocaleString()}
              </p>

              <p className="mt-6 max-w-xl text-base font-medium leading-8 text-muted-foreground md:text-lg">
                {product.description}
              </p>

              {product.details && (
                <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-muted-foreground">
                  {product.details}
                </p>
              )}

              {product.tags?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="label label-accent">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {promiseItems.map(({ title, value, icon: Icon }) => (
                  <div key={title} className="surface-muted p-4">
                    <Icon className="h-5 w-5 text-secondary" />
                    <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-foreground">{title}</p>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={added || isOutOfStock}
                  className={`min-w-[220px] ${
                    isOutOfStock
                      ? 'btn-outline opacity-60'
                      : added
                        ? 'btn-outline border-emerald-400/25 bg-emerald-400/[0.12] text-emerald-300'
                        : 'btn-primary'
                  }`}
                >
                  {isOutOfStock ? <ExclamationTriangleIcon className="h-5 w-5" /> : added ? <CheckCircleIcon className="h-5 w-5" /> : <ShoppingCartIcon className="h-5 w-5" />}
                  {isOutOfStock ? 'Out of stock' : added ? 'Added to cart' : 'Add to cart'}
                </button>
                <Link href="/checkout" className="btn-secondary">
                  Checkout
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-border/70 pt-5 text-sm font-semibold text-muted-foreground">
                {product.brand && <span>Brand: {product.brand}</span>}
              </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="surface-card p-6 md:p-8">
          <h2 className="text-2xl font-black tracking-tight text-foreground">Product details</h2>
          <p className="mt-4 text-sm font-medium leading-7 text-muted-foreground">
            {product.details || product.description}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {['Compatible with Apple ecosystem', 'Ships in protective packaging', 'Eligible for standard warranty', 'Demo checkout supported'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/[0.055] p-3 text-sm font-semibold text-muted-foreground">
                <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-300" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card overflow-hidden p-6 md:p-8">
          <h2 className="text-2xl font-black tracking-tight text-foreground">Specs</h2>
          <div className="mt-6 divide-y divide-white/10">
            {specs.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[0.8fr_1.2fr] gap-4 py-3 text-sm">
                <span className="font-bold text-muted-foreground">{label}</span>
                <span className="font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
