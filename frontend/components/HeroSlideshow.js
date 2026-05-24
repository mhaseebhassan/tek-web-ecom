'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const slides = [
  {
    id: 1,
    title: "MacBook Pro",
    description: "Ultimate performance for professionals. Power your creativity with the new MacBook Pro.",
    image: "/MacBook Pro.png",
    cta: "Shop MacBook Pro",
    slug: "macbook-pro-14",
    color: "from-teal-600/25",
    accent: "text-teal-400",
    tag: "New 2024"
  },
  {
    id: 2,
    title: "iPhone 16 Pro",
    description: "Pro camera system and display. Experience the next generation of iPhone.",
    image: "/iPhone 16 Pro.png",
    cta: "Shop iPhone 16 Pro",
    slug: "iphone-16-pro",
    color: "from-blue-600/25",
    accent: "text-blue-400",
    tag: "Just Released"
  },
  {
    id: 3,
    title: "Apple Watch Ultra 2",
    description: "Rugged and capable for adventure. The most advanced Apple Watch yet.",
    image: "/Apple Watch Ultra 2.png",
    cta: "Shop Watch Ultra 2",
    slug: "apple-watch-ultra-2",
    color: "from-amber-600/25",
    accent: "text-amber-400",
    tag: "Best Seller"
  },
]

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let prog = 0
    setProgress(0)

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    const progressTimer = setInterval(() => {
      prog = Math.min(prog + 1.67, 100)
      setProgress(prog)
    }, 100)

    return () => {
      clearInterval(timer)
      clearInterval(progressTimer)
    }
  }, [currentSlide])

  const slide = slides[currentSlide]

  return (
    <section className="relative h-[580px] md:h-[620px] flex items-center justify-center overflow-hidden" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #0d1a2e 0%, #06081a 50%, #030509 100%)' }}>
      {/* Premium Background Layers */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Fixed premium teal orb — always present, gives depth */}
        <div className="absolute top-[-30%] left-[-15%] w-[65%] h-[65%] rounded-full blur-[160px]" style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.18) 0%, transparent 70%)' }} />
        {/* Fixed indigo counterbalance — bottom right */}
        <div className="absolute bottom-[-25%] right-[-10%] w-[55%] h-[55%] rounded-full blur-[160px]" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />
        {/* Slide-specific subtle accent — very muted */}
        <div
          className={`absolute top-[10%] right-[5%] w-[40%] h-[40%] rounded-full blur-[120px] transition-all duration-2000 ${slide.color} to-transparent opacity-40`}
          style={{ background: undefined }}
        />
        {/* Center vignette for depth */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 40%, rgba(3,5,9,0.5) 100%)' }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025] geometric-pattern" />
      </div>

      {/* Main layout — two fixed-width columns, vertically centered, locked in place */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 h-full flex items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* LEFT — Text column: fixed min-height to prevent layout shift */}
          <div className="relative min-h-[260px] md:min-h-[320px]">
            {slides.map((s, idx) => (
              <div
                key={s.id}
                className={`absolute inset-0 flex flex-col justify-center text-center md:text-left transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  idx === currentSlide
                    ? 'opacity-100 translate-x-0 pointer-events-auto'
                    : 'opacity-0 -translate-x-10 pointer-events-none'
                }`}
              >
                {/* Tag pill */}
                <div className="flex justify-center md:justify-start mb-5">
                  <span className={`px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] ${s.accent}`}>
                    {s.tag}
                  </span>
                </div>

                {/* Product name */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[0.9] mb-5">
                  {s.title}
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg text-slate-400 font-medium max-w-md leading-relaxed mb-10">
                  {s.description}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <Link
                    href={`/products/${s.slug}`}
                    className="inline-flex items-center px-8 py-4 bg-white text-black rounded-2xl font-black hover:bg-teal-50 hover:scale-[1.02] transition-all duration-300 text-sm uppercase tracking-widest group shadow-[0_20px_40px_rgba(255,255,255,0.08)] active:scale-95"
                  >
                    Explore Now
                    <ArrowRightIcon className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — Image column: fixed-size frame, slides crossfade inside */}
          <div className="flex justify-center md:justify-end">
            {/* Outer container / frame — always the same size */}
            <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px] lg:w-[460px] lg:h-[460px]">
              {/* Glass frame card */}
              <div className="absolute inset-0 rounded-[3rem] bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.4)]">
                {/* Corner accents */}
                <div className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-white/20 rounded-tl-xl" />
                <div className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-white/20 rounded-tr-xl" />
                <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-white/20 rounded-bl-xl" />
                <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-white/20 rounded-br-xl" />
              </div>

              {/* Slides crossfade inside the frame */}
              {slides.map((s, idx) => (
                <div
                  key={s.id}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    idx === currentSlide
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95'
                  }`}
                >
                  {/* Per-slide glow behind image */}
                  <div className={`absolute inset-8 bg-gradient-to-br ${s.color} to-transparent rounded-full blur-2xl opacity-80`} />
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="relative z-10 object-contain p-10 drop-shadow-[0_32px_64px_rgba(0,0,0,0.9)]"
                    priority={idx === 0}
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, (max-width: 1024px) 400px, 460px"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Progress indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group py-3 px-1"
          >
            <div className="relative w-10 h-[3px] bg-white/15 rounded-full overflow-hidden transition-all duration-300 group-hover:bg-white/25">
              {index === currentSlide && (
                <div
                  className="absolute inset-y-0 left-0 bg-white rounded-full"
                  style={{ width: `${progress}%` }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
