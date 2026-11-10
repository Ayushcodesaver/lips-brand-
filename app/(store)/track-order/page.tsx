'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PageTitle, StoreLayout } from '@/components/store-layout';
import { money } from '@/lib/catalog';

export default function TrackOrderPage() {
  const { isSignedIn } = useAuth();
  const [orderId, setOrderId] = useState('');
  const [lookup, setLookup] = useState('');
  const order = useQuery(api.orders.get, isSignedIn && lookup ? { id: lookup } : 'skip');

  const stages = ['placed', 'processing', 'shipped', 'delivered'] as const;

  return (
    <StoreLayout>
      <PageTitle eyebrow="Customer care" title="Track your order" />
      <div className="mx-auto grid max-w-3xl gap-10 px-5 pb-24">
        {!isSignedIn && (
          <div className="notice">
            Tracking is tied to your account for privacy. <Link href="/auth" className="underline">Sign in</Link> to follow your parcel.
          </div>
        )}
        <section className="panel">
          <h2>Order reference</h2>
          <div className="field-grid">
            <label className="col-span-full">
              <span>Order number</span>
              <input
                value={orderId}
                placeholder="e.g. the code from your confirmation page"
                onChange={(e) => setOrderId(e.target.value)}
                disabled={!isSignedIn}
              />
            </label>
          </div>
          <button className="btn mt-5" onClick={() => setLookup(orderId.trim())} disabled={!isSignedIn || !orderId.trim()}>
            Track order
          </button>
        </section>

        {lookup && (
          <section className="panel">
            <h2>Status</h2>
            {order === undefined && <p className="text-sm text-[var(--dim)]">Looking up…</p>}
            {order === null && (
              <p className="text-sm text-[var(--mid)]">
                No order with that reference in your account. Check the code or open{' '}
                <Link href="/account/orders" className="underline">my orders</Link>.
              </p>
            )}
            {order && (
              <>
                <div className="flex flex-wrap gap-2">
                  {stages.map((stage) => {
                    const reached = stages.indexOf(order.status as (typeof stages)[number]) >= stages.indexOf(stage);
                    return (
                      <span key={stage} className={`order-status ${reached ? 'paid' : ''}`}>
                        {stage}
                      </span>
                    );
                  })}
                </div>
                <div className="totals mt-6">
                  <div className="row"><span>Order total</span><span>{money(order.total)}</span></div>
                  <div className="row"><span>Payment</span><span>{order.paymentMethod === 'online' ? 'Paid online' : 'Cash on delivery'}</span></div>
                  <div className="row"><span>Placed</span><span>{new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</span></div>
                </div>
              </>
            )}
          </section>
        )}
      </div>
    </StoreLayout>
  );
}
