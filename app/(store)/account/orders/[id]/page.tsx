'use client';

import { use } from 'react';
import Link from 'next/link';
import { PageTitle, StoreLayout } from '@/components/store-layout';
import { OrderDetail } from '@/components/order-detail';

export default function AccountOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <StoreLayout>
      <PageTitle eyebrow="My orders" title="Order details" />
      <p className="mx-auto max-w-4xl px-5 pb-2 text-xs uppercase tracking-[0.14em] text-[var(--dim)]">
        <Link href="/account/orders" className="underline">← Back to my orders</Link>
      </p>
      <OrderDetail id={id} />
    </StoreLayout>
  );
}
