'use client';

import { usePathname } from 'next/navigation';
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import { useAuth } from '@clerk/nextjs';
import { Toaster } from 'sonner';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { GuestStoreProvider } from '@/components/store-context';
import { connected } from '@/lib/connected';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? '';

const convex = new ConvexReactClient(CONVEX_URL || 'https://placeholder.convex.cloud');

const SETUP_REQUIRED = ['/account', '/checkout', '/order', '/auth'];

function SetupNotice({ path }: { path: string }) {
  return (
    <div className="empty">
      <h2>Setup required</h2>
      <p>
        <code>{path}</code> needs Clerk + Convex credentials before it can open.
        Follow the three steps in <strong>SETUP.md</strong> at the root of this project — accounts,
        database and payments unlock together.
      </p>
      <Link className="btn" href="/">
        Back to the collection
      </Link>
    </div>
  );
}

function GuestMode({ children }: { children: ReactNode }) {
  const path = usePathname() ?? '/';
  const blocked = SETUP_REQUIRED.some((p) => path === p || path.startsWith(`${p}/`));
  return (
    <GuestStoreProvider>
      {blocked ? <SetupNotice path={path} /> : children}
      <Toaster position="top-center" />
    </GuestStoreProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  if (!connected) return <GuestMode>{children}</GuestMode>;

  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
        <Toaster position="top-center" />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
