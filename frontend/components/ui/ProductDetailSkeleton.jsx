export default function ProductDetailSkeleton() {
  return (
    <div className="page-shell animate-pulse">
      <div className="mb-8 h-4 w-32 rounded-full bg-white/[0.08]" />
      <div className="surface-panel grid grid-cols-1 gap-10 p-6 md:grid-cols-2 md:p-8">
        <div className="aspect-square rounded-[1.6rem] bg-white/[0.08]" />
        <div className="space-y-6 py-4">
          <div className="h-8 w-32 rounded-full bg-white/[0.08]" />
          <div className="h-16 w-3/4 rounded-[1.2rem] bg-white/[0.08]" />
          <div className="h-10 w-40 rounded-full bg-white/[0.08]" />
          <div className="space-y-3 pt-4">
            <div className="h-4 w-full rounded-full bg-white/[0.08]" />
            <div className="h-4 w-5/6 rounded-full bg-white/[0.08]" />
            <div className="h-4 w-4/6 rounded-full bg-white/[0.08]" />
          </div>
          <div className="mt-10 h-14 w-48 rounded-full bg-white/[0.08]" />
        </div>
      </div>
    </div>
  );
}
