import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTitle, StoreLayout } from '@/components/store-layout';

export const metadata: Metadata = { title: 'Returns & refunds' };

export default function ReturnsPage() {
  return (
    <StoreLayout>
      <PageTitle eyebrow="Customer care" title="Returns & refunds" />
      <div className="mx-auto grid max-w-3xl gap-10 px-5 pb-24">
        <section className="panel">
          <h2>The 30-day promise</h2>
          <p className="text-sm leading-relaxed text-[var(--mid)]">
            Unopened lacquers may be returned within 30 days of delivery for a full refund. Write to
            care@maisonvell.example with your order number and we will arrange a complimentary pickup.
          </p>
        </section>
        <section className="panel">
          <h2>How it works</h2>
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed text-[var(--mid)]">
            <li>Email care@maisonvell.example with your order number and reason.</li>
            <li>We reply with a prepaid label and pickup window.</li>
            <li>Hand the parcel to the courier — keep the bottles unopened and sealed.</li>
            <li>Refunds are issued to the original payment method within 5–7 business days of arrival.</li>
          </ol>
        </section>
        <section className="panel">
          <h2>Opened products</h2>
          <p className="text-sm leading-relaxed text-[var(--mid)]">
            For hygiene reasons opened lacquers cannot be resold and are not eligible for return. If a bottle
            arrives damaged or faulty, tell us within 48 hours with a photo and we will replace it immediately.
          </p>
        </section>
        <p className="text-center text-xs uppercase tracking-[0.14em] text-[var(--dim)]">
          See also the <Link href="/refund-policy" className="underline">refund policy</Link> and <Link href="/faq" className="underline">FAQ</Link>
        </p>
      </div>
    </StoreLayout>
  );
}
