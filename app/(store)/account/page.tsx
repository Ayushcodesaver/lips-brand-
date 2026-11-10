'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth, useUser, SignOutButton } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { PageTitle, StoreLayout } from '@/components/store-layout';
import { AddressFields } from '@/components/address-form';
import { money, addressSchema, emptyAddress, type Address } from '@/lib/catalog';

export default function AccountPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const profile = useQuery(api.users.me, {});
  const orders = useQuery(api.orders.mine, {});
  const savedAddresses = useQuery(api.addresses.list, {});
  const addAddress = useMutation(api.addresses.add);
  const removeAddress = useMutation(api.addresses.remove);

  const [draft, setDraft] = useState<Address>(emptyAddress);
  const [saving, setSaving] = useState(false);

  if (isLoaded && !isSignedIn) {
    return (
      <StoreLayout>
        <div className="empty">
          <h2>Sign in required</h2>
          <p>Sign in to view your profile, addresses and orders.</p>
          <Link className="btn" href="/auth">Sign in</Link>
        </div>
      </StoreLayout>
    );
  }

  async function saveAddress() {
    const parsed = addressSchema.safeParse(draft);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Please complete the address');
      return;
    }
    setSaving(true);
    try {
      await addAddress(parsed.data);
      setDraft(emptyAddress);
      toast.success('Address saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save the address');
    } finally {
      setSaving(false);
    }
  }

  return (
    <StoreLayout>
      <PageTitle eyebrow="Maison Vell" title="My account" />
      <div className="mx-auto grid max-w-5xl gap-10 px-5 pb-24 md:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-6">
          <section className="panel">
            <h2>Profile</h2>
            <p className="text-sm leading-relaxed text-[var(--mid)]">
              <strong className="text-[var(--ink)]">{clerkUser?.fullName || profile?.fullName || '—'}</strong><br />
              {clerkUser?.primaryEmailAddress?.emailAddress || profile?.email || ''}
            </p>
          </section>
          <section className="panel">
            <h2>Saved addresses</h2>
            <div className="flex flex-col gap-3">
              {(savedAddresses ?? []).map((a) => (
                <div className="flex items-start justify-between gap-3 rounded-lg border border-[var(--line)] p-3" key={a._id}>
                  <p className="text-sm text-[var(--mid)]">
                    <strong className="text-[var(--ink)]">{a.full_name}</strong><br />
                    {a.line1}, {a.city} {a.postal_code}, {a.country}
                  </p>
                  <button
                    className="text-xs uppercase tracking-[0.12em] text-[var(--dim)] hover:text-[var(--ink)]"
                    onClick={() => void removeAddress({ id: a._id }).then(() => toast.success('Address removed')).catch(() => toast.error('Could not remove'))}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {savedAddresses && savedAddresses.length === 0 && <p className="text-sm text-[var(--dim)]">No addresses saved yet.</p>}
            </div>
            <div className="mt-5 flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--mid)]">Add an address</p>
              <AddressFields value={draft} onChange={setDraft} />
              <button className="btn mt-2" onClick={saveAddress} disabled={saving}>
                {saving ? 'Saving…' : 'Save address'}
              </button>
            </div>
          </section>
          <section className="panel">
            <h2>Session</h2>
            <SignOutButton>
              <button className="btn ghost">Sign out</button>
            </SignOutButton>
          </section>
        </div>

        <section className="panel h-fit">
          <h2>Order history</h2>
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
                  <Link href={`/order/${o._id}`} className="name">Order · {o._id.slice(-8).toUpperCase()}</Link>
                  <p className="meta">
                    {new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} ·{' '}
                    {o.paymentMethod === 'online' ? 'Paid online' : 'Cash on delivery'} · {o.status}
                  </p>
                </div>
                <p className="price">{money(o.total)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </StoreLayout>
  );
}
