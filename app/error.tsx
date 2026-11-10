'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * Branded route-level error boundary (Experience Design contract, phase 1).
 * Convex query errors bubble here — the visitor gets the maison's voice and a
 * real retry instead of the framework's default crash screen.
 */
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surfaced for support: the digest maps to the server-side log entry.
    console.error('[maison-vell] route error', error.digest ?? error.message);
  }, [error]);

  return (
    <div className="empty">
      <h2>The maison apologises</h2>
      <p>
        Something interrupted this page on our side — nothing was charged and your bag is untouched.
        {error.digest ? <span className="block mt-2 t-meta">Reference: {error.digest}</span> : null}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button className="btn" onClick={reset}>
          Try again
        </button>
        <Link className="btn ghost" href="/">
          Back to the collection
        </Link>
      </div>
    </div>
  );
}
