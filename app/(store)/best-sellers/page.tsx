import type { Metadata } from 'next';
import { PageTitle, StoreLayout } from '@/components/store-layout';
import { ProductGrid } from '@/components/product-grid';
import { bestSellers } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Best Sellers | Maison Vell Beauty',
  description: 'The most loved Maison Vell Beauty lacquers: Velvet Rouge and Nude Cashmere.',
};

export default function BestSellersPage() {
  return (
    <StoreLayout>
      <PageTitle eyebrow="Loved worldwide" title="Best sellers" />
      <ProductGrid items={bestSellers} />
      <p className="note wide" style={{ padding: '30px 5vw', fontSize: 12, letterSpacing: '0.06em', color: 'var(--dim)', textAlign: 'center' }}>
        Complimentary shipping on orders over $60 · Free returns within 30 days
      </p>
    </StoreLayout>
  );
}
