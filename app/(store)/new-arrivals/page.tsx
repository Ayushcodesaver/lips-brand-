import type { Metadata } from 'next';
import { PageTitle, StoreLayout } from '@/components/store-layout';
import { ProductGrid } from '@/components/product-grid';
import { newArrivals } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'New Arrivals | Maison Vell Beauty',
  description: 'The newest Maison Vell Beauty shades: Champagne Veil, Midnight Noir and Pearl Ivory.',
};

export default function NewArrivalsPage() {
  return (
    <StoreLayout>
      <PageTitle eyebrow="Just landed" title="New arrivals" />
      <ProductGrid items={newArrivals} />
      <p className="note wide" style={{ padding: '30px 5vw', fontSize: 12, letterSpacing: '0.06em', color: 'var(--dim)', textAlign: 'center' }}>
        Complimentary shipping on orders over $60 · Free returns within 30 days
      </p>
    </StoreLayout>
  );
}
