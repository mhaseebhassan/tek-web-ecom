import Link from 'next/link';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}) {
  return (
    <div className="surface-panel mx-auto max-w-lg px-8 py-14 text-center animate-scale-in">
      {Icon && (
        <div className="mx-auto mb-7 grid h-16 w-16 place-items-center rounded-lg bg-primary text-primary-foreground shadow-[0_12px_26px_rgb(15_23_42/0.18)]">
          <Icon className="h-8 w-8" />
        </div>
      )}
      <h2 className="text-3xl font-black tracking-tight text-foreground">{title}</h2>
      {description && <p className="mt-4 text-base font-medium leading-7 text-muted-foreground">{description}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary mt-8">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="btn-primary mt-8">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
