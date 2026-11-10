import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTitle, StoreLayout } from '@/components/store-layout';

export const metadata: Metadata = { title: 'Payment successful' };

export default function PaymentSuccessPage() {
  return (
    <StoreLayout>
      <PageTitle eyebrow="Thank you" title="Payment successful" />
      <div className="mx-auto grid max-w-3xl gap-10 px-5 pb-24">
        <div className="notice">
          Your payment has been received and your order is confirmed. A receipt now lives in your account.
        </div>
        <section className="panel">
          <h2>What happens next</h2>
          <p className="text-sm leading-relaxed text-[var(--mid)]">
            Your lacquers are prepared within 2 business days and dispatched in a protective Maison Vell box.
            Tracking is shared by email the moment the parcel leaves the atelier.
          </p>
        </section>
        <div className="flex flex-wrap justify-center gap-3">
          <Link className="btn" href="/account/orders">View my orders</Link>
          <Link className="btn ghost" href="/shop">Continue shopping</Link>
        </div>
      </div>
    </StoreLayout>
  );
}
