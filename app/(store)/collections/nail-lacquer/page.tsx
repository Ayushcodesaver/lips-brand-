import type { Metadata } from 'next';
import { PageTitle, StoreLayout } from '@/components/store-layout';
import { ProductGrid } from '@/components/product-grid';
import { nailLacquerCollection } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Nail Lacquer Collection | Maison Vell Beauty',
  description: 'The complete Maison Vell Beauty nail lacquer collection — six signature shades in a 21-free formula.',
};

export default function NailLacquerCollectionPage() {
  return (
    <StoreLayout>
      <PageTitle eyebrow="Collections" title="Nail lacquer" />
      <ProductGrid items={nailLacquerCollection} />
      <p className="note wide" style={{ padding: '30px 5vw', fontSize: 12, letterSpacing: '0.06em', color: 'var(--dim)', textAlign: 'center' }}>
        Six signature shades · 21-free formula · 12 ml
      </p>
    </StoreLayout>
  );
}
