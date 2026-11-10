'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { bagSchema, type BagItem } from '@/lib/catalog';
import { toast } from 'sonner';
import { StoreValueProvider, productCount, useStoreActions, type Store } from './store-context';

export { GuestStoreProvider, productCount, productName, useStore } from './store-context';

/**
 * Full store: bag + wishlist sync to Convex for signed-in users (with guest
 * merge on sign-in), localStorage only while signed out.
 * Requires Clerk + Convex — see components/providers.tsx for the fallback.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const savedBag = useQuery(api.bags.mine, {});
  const setBag = useMutation(api.bags.set);
  const ensureUser = useMutation(api.users.ensure);

  const [items, setItems] = useState<BagItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [cloud, setCloud] = useState<{ items: BagItem[]; wishlist: number[] } | null>(null);
  const owner = useRef<string | null>(null);

  // Load guest state once.
  useEffect(() => {
    try {
      setItems(bagSchema.parse(JSON.parse(localStorage.getItem('mv-bag') || '[]')));
      setWishlist(
        (JSON.parse(localStorage.getItem('mv-wishlist') || '[]') as unknown[]).filter(
          (n): n is number => typeof n === 'number' && n >= 0 && n < 6,
        ),
      );
    } catch {
      /* ignore invalid old storage */
    }
    setReady(true);
  }, []);

  // Hydrate + merge when signed in.
  useEffect(() => {
    if (!isSignedIn) {
      if (owner.current) {
        owner.current = null;
        setCloud(null);
        setItems([]);
        setWishlist([]);
        setReady(true);
      }
      return;
    }
    if (!savedBag || cloud) return;
    owner.current = 'signed-in';
    let guest: BagItem[] = [];
    let savedWishes: number[] = [];
    try {
      guest = bagSchema.parse(JSON.parse(localStorage.getItem('mv-bag') || '[]'));
      savedWishes = (JSON.parse(localStorage.getItem('mv-wishlist') || '[]') as unknown[]).filter(
        (n): n is number => typeof n === 'number' && n >= 0 && n < 6,
      );
    } catch {
      /* ignore */
    }
    const merged = [...(savedBag.items ?? [])];
    guest.forEach((g) => {
      const found = merged.find((i) => i.productId === g.productId);
      if (found) found.quantity = Math.min(20, found.quantity + g.quantity);
      else merged.push(g);
    });
    const wishes = [...new Set([...(savedBag.wishlist ?? []), ...savedWishes])];
    setItems(merged);
    setWishlist(wishes);
    setCloud({ items: merged, wishlist: wishes });
    localStorage.removeItem('mv-bag');
    localStorage.removeItem('mv-wishlist');
    void setBag({ items: merged, wishlist: wishes }).catch(() => toast.error('Could not sync your bag.'));
    void ensureUser({
      fullName: clerkUser?.fullName ?? '',
      email: clerkUser?.primaryEmailAddress?.emailAddress ?? '',
    }).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, savedBag]);

  // Persist local-only state while signed out.
  useEffect(() => {
    if (!ready || isSignedIn) return;
    localStorage.setItem('mv-bag', JSON.stringify(items));
    localStorage.setItem('mv-wishlist', JSON.stringify(wishlist));
    localStorage.setItem('mv-count', String(productCount(items)));
  }, [items, wishlist, ready, isSignedIn]);

  // Debounced sync to Convex while signed in.
  useEffect(() => {
    if (!isSignedIn || !ready || !cloud) return;
    if (cloud.items === items && cloud.wishlist === wishlist) return;
    const t = setTimeout(() => {
      void setBag({ items, wishlist }).catch(() => toast.error('Your bag could not be saved.'));
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, wishlist, isSignedIn, ready]);

  const { add, toggle, quantity, clear } = useStoreActions(setItems, setWishlist);

  const value = useMemo<Store>(
    () => ({
      user: isSignedIn
        ? { fullName: clerkUser?.fullName ?? '', email: clerkUser?.primaryEmailAddress?.emailAddress ?? '' }
        : null,
      signedIn: !!isSignedIn,
      ready,
      items,
      wishlist,
      add,
      quantity,
      toggle,
      clear,
    }),
    [isSignedIn, clerkUser, ready, items, wishlist, add, quantity, toggle, clear],
  );

  return <StoreValueProvider value={value}>{children}</StoreValueProvider>;
}
