import Link from 'next/link';

/** Branded 404 — replaces the framework's default not-found screen. */
export default function NotFound() {
  return (
    <div className="empty">
      <p className="t-eyebrow" style={{ marginBottom: 14 }}>
        Error 404
      </p>
      <h2>This page is not part of the collection</h2>
      <p>The address you followed doesn&apos;t exist — but six signature lacquers do.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link className="btn" href="/">
          Back to the collection
        </Link>
        <Link className="btn ghost" href="/shop">
          Shop the shades
        </Link>
      </div>
    </div>
  );
}
