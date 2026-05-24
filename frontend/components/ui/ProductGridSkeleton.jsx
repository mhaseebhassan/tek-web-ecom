export default function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface-card overflow-hidden animate-pulse" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="aspect-[4/5] bg-muted/60" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-3/4 rounded-md bg-muted" />
            <div className="h-4 w-full rounded-md bg-muted" />
            <div className="h-4 w-2/3 rounded-md bg-muted" />
            <div className="mt-4 h-11 w-full rounded-lg bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
