'use client';

import { use } from 'react';
import { PageTitle, StoreLayout } from '@/components/store-layout';
import { OrderDetail } from '@/components/order-detail';

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <StoreLayout>
      <PageTitle eyebrow="Thank you" title="Order confirmation" />
      <OrderDetail id={id} />
    </StoreLayout>
  );
}
