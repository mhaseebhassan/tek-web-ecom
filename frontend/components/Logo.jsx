import React from 'react';

export default function Logo({ className = "w-8 h-8", iconOnly = false }) {
  return (
    <div className={`relative flex items-center gap-2 group ${className}`}>
      {/* Geometric Logo Mark */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full transform transition-transform duration-500 group-hover:rotate-[30deg]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Diamond Frame */}
          <path
            d="M50 10L90 50L50 90L10 50L50 10Z"
            className="stroke-teal-500/30"
            strokeWidth="2"
          />
          
          {/* Inner Accent Path */}
          <path
            d="M50 25L75 50L50 75L25 50L50 25Z"
            className="fill-teal-500/10 stroke-teal-500/50"
            strokeWidth="1.5"
          />

          {/* Core Geometric 'T' */}
          <path
            d="M35 35H65M50 35V65"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-teal-600"
          />

          {/* Decorative Glow Point */}
          <circle cx="50" cy="50" r="4" className="fill-teal-400 animate-pulse" />
        </svg>
        
        {/* Backdrop Glow */}
        <div className="absolute inset-0 bg-teal-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      </div>

      {!iconOnly && (
        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-teal-700 to-cyan-600 tracking-tight transition-smooth group-hover:tracking-normal">
          Tekron
        </span>
      )}
    </div>
  );
}
