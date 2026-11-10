import type { Metadata } from 'next';
import { PageTitle, StoreLayout } from '@/components/store-layout';
import { ProductGrid } from '@/components/product-grid';
import { limitedEdition } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Limited Edition | Maison Vell Beauty',
  description: 'The Maison Vell Beauty atelier limited edition: Champagne Veil and Midnight Noir.',
};

export default function LimitedEditionPage() {
  return (
    <StoreLayout>
      <PageTitle eyebrow="Atelier release" title="Limited edition" />
      <ProductGrid items={limitedEdition} />
      <p className="note wide" style={{ padding: '30px 5vw', fontSize: 12, letterSpacing: '0.06em', color: 'var(--dim)', textAlign: 'center' }}>
        Produced once, numbered by hand · While stock lasts
      </p>
    </StoreLayout>
  );
}
