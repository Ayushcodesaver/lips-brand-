'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { PageTitle, StoreLayout } from '@/components/store-layout';

export default function ProfilePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const profile = useQuery(api.users.me, {});
  const updateName = useMutation(api.users.updateName);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.fullName && !name) setName(profile.fullName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.fullName]);

  if (isLoaded && !isSignedIn) {
    return (
      <StoreLayout>
        <div className="empty">
          <h2>Sign in required</h2>
          <p>Sign in to view and edit your profile.</p>
          <a className="btn" href="/auth">Sign in</a>
        </div>
      </StoreLayout>
    );
  }

  async function save() {
    setSaving(true);
    try {
      await updateName({ fullName: name });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save your profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <StoreLayout>
      <PageTitle eyebrow="My account" title="My profile" />
      <div className="mx-auto grid max-w-3xl gap-10 px-5 pb-24">
        <section className="panel">
          <h2>Sign-in details</h2>
          <p className="text-sm leading-relaxed text-[var(--mid)]">
            Email — <strong className="text-[var(--ink)]">{clerkUser?.primaryEmailAddress?.emailAddress || profile?.email || '—'}</strong>
            <br />
            <span className="text-xs">Managed by Clerk. Password changes happen in the sign-in security settings.</span>
          </p>
        </section>
        <section className="panel">
          <h2>Display name</h2>
          <div className="field-grid">
            <label className="col-span-full">
              <span>Full name</span>
              <input value={name} maxLength={100} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </label>
          </div>
          <button className="btn mt-5" onClick={save} disabled={saving || !name.trim()}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </section>
      </div>
    </StoreLayout>
  );
}
