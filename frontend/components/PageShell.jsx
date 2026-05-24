'use client';

export default function PageShell({
  title,
  subtitle,
  children,
  className = '',
  headerClassName = '',
}) {
  return (
    <div className={`page-shell animate-page-in ${className}`}>
      {(title || subtitle) && (
        <header className={`page-header ${headerClassName}`}>
          {title && <h1 className="page-title">{title}</h1>}
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </header>
      )}
      {children}
    </div>
  );
}
