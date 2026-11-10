'use client';

import { GuestStoreProvider } from '@/components/store-context';
import { StoreProvider } from '@/components/store-provider';
import type { ReactNode } from 'react';
import { connected } from '@/lib/connected';

/**
 * Chooses the store mode: full Clerk+Convex sync when configured, or a
 * localStorage-only guest store otherwise (SETUP.md).
 */
export function StoreShell({ children }: { children: ReactNode }) {
  if (connected) return <StoreProvider>{children}</StoreProvider>;
  return <GuestStoreProvider>{children}</GuestStoreProvider>;
}
