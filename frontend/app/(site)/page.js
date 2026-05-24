'use client';

import Link from 'next/link'
import Image from 'next/image'
import { TruckIcon, ShieldCheckIcon, CurrencyDollarIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import HeroSlideshow from '@/components/HeroSlideshow'
import SectionDivider from '@/components/SectionDivider'
import { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'


// Reusable ProductCard matching the catalog page
export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group glass-card rounded-[2.5rem] overflow-hidden shadow-xl shadow-teal-500/5 hover:shadow-2xl hover:shadow-teal-500/15 hover:-translate-y-2 transition-smooth flex flex-col h-full relative border border-white/20"
    >
      <div className="relative flex items-center justify-center bg-gradient-to-br from-white to-slate-50/50 h-56 p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        {/* Geometric Corner Accents */}
        <div className="absolute top-0 left-0 w-12 h-12 bg-teal-500/5 rounded-br-[2rem] -translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 bg-cyan-500/5 rounded-tl-[2rem] translate-x-full translate-y-full group-hover:-translate-x-0 group-hover:-translate-y-0 transition-transform duration-500"></div>
        
        <Image
          src={product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/600x600'}
          alt={product.name}
          width={200}
          height={200}
          className="object-contain max-h-40 w-auto h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)] group-hover:scale-110 group-hover:rotate-2 transition-all duration-700 ease-out"
        />
      </div>

      <div className="p-6 flex flex-col flex-grow bg-white/50 backdrop-blur-sm relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-black text-gray-900 group-hover:text-teal-700 transition-colors">{product.name}</h3>
          <span className="label label-teal">{product.category}</span>
        </div>
        <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">{product.description}</p>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-amber-100/60">
          <span className="text-xl font-black text-slate-900">
            ${product.price.toLocaleString()}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              title="Add to Cart"
              disabled={added}
              className={`p-2.5 rounded-xl transition-colors shadow-md flex items-center justify-center ${added ? 'bg-emerald-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-teal-600 hover:text-white'
                }`}
            >
              <ShoppingCartIcon className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl group-hover:bg-teal-600 transition-colors shadow-md flex items-center">
              View
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { default: api } = await import('@/lib/api');
        const response = await api.get('/products');
        setProducts(response.data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <main className="min-h-screen">
      {/* Hero Section with Slideshow */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 -bottom-14 h-36 bg-gradient-to-b from-transparent via-sky-300/35 to-transparent"></div>
        <HeroSlideshow />
      </div>

      {/* Featured Products Section */}
      <SectionDivider variant="ocean" />
      <section className="py-12 sm:py-24 relative overflow-hidden reveal theme-ocean">
        {/* Decorative Blur Background Element */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-teal-100/40 to-cyan-100/40 rounded-[100%] blur-3xl opacity-50 pointer-events-none -translate-y-1/2 -translate-x-1/2 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 reveal reveal-delay-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-4">
              Featured Collections
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Explore our hand-picked selection of premium devices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="glass-card rounded-[2.5rem] p-4 space-y-4 animate-pulse">
                    <div className="aspect-[4/5] bg-slate-200/50 rounded-2xl shimmer"></div>
                    <div className="h-6 bg-slate-200/50 rounded w-3/4 shimmer"></div>
                    <div className="h-4 bg-slate-200/50 rounded w-1/2 shimmer"></div>
                  </div>
                </div>
              ))
            ) : (
              featuredProducts.map((product, idx) => (
                <div key={product.id} className={`reveal reveal-delay-${(idx % 4) + 1}`}>
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <SectionDivider variant="midnight" />
      <section className="py-20 relative overflow-hidden reveal theme-midnight">
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.25),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(250,204,21,0.2),transparent_55%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center glass-card rounded-3xl p-8 hover:shadow-2xl hover:shadow-teal-500/15 transition-all group cursor-default reveal reveal-delay-1">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/20 transform group-hover:rotate-12 transition-transform">
                <TruckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900">Free Priority Shipping</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Complimentary expedited shipping on all domestic orders over $500.</p>
            </div>

            <div className="text-center glass-card rounded-3xl p-8 hover:shadow-2xl hover:shadow-teal-500/15 transition-all group cursor-default reveal reveal-delay-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20 transform group-hover:-rotate-12 transition-transform">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900">Secure Transactions</h3>
              <p className="text-slate-600 text-sm leading-relaxed">State-of-the-art 256-bit encryption ensuring your payments are totally secure.</p>
            </div>

            <div className="text-center glass-card rounded-3xl p-8 hover:shadow-2xl hover:shadow-teal-500/15 transition-all group cursor-default reveal reveal-delay-3">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/20 transform group-hover:rotate-12 transition-transform">
                <CurrencyDollarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900">30-Day Returns</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Not perfectly satisfied? Return it within 30 days for a full, no-questions refund.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <SectionDivider variant="sunset" />
      <section className="py-24 relative overflow-hidden reveal theme-sunset">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-teal-100/50 to-amber-100/50 rounded-[100%] blur-3xl opacity-70 pointer-events-none translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Join the Inner Circle</h2>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            Subscribe to our newsletter for early access to the newest products, exclusive member offers, and tech insights.
          </p>
          <form className="max-w-md mx-auto relative flex items-center">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="w-full pl-6 pr-32 py-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-6 bg-gray-900 text-white rounded-full font-bold text-sm tracking-wide hover:bg-teal-600 transition-colors shadow-md"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
