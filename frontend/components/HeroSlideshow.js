'use client';

import { useState, useEffect } from 'react';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'MacBook Pro',
    overlayText: 'Pro camera',
    subtitle: 'M3 Max',
    description: 'Own the next-generation laptop engineered for your ultimate workflow and boundless creativity.',
    image: '/MacBook Pro.png',
    slug: 'macbook-pro',
  },
  {
    id: 2,
    title: 'iPhone 16 Pro',
    overlayText: 'Titanium',
    subtitle: 'Pro System',
    description: 'A titanium iPhone with A18 Pro, Camera Control, and a 5x Telephoto camera.',
    image: '/iPhone 16 Pro.png',
    slug: 'iphone-16-pro',
  },
  {
    id: 3,
    title: 'Apple Watch',
    overlayText: 'Ultra 2',
    subtitle: 'Rugged',
    description: 'Push your limits. The most capable and rugged Apple Watch designed for extreme adventure.',
    image: '/Apple Watch Ultra 2.png',
    slug: 'apple-watch-ultra-2',
  },
];

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="px-4 pt-20 pb-4 w-full h-[100dvh] min-h-[500px] max-w-[1600px] mx-auto flex flex-col justify-center">
      {/* Massive Dark Floating Container - Fills remaining height perfectly */}
      <div className="relative w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_rgba(50,130,184,0.15)_0%,_rgba(10,10,12,1)_70%)] bg-[#0a0a0c]">
        
        {slides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Giant Background Typography */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 pointer-events-none">
              <h1 className="text-[18vw] font-black text-white/[0.04] whitespace-nowrap select-none tracking-tighter">
                {s.title.toUpperCase()}
              </h1>
            </div>

            {/* Centered Product Image */}
            <div className={`absolute inset-0 flex items-center justify-center z-20 transition-transform duration-[2000ms] ease-out ${
              idx === currentSlide ? 'scale-100' : 'scale-95'
            }`}>
              <div className="relative w-[70%] max-h-[80%] max-w-[500px] aspect-square">
                <SafeImage
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-contain"
                  priority={idx === 0}
                  sizes="(max-width: 768px) 400px, 600px"
                />
              </div>
            </div>

            {/* Vibrant Stylized Overlay Text */}
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <h2 className={`text-[12vw] md:text-8xl lg:text-[9rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-accent to-primary opacity-90 rotate-[-3deg] transition-all duration-[1500ms] ease-out ${
                idx === currentSlide ? 'translate-y-8 md:translate-y-12 scale-100' : 'translate-y-16 md:translate-y-24 scale-90'
              }`}>
                {s.overlayText}
              </h2>
            </div>

            {/* Bottom Left Info */}
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-30 max-w-xs md:max-w-sm">
              <h3 className="text-white font-black tracking-[0.2em] uppercase text-[10px] md:text-xs mb-1 md:mb-2">
                Limited Release
              </h3>
              <p className="text-white/70 text-xs leading-relaxed font-medium hidden sm:block">
                {s.description}
              </p>
            </div>

            {/* Bottom Right Glass Card */}
            <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-30 hidden md:block">
              <div className="bg-white/[0.05] border border-white/10 p-4 rounded-2xl w-56 shadow-xl transition-colors hover:bg-white/[0.08]">
                <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-1.5">
                  Exclusive Access
                </h4>
                <p className="text-white/60 text-[10px] mb-3 leading-relaxed">
                  Pre-order now and unlock exclusive pricing this month.
                </p>
                <Link href={`/products/${s.slug}`} className="flex items-center justify-between text-white/90 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest group">
                  <span>See more info</span>
                  <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary transition-colors">
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Progress Indicators */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-40">
          {slides.map((_, index) => (
            <button 
              key={index} 
              type="button" 
              onClick={() => setCurrentSlide(index)} 
              className="p-2 focus:outline-none group"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className={`h-1 rounded-full overflow-hidden transition-all duration-300 ease-out ${
                index === currentSlide ? 'w-8 md:w-10 bg-white' : 'w-2 md:w-3 bg-white/30 group-hover:bg-white/50'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
