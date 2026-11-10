'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { PageTitle, StoreLayout } from '@/components/store-layout';
import { AddressFields } from '@/components/address-form';
import { addressSchema, emptyAddress, type Address } from '@/lib/catalog';

export default function AddressesPage() {
  const { isSignedIn } = useAuth();
  const savedAddresses = useQuery(api.addresses.list, isSignedIn ? {} : 'skip');
  const addAddress = useMutation(api.addresses.add);
  const removeAddress = useMutation(api.addresses.remove);
  const [draft, setDraft] = useState<Address>(emptyAddress);
  const [saving, setSaving] = useState(false);

  if (!isSignedIn) {
    return (
      <StoreLayout>
        <div className="empty">
          <h2>Sign in required</h2>
          <p>Sign in to manage your saved addresses.</p>
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
      <PageTitle eyebrow="My account" title="My addresses" />
      <div className="mx-auto grid max-w-3xl gap-10 px-5 pb-24">
        <section className="panel">
          <h2>Saved addresses</h2>
          <div className="flex flex-col gap-3">
            {(savedAddresses ?? []).map((a) => (
              <div className="flex items-start justify-between gap-3 rounded-lg border border-[var(--line)] p-3" key={a._id}>
                <p className="text-sm text-[var(--mid)]">
                  <strong className="text-[var(--ink)]">{a.full_name}</strong><br />
                  {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city} {a.postal_code}, {a.country} · {a.phone}
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
        </section>
        <section className="panel">
          <h2>Add an address</h2>
          <AddressFields value={draft} onChange={setDraft} />
          <button className="btn mt-5" onClick={saveAddress} disabled={saving}>
            {saving ? 'Saving…' : 'Save address'}
          </button>
        </section>
      </div>
    </StoreLayout>
  );
}
