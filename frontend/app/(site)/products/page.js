'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CubeIcon } from '@heroicons/react/24/outline';
import PageShell from '@/components/PageShell';
import ProductCard from '@/components/ProductCard';
import SafeImage from '@/components/SafeImage';
import CatalogToolbar from '@/components/CatalogToolbar';
import ProductGridSkeleton from '@/components/ui/ProductGridSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { getProductImage, loadCatalogProducts } from '@/lib/products';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const initialCategory = new URLSearchParams(window.location.search).get('category');
    if (initialCategory) setCategory(initialCategory);
  }, []);

  useEffect(() => {
    loadCatalogProducts().then((data) => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products]
  );

  const categoryTiles = useMemo(
    () =>
      categories.map((cat) => {
        const items = products.filter((product) => product.category === cat);
        const featured = items.find((product) => product.isFeatured) || items[0];
        return {
          name: cat,
          count: items.length,
          product: featured,
        };
      }),
    [categories, products]
  );

  const filtered = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    if (category) {
      list = list.filter((p) => p.category === category);
    }

    switch (sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return list;
  }, [products, search, category, sort]);

  return (
    <PageShell
      title="Catalog"
      subtitle="Search the full product list, filter by category, and compare the details that matter before you add anything to cart."
    >
      {!isLoading && categoryTiles.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-foreground">Shop by category</h2>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Start with the product family you have in mind.</p>
            </div>
            {category && (
              <button type="button" onClick={() => setCategory('')} className="btn-ghost hidden sm:inline-flex">
                Clear category
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
            {categoryTiles.map((tile) => (
              <button
                key={tile.name}
                type="button"
                onClick={() => setCategory(tile.name)}
                className={`surface-card group relative min-h-[190px] overflow-hidden p-4 text-left transition-smooth hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-soft)] ${
                  category === tile.name ? 'border-primary/45 bg-white/[0.08]' : ''
                }`}
              >
                <div className="aurora-sheen opacity-35" />
                {tile.product && (
                  <SafeImage
                    src={getProductImage(tile.product)}
                    alt={tile.product.name}
                    fill
                    className="object-contain object-right-bottom p-4 pl-20 pt-16 opacity-75 drop-shadow-[0_18px_26px_rgb(0_0_0/0.38)] transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                )}
                <div className="relative z-10">
                  <span className={`label ${category === tile.name ? 'label-emerald' : 'label-primary'}`}>
                    {tile.count} item{tile.count === 1 ? '' : 's'}
                  </span>
                  <h3 className="mt-3 text-lg font-black tracking-tight text-foreground">{tile.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <CatalogToolbar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        sort={sort}
        onSortChange={setSort}
        resultCount={filtered.length}
      />

      {isLoading ? (
        <ProductGridSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CubeIcon}
          title="No products found"
          description="Try a different search, remove filters, or return to the full catalog."
          actionLabel="Clear filters"
          onAction={() => {
            setSearch('');
            setCategory('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, idx) => (
            <ProductCard key={product.id || product._id || product.slug} product={product} index={idx} />
          ))}
        </div>
      )}

      <ScrollReveal delay={300}>
        <p className="mt-12 text-center text-sm font-medium text-muted-foreground">
          Not sure which device fits?{' '}
          <Link href="/contact" className="font-bold text-accent hover:underline">
            Ask us
          </Link>
        </p>
      </ScrollReveal>
    </PageShell>
  );
}
