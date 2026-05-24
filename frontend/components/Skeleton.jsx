'use client';

export default function Skeleton({ className = "" }) {
  return (
    <div className={`skeleton ${className}`} />
  );
}

export function ProductSkeleton() {
  return (
    <div className="glass-card rounded-3xl border border-white/50 p-4 space-y-4">
      <Skeleton className="aspect-[4/5] rounded-2xl w-full" />
      <Skeleton className="h-6 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
}
