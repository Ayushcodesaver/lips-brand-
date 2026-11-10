'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { bagSchema, products, type BagItem } from '@/lib/catalog';
import { toast } from 'sonner';

export type Store = {
  user: { fullName: string; email: string } | null;
  signedIn: boolean;
  ready: boolean;
  items: BagItem[];
  wishlist: number[];
  add: (id: number) => void;
  quantity: (id: number, n: number) => void;
  toggle: (id: number) => void;
  clear: () => void;
};

const Context = createContext<Store | null>(null);

export const productCount = (items: BagItem[]) => items.reduce((n, i) => n + i.quantity, 0);
export const productName = (id: number) => products[id]?.name ?? '';

export function useStore() {
  const value = useContext(Context);
  if (!value) throw new Error('Store provider missing — wrap the page in StoreProvider');
  return value;
}

/** Supplies an already-built Store value (used by the synced provider). */
export function StoreValueProvider({ value, children }: { value: Store; children: ReactNode }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

/** Shared bag/wishlist actions operating on plain state setters. */
export function useStoreActions(
  setItems: React.Dispatch<React.SetStateAction<BagItem[]>>,
  setWishlist: React.Dispatch<React.SetStateAction<number[]>>,
) {
  const add = useCallback((id: number) => {
    if (id < 0 || id > 5 || !Number.isInteger(id)) return;
    setItems((old) => {
      const found = old.find((i) => i.productId === id);
      return found
        ? old.map((i) => (i.productId === id ? { ...i, quantity: Math.min(20, i.quantity + 1) } : i))
        : [...old, { productId: id, quantity: 1 }];
    });
    toast.success('Added to your bag');
  }, [setItems]);

  const toggle = useCallback(
    (id: number) => {
      if (!Number.isInteger(id) || id < 0 || id > 5) return;
      setWishlist((old) => (old.includes(id) ? old.filter((n) => n !== id) : [...old, id]));
    },
    [setWishlist],
  );

  const quantity = useCallback(
    (id: number, n: number) => {
      setItems((old) =>
        n <= 0
          ? old.filter((i) => i.productId !== id)
          : old.map((i) => (i.productId === id ? { ...i, quantity: Math.min(20, n) } : i)),
      );
    },
    [setItems],
  );

  const clear = useCallback(() => setItems([]), [setItems]);

  return { add, toggle, quantity, clear };
}

function readGuest(): { items: BagItem[]; wishlist: number[] } {
  try {
    const items = bagSchema.parse(JSON.parse(localStorage.getItem('mv-bag') || '[]'));
    const wishlist = (JSON.parse(localStorage.getItem('mv-wishlist') || '[]') as unknown[]).filter(
      (n): n is number => typeof n === 'number' && n >= 0 && n < 6,
    );
    return { items, wishlist };
  } catch {
    return { items: [], wishlist: [] };
  }
}

/**
 * Guest-only store: bag + wishlist persist in localStorage.
 * Used before Clerk/Convex keys are configured, and as the base state the
 * synced provider hydrates from.
 */
export function GuestStoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { items: bag, wishlist: wishes } = readGuest();
    setItems(bag);
    setWishlist(wishes);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem('mv-bag', JSON.stringify(items));
    localStorage.setItem('mv-wishlist', JSON.stringify(wishlist));
    localStorage.setItem('mv-count', String(productCount(items)));
  }, [items, wishlist, ready]);

  const { add, toggle, quantity, clear } = useStoreActions(setItems, setWishlist);

  const value = useMemo<Store>(
    () => ({ user: null, signedIn: false, ready, items, wishlist, add, quantity, toggle, clear }),
    [ready, items, wishlist, add, quantity, toggle, clear],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
