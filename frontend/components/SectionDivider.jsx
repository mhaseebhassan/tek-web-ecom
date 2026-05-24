import React from 'react';

export default function SectionDivider({ variant = 'default' }) {
  const gradient =
    variant === 'sunset'
      ? 'from-orange-400/60 via-amber-300/60 to-rose-400/60'
      : variant === 'ocean'
        ? 'from-teal-400/60 via-cyan-300/60 to-emerald-400/60'
        : variant === 'midnight'
          ? 'from-slate-500/60 via-teal-400/50 to-slate-300/60'
          : 'from-cyan-400/60 via-amber-300/60 to-teal-400/60';

  return (
    <div className="relative py-10">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`h-[2px] w-[70%] bg-gradient-to-r ${gradient} animate-divider`} />
      </div>
      <div className="relative mx-auto h-10 w-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-white/70 border border-white/60 shadow-lg backdrop-blur" />
        {/* Symmetrical Geometric Dots */}
        <div className="absolute -left-12 w-2 h-2 rounded-full bg-teal-400/40" />
        <div className="absolute -right-12 w-2 h-2 rounded-full bg-teal-400/40" />
        <div className="absolute -left-20 w-1.5 h-1.5 rounded-full bg-teal-400/20" />
        <div className="absolute -right-20 w-1.5 h-1.5 rounded-full bg-teal-400/20" />
      </div>
    </div>
  );
}
