'use client';

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductGridSkeleton from '@/components/ui/ProductGridSkeleton';
import SafeImage from '@/components/SafeImage';
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { getProductImage, loadCatalogProducts } from '@/lib/products';

const serviceItems = [
  {
    title: 'Clear product pages',
    description: 'Specs, prices, and product notes are written so you can compare items without decoding sales copy.',
    icon: ShieldCheckIcon,
  },
  {
    title: 'Order updates',
    description: 'Checkout stays simple, and signed-in customers can come back to see what they ordered and where it stands.',
    icon: TruckIcon,
  },
  {
    title: 'Protected checkout',
    description: 'Account, cart, and order data move through a secured API instead of loose form submissions.',
    icon: CreditCardIcon,
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [previousHeroIndex, setPreviousHeroIndex] = useState(0);

  useEffect(() => {
    loadCatalogProducts().then((data) => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const displayProducts = featured.length >= 4 ? featured : products.slice(0, 4);
  const showcaseProducts = products.length > 0 ? products : displayProducts;
  const heroProduct = showcaseProducts.length > 0 ? showcaseProducts[heroIndex % showcaseProducts.length] : null;
  const sideProducts = showcaseProducts.length > 1
    ? [1, 2].map((offset) => showcaseProducts[(heroIndex + offset) % showcaseProducts.length]).filter(Boolean)
    : [];

  useEffect(() => {
    if (showcaseProducts.length <= 1) return undefined;
    const interval = window.setInterval(() => {
      setHeroIndex((current) => {
        setPreviousHeroIndex(current);
        return (current + 1) % showcaseProducts.length;
      });
    }, 4200);

    return () => window.clearInterval(interval);
  }, [showcaseProducts.length]);

  const getShowcaseSet = (index) => {
    if (showcaseProducts.length === 0) return null;
    const slotCount = Math.min(4, showcaseProducts.length);
    const uniqueProducts = Array.from({ length: slotCount }, (_, offset) => (
      showcaseProducts[(index + offset) % showcaseProducts.length]
    ));

    return {
      hero: uniqueProducts[0],
      side: uniqueProducts.slice(1),
    };
  };

  const currentShowcase = getShowcaseSet(heroIndex);
  const previousShowcase = previousHeroIndex !== heroIndex ? getShowcaseSet(previousHeroIndex) : null;

  const renderShowcase = (showcase, isActive) => {
    if (!showcase?.hero) return null;
    const hero = showcase.hero;

    return (
      <div
        className={`absolute inset-0 grid h-full gap-4 transition-opacity duration-[1400ms] ease-in-out sm:grid-cols-[1.2fr_0.8fr] ${
          isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <Link href={`/products/${hero.slug}`} className="group relative flex min-h-[480px] items-center justify-center overflow-hidden rounded-[1.6rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.13),rgba(255,255,255,0.04)_46%,rgba(250,197,100,0.09))] p-8">
          <SafeImage
            src={getProductImage(hero)}
            alt={hero.name}
            width={620}
            height={620}
            className="float-soft max-h-[380px] w-full object-contain drop-shadow-[0_30px_42px_rgb(0_0_0/0.48)] transition-transform duration-700 group-hover:scale-105"
            priority={isActive}
          />
          <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-border/70 bg-card/[0.88] p-4 shadow-[var(--shadow-tight)] backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">Featured</p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-foreground">{hero.name}</h2>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">${Number(hero.price).toLocaleString()}</p>
          </div>
        </Link>

        <div className="grid gap-4">
          {showcase.side.map((product) => (
            <Link
              key={product.id || product.slug}
              href={`/products/${product.slug}`}
              className="group surface-muted flex items-center gap-4 p-4 transition-smooth hover:-translate-y-1 hover:border-primary/25 hover:bg-white/[0.08]"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.2rem] bg-white/[0.07]">
                <SafeImage
                  src={getProductImage(product)}
                  alt={product.name}
                  fill
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                  sizes="96px"
                />
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-black text-foreground">{product.name}</p>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">${Number(product.price).toLocaleString()}</p>
              </div>
            </Link>
          ))}

        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen">
      <section className="page-shell pb-14 pt-12 md:pb-20 md:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div className="animate-fade-up">
            <h1 className="text-6xl font-black tracking-tight text-foreground sm:text-7xl lg:text-8xl">
              Tekron
            </h1>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="btn-primary">
                Shop catalog
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="/about" className="btn-outline">
                Why Tekron
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-border/70 pt-6">
              {[
                { label: 'Catalog', value: products.length || '8+' },
                { label: 'Checkout', value: 'Secure' },
                { label: 'Delivery', value: 'Tracked' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-black tracking-tight text-foreground">{stat.value}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel relative min-h-[520px] overflow-hidden p-4 animate-fade-up stagger-2">
            <div className="aurora-sheen" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-secondary/[0.14] to-transparent" />
            {heroProduct ? (
              <div className="relative h-[640px] sm:h-[520px]">
                {renderShowcase(previousShowcase, false)}
                {renderShowcase(currentShowcase, true)}
              </div>
            ) : (
              <div className="flex h-[520px] items-center justify-center rounded-lg bg-muted/40 text-sm font-semibold text-muted-foreground">
                Loading the catalog
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="section-title">Featured products</h2>
            <p className="section-copy mt-3 max-w-2xl">A short list of the products most people check first, with enough detail to make the next click useful.</p>
          </div>
          <Link href="/products" className="btn-outline w-fit">
            View all products
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {displayProducts.map((product, idx) => (
              <ProductCard key={product.id || product.slug} product={product} index={idx} />
            ))}
          </div>
        )}
      </section>

      <section className="page-shell pt-0">
        <div className="grid gap-5 md:grid-cols-3">
          {serviceItems.map(({ title, description, icon: Icon }) => (
            <div key={title} className="surface-card p-6">
              <div className="mb-6 grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-foreground">{title}</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell pt-0">
        <div className="surface-panel grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <h2 className="section-title">Find the right tech without the guesswork.</h2>
            <p className="section-copy mt-3">Browse clear specs, current prices, and featured picks built for quick comparison.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[360px] sm:flex-row">
            <Link href="/products" className="btn-secondary whitespace-nowrap">
              Explore products
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link href="/about" className="btn-outline whitespace-nowrap">
              About Tekron
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
