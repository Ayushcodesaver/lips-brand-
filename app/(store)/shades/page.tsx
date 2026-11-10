import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTitle, StoreLayout } from '@/components/store-layout';
import { products, money } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Shades — The Colour Collection | Maison Vell Beauty',
  description: 'Every Maison Vell Beauty shade at a glance: deep luxury red, warm nude, dusty rose, champagne, black and ivory.',
};

export default function ShadesPage() {
  return (
    <StoreLayout>
      <PageTitle eyebrow="Colour, first" title="The shades" />
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 pb-24 sm:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            className="panel flex flex-col items-center gap-3 p-8 text-center transition-transform hover:-translate-y-1"
          >
            <span
              className="swatch"
              style={{ width: 84, height: 84, background: p.hex, boxShadow: 'inset 0 -10px 22px rgba(0,0,0,.18), inset 0 8px 14px rgba(255,255,255,.25)' }}
              aria-hidden
            />
            <span className="wide text-[13px] tracking-[0.14em]">{p.name}</span>
            <span className="text-sm text-[var(--mid)]">{p.shade}</span>
            <span className="text-xs text-[var(--dim)]">{money(p.price)}</span>
          </Link>
        ))}
      </div>
    </StoreLayout>
  );
}
