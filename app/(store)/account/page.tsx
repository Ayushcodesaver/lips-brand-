'use client';

import Link from 'next/link';
import { useAuth, SignOutButton } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PageTitle, StoreLayout } from '@/components/store-layout';
import { money } from '@/lib/catalog';

const CARDS = [
  { href: '/account/profile', title: 'My profile', text: 'Name, email and sign-in details.' },
  { href: '/account/orders', title: 'My orders', text: 'History, status and receipts.' },
  { href: '/account/addresses', title: 'My addresses', text: 'Saved shipping addresses.' },
  { href: '/wishlist', title: 'My wishlist', text: 'Lacquers saved for later.' },
];

export default function AccountPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const profile = useQuery(api.users.me, isSignedIn ? {} : 'skip');
  const orders = useQuery(api.orders.mine, isSignedIn ? {} : 'skip');
  const lastOrder = (orders ?? [])[0];

  if (isLoaded && !isSignedIn) {
    return (
      <StoreLayout>
        <div className="empty">
          <h2>Sign in required</h2>
          <p>Sign in to view your dashboard.</p>
          <Link className="btn" href="/auth">Sign in</Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <PageTitle eyebrow="Maison Vell" title="My account" />
      <div className="mx-auto grid max-w-5xl gap-10 px-5 pb-24">
        <section className="panel">
          <h2>Welcome back</h2>
          <p className="text-sm leading-relaxed text-[var(--mid)]">
            <strong className="text-[var(--ink)]">{profile?.fullName || '—'}</strong> · {profile?.email || ''}
          </p>
        </section>

        <div className="grid gap-6 sm:grid-cols-2">
          {CARDS.map((card) => (
            <Link key={card.href} href={card.href} className="panel transition-transform hover:-translate-y-0.5">
              <h2>{card.title}</h2>
              <p className="text-sm text-[var(--mid)]">{card.text}</p>
            </Link>
          ))}
        </div>

        <section className="panel">
          <h2>Latest order</h2>
          {lastOrder ? (
            <div className="line-item" style={{ gridTemplateColumns: '1fr auto' }}>
              <div>
                <Link href={`/account/orders/${lastOrder._id}`} className="name">
                  Order · {lastOrder._id.slice(-8).toUpperCase()}
                </Link>
                <p className="meta">
                  {new Date(lastOrder.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} ·{' '}
                  {lastOrder.paymentMethod === 'online' ? 'Paid online' : 'Cash on delivery'} · {lastOrder.status}
                </p>
              </div>
              <p className="price">{money(lastOrder.total)}</p>
            </div>
          ) : (
            <p className="text-sm text-[var(--dim)]">
              No orders yet. <Link href="/shop" className="underline">Shop the collection</Link>
            </p>
          )}
        </section>

        <section className="panel">
          <h2>Session</h2>
          <SignOutButton>
            <button className="btn ghost">Sign out</button>
          </SignOutButton>
        </section>
      </div>
    </StoreLayout>
  );
}
