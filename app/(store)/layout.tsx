import { StoreShell } from '@/components/store-shell';
import type { ReactNode } from 'react';

/**
 * All commerce pages render on demand (no static prerender): they depend on
 * live Clerk/Convex sessions, so `next build` succeeds even before the
 * developer's keys are configured (see SETUP.md).
 */
export const dynamic = 'force-dynamic';

export default function StoreShellLayout({ children }: { children: ReactNode }) {
  return <StoreShell>{children}</StoreShell>;
}
