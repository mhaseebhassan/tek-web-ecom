'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/context/CartContext'

export default function ProductCard({ product }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [glint, setGlint] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)
  const { addToCart } = useCart()

  const onMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const xc = rect.width / 2
    const yc = rect.height / 2
    const dx = x - xc
    const dy = y - yc
    
    setRotate({ x: dy / 10, y: -dx / 10 })
    setGlint({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 })
  }

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 })
  }

  const handleAddToCart = (e) => {
    e.preventDefault() // Prevent navigation when clicking the button inside the Link
    addToCart(product)
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '16px',
        fontWeight: '800',
        fontSize: '13px',
        letterSpacing: '-0.01em',
      }
    })
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: rotate.x === 0 ? 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
      }}
      className="group relative glass-card rounded-[2.5rem] overflow-hidden border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_32px_64px_rgba(0,0,0,0.12)] block"
    >
      {/* Holographic Border Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20">
        <div className="absolute inset-[-1px] rounded-[2.5rem] border-2 border-transparent bg-gradient-to-tr from-teal-400/50 via-cyan-300/50 to-emerald-400/50 [mask-image:linear-gradient(white,white)_padding-box,linear-gradient(white,white)] [mask-composite:exclude]" />
      </div>

      {/* Glint Effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-40 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${glint.x}% ${glint.y}%, rgba(255,255,255,0.8) 0%, transparent 60%)`
        }}
      />

      <div className="relative aspect-[4/5] overflow-hidden bg-white">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-8 transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Category Badge */}
        <div className="absolute top-6 left-6 z-20">
          <span className="px-4 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-8 relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">In Stock</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-teal-700 transition-colors tracking-tight">
          {product.name}
        </h3>
        <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Price</span>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">${product.price}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="h-14 w-14 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/10 hover:bg-teal-600 hover:shadow-teal-600/30 transition-all active:scale-90 group/btn"
            title="Add to cart"
          >
            <ShoppingCartIcon className="h-6 w-6 mx-auto transform group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </Link>
  )
}
