export default function Logo({ className = '', iconOnly = false }) {
  return (
    <div className={`group inline-flex items-center gap-3 ${className}`}>
      <div className="relative grid h-9 w-9 place-items-center rounded-[1rem] border border-primary/[0.12] bg-primary text-primary-foreground shadow-[0_10px_24px_rgb(15_23_42/0.16)] transition-smooth group-hover:-translate-y-0.5">
        <svg
          viewBox="0 0 32 32"
          className="h-5 w-5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M7 8.5H25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M16 8.5V24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M9 24H23" stroke="hsl(var(--secondary))" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {!iconOnly && (
        <span className="text-xl font-black tracking-tight text-foreground">
          Tekron
        </span>
      )}
    </div>
  );
}
