'use client';

/** Branded loading state — replaces bare "Loading…" strings (UI-SPEC, phase 1). */
export function BrandLoader({ label = 'Preparing your collection…' }: { label?: string }) {
  return (
    <span className="brand-loader" role="status" aria-busy="true">
      <i aria-hidden />
      <i aria-hidden />
      <i aria-hidden />
      {label}
    </span>
  );
}
