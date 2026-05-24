'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import SectionDivider from '@/components/SectionDivider';
import { CheckCircleIcon, ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ProductDetailPage({ params }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const slug = params.slug;
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { default: api } = await import('@/lib/api');
        const response = await api.get('/products');
        const match = response.data.products?.find((item) => item.slug === slug);
        setProduct(match || null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/40 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link href="/products" className="text-teal-600 hover:text-teal-800 font-medium bg-teal-50 px-6 py-2 rounded-full transition-colors">Return to Catalog</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden theme-ocean">
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-bl from-teal-100 to-cyan-100 rounded-[100%] blur-3xl opacity-50 pointer-events-none -z-10 translate-x-1/4 -translate-y-1/4"></div>

      <div className="max-w-6xl mx-auto reveal">
        <SectionDivider variant="ocean" />
        <Link href="/products" className="inline-flex items-center text-gray-500 hover:text-teal-600 font-medium mb-8 transition-colors group">
          <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </Link>

        <div className="glass-card rounded-[2.5rem] shadow-2xl shadow-teal-500/10 border border-white/70 p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative group flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl border border-gray-100/50 aspect-square">
              <div className="absolute inset-0 bg-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl"></div>
              <Image
                src={product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/600x600'}
                alt={product.name}
                width={500}
                height={500}
                className="object-contain w-full h-full drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
            <div className="flex flex-col justify-center h-full">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="label label-emerald">In Stock</span>
                {product.tags && product.tags.map(tag => (
                  <span key={tag} className="label">{tag}</span>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600">
                {product.name}
              </h1>

              <p className="text-2xl font-medium text-teal-600 mb-6">${product.price.toLocaleString()}</p>

              <div className="space-y-4 mb-10">
                <p className="text-lg text-gray-700 font-medium leading-relaxed">{product.description}</p>
                <p className="text-gray-500 leading-relaxed max-w-lg">{product.details || product.description}</p>
              </div>

              <div className="pt-8 border-t border-gray-200/60 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`w-full sm:w-auto min-w-[200px] flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl ${added
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25 scale-[0.98]'
                    : 'text-white hover:scale-105 hover:shadow-teal-500/25'
                    }`}
                  style={!added ? { background: 'linear-gradient(135deg, #0f172a 0%, #0ea5a4 100%)' } : undefined}
                >
                  {added ? (
                    <>
                      <CheckCircleIcon className="w-6 h-6 mr-2" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-6 h-6 mr-2" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
