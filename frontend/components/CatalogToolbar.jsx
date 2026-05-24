'use client';

import { MagnifyingGlassIcon, FunnelIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price low to high' },
  { value: 'price_desc', label: 'Price high to low' },
  { value: 'name', label: 'Name A-Z' },
];

export default function CatalogToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  sort,
  onSortChange,
  resultCount,
}) {
  return (
    <div className="surface-panel mb-10 p-4 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products"
            className="input-field pl-12"
          />
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <div className="hidden items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground sm:flex">
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            {resultCount} results
          </div>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="select-field min-w-[180px] appearance-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-start">
        <div className="flex shrink-0 items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
          <FunnelIcon className="h-4 w-4" />
          Filters
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCategoryChange('')}
            className={`rounded-lg border px-4 py-2 text-xs font-black uppercase tracking-[0.13em] transition-smooth ${
              !category
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border/70 bg-card text-muted-foreground hover:border-primary/[0.35] hover:text-foreground'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`rounded-lg border px-4 py-2 text-xs font-black uppercase tracking-[0.13em] transition-smooth ${
                category === cat
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border/70 bg-card text-muted-foreground hover:border-primary/[0.35] hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
