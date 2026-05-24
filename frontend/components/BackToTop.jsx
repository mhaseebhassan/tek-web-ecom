'use client';

import { useEffect, useState } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-smooth animate-scale-in"
      aria-label="Back to top"
    >
      <ArrowUpIcon className="h-5 w-5" />
    </button>
  );
}
