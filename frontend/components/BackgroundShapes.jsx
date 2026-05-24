import React from 'react';

export default function BackgroundShapes({ variant = 'site' }) {
  const isAdmin = variant === 'admin';

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className={`absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full blur-[120px] ${isAdmin ? 'bg-teal-400/20' : 'bg-cyan-400/25'} animate-float-slow`} />
      <div className={`absolute top-10 right-[-120px] h-[460px] w-[460px] rounded-full blur-[140px] ${isAdmin ? 'bg-amber-400/20' : 'bg-orange-400/25'} animate-float-slower`} />
      <div className={`absolute bottom-[-200px] left-[15%] h-[520px] w-[520px] rounded-full blur-[160px] ${isAdmin ? 'bg-emerald-400/20' : 'bg-teal-400/25'} animate-float-slowest`} />
      <div className={`absolute bottom-[-120px] right-[10%] h-[420px] w-[420px] rounded-full blur-[140px] ${isAdmin ? 'bg-rose-400/15' : 'bg-amber-400/25'} animate-float-slow`} />
    </div>
  );
}
