'use client';

import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PageTitle, StoreLayout } from '@/components/store-layout';
import { money } from '@/lib/catalog';

export default function MyOrdersPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const orders = useQuery(api.orders.mine, isSignedIn ? {} : 'skip');

  if (isLoaded && !isSignedIn) {
    return (
      <StoreLayout>
        <div className="empty">
          <h2>Sign in required</h2>
          <p>Sign in to see your order history.</p>
          <Link className="btn" href="/auth">Sign in</Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <PageTitle eyebrow="My account" title="My orders" />
      <section className="mx-auto max-w-4xl px-5 pb-24">
        <div className="panel">
          {orders === undefined && <p className="text-sm text-[var(--dim)]">Loading…</p>}
          {orders && orders.length === 0 && (
            <p className="text-sm text-[var(--dim)]">
              No orders yet. <Link href="/shop" className="underline">Shop the collection</Link>
            </p>
          )}
          <div className="flex flex-col">
            {(orders ?? []).map((o) => (
              <div className="line-item" key={o._id} style={{ gridTemplateColumns: '1fr auto' }}>
                <div>
                  <Link href={`/account/orders/${o._id}`} className="name">
                    Order · {o._id.slice(-8).toUpperCase()}
                  </Link>
                  <p className="meta">
                    {new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} ·{' '}
                    {o.paymentMethod === 'online' ? 'Paid online' : 'Cash on delivery'} · {o.status}
                  </p>
                </div>
                <p className="price">{money(o.total)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
