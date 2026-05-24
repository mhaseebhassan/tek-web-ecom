export default function SectionDivider() {
  return (
    <div className="relative py-8 md:py-10" aria-hidden>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-px w-[min(70%,24rem)] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-divider" />
      </div>
      <div className="relative mx-auto h-8 w-8 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)]" />
      </div>
    </div>
  );
}
