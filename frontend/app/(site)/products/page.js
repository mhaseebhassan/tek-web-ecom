'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import SectionDivider from '@/components/SectionDivider';


function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to the product page when clicking the button
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group glass-card rounded-[2rem] overflow-hidden shadow-xl shadow-teal-500/10 hover:shadow-2xl hover:shadow-teal-500/20 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Image Container */}
      <div className="relative flex items-center justify-center bg-gradient-to-br from-white to-amber-50/60 h-56 p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <Image
          src={product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/600x600'}
          alt={product.name}
          width={200}
          height={200}
          className="object-contain max-h-48 w-auto h-auto drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Product Info */}
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

export default function ProductsPage() {
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

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 relative overflow-hidden theme-ocean">
      {/* Decorative Blur Background Element */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[600px] bg-gradient-to-bl from-teal-100/60 to-amber-100/60 rounded-[100%] blur-3xl opacity-50 pointer-events-none -z-10 -translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 reveal">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-4">
            Our Catalog
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Discover the latest technology curated for peak performance and elegant design.
          </p>
        </div>

        <SectionDivider variant="ocean" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center text-gray-500">Loading products...</div>
          ) : (
            products.map((product) => (
              <div key={product._id || product.id} className="reveal reveal-delay-2">
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
