'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { Bottle } from '@/components/store-layout';
import { BrandLoader } from '@/components/brand-loader';
import { money } from '@/lib/catalog';
import type { Doc } from '@/convex/_generated/dataModel';

type OrderDoc = Omit<Doc<'orders'>, 'shippingAddress'> & { shippingAddress: Record<string, string> };

/**
 * Full order detail — owner-scoped via Convex. Used by /order/[id] and
 * /account/orders/[id].
 */
export function OrderDetail({ id }: { id: string }) {
  const { isSignedIn, isLoaded } = useAuth();
  const order = useQuery(api.orders.get, isSignedIn ? { id } : 'skip');

  if (isLoaded && !isSignedIn) {
    return (
      <div className="empty">
        <h2>Sign in required</h2>
        <p>Sign in to view this order.</p>
        <Link className="btn" href="/auth">Sign in</Link>
      </div>
    );
  }

  if (!isLoaded || order === undefined) {
    return (
      <div className="empty">
        <BrandLoader label="Opening your order…" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="empty">
        <h2>Order not found</h2>
        <p>This order does not exist or belongs to another account.</p>
        <Link className="btn" href="/account/orders">My orders</Link>
      </div>
    );
  }

  const o = order as OrderDoc;
  const a = o.shippingAddress;

  return (
    <div className="mx-auto grid max-w-4xl gap-10 px-5 pb-24">
      <div className="notice">
        {o.paymentStatus === 'paid' ? (
          <>Your payment has been received and your order is confirmed. A receipt lives in <Link href="/account/orders" className="underline">my orders</Link>.</>
        ) : (
          <>Your order is placed — pay in cash when it arrives. Track it any time in <Link href="/account/orders" className="underline">my orders</Link>.</>
        )}
      </div>
      <section className="panel">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="!mb-0">Order {o._id.slice(-8).toUpperCase()}</h2>
          <span className={`order-status ${o.paymentStatus}`}>
            {o.paymentMethod === 'online' ? `Paid${o.paidAmountInr ? ` ₹${o.paidAmountInr}` : ''}` : 'Cash on delivery'}
          </span>
          <span className="order-status">{o.status}</span>
        </div>
        {o.items.map((line) => (
          <div className="line-item" key={line.productId}>
            <Bottle id={line.productId} />
            <div>
              <p className="name">{line.name}</p>
              <p className="meta">{line.quantity} × {money(line.unitPrice)}</p>
            </div>
            <p className="price">{money(line.unitPrice * line.quantity)}</p>
          </div>
        ))}
        <div className="totals mt-6">
          <div className="row"><span>Subtotal</span><span>{money(o.subtotal)}</span></div>
          <div className="row"><span>Shipping</span><span>{o.shipping ? money(o.shipping) : 'Complimentary'}</span></div>
          <div className="row grand"><span>Total</span><span>{money(o.total)}</span></div>
        </div>
      </section>
      <section className="panel">
        <h2>Shipping to</h2>
        <p className="text-sm leading-relaxed text-[var(--mid)]">
          <strong className="text-[var(--ink)]">{a.full_name}</strong><br />
          {a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />
          {a.city}, {a.region} {a.postal_code}<br />
          {a.country} · {a.phone}
        </p>
      </section>
      <Link className="btn mx-auto" href="/shop">Continue shopping</Link>
    </div>
  );
}
