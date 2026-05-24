'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { TrashIcon, PlusIcon, MinusIcon, ArrowRightIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import SectionDivider from '@/components/SectionDivider';

export default function CartPage() {
  const { cart, total, removeFromCart, updateQuantity } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 relative overflow-hidden bg-gray-50/50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-100/40 to-teal-100/40 rounded-full blur-3xl -z-10"></div>
        <div className="glass-card p-12 rounded-[2.5rem] shadow-2xl shadow-teal-500/10 text-center max-w-lg w-full">
          <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShoppingBagIcon className="w-12 h-12 text-teal-400" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added any gear yet. Discover our premium collection.</p>
          <Link
            href="/products"
            className="btn-primary w-full sm:w-auto px-8 py-4 text-sm font-bold group"
          >
            Start Shopping
            <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 relative overflow-hidden theme-sunset">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-cyan-100/50 to-teal-100/30 rounded-full blur-3xl opacity-60 pointer-events-none -z-10 -translate-y-1/4 translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-10">
          Shopping Cart
        </h1>
        <SectionDivider variant="sunset" />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col sm:flex-row items-center gap-6 p-6 glass-panel rounded-3xl shadow-lg shadow-teal-500/10 hover:shadow-xl hover:shadow-teal-500/20 transition-all reveal"
              >
                {/* Product Image */}
                <div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-2 border border-gray-100/50 flex items-center justify-center group-hover:bg-teal-50/30 transition-colors">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="object-contain w-auto h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Product Details & Controls */}
                <div className="flex-1 flex flex-col sm:flex-row justify-between w-full h-full">
                  <div className="flex flex-col justify-center mb-4 sm:mb-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">{item.name}</h3>
                    <p className="text-lg font-bold text-gray-500">${item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end sm:gap-8">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-inner h-12">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-full flex items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-teal-600 hover:shadow-sm transition-all"
                      >
                        <MinusIcon className="w-4 h-4 font-bold" />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-full flex items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:text-teal-600 hover:shadow-sm transition-all"
                      >
                        <PlusIcon className="w-4 h-4 font-bold" />
                      </button>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Remove Item"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-1/3">
            <div className="glass-card p-8 rounded-[2.5rem] shadow-2xl shadow-teal-500/10 sticky top-28">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-8 text-gray-600">
                <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center bg-emerald-50/50 p-3 rounded-xl text-emerald-700">
                  <span className="font-medium">Shipping</span>
                  <span className="font-bold uppercase tracking-wider text-xs px-2 py-1 bg-emerald-100 rounded-md">Free</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl">
                  <span className="font-medium">Estimated Tax</span>
                  <span className="font-bold text-gray-900">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-200/60 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-medium text-gray-600">Total</span>
                  <span className="text-4xl font-black text-gray-900">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-primary w-full py-4 text-lg font-bold"
              >
                Proceed to Checkout
              </Link>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure 256-bit Encrypted Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
