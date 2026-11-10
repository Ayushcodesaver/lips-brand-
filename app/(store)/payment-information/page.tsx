import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTitle, StoreLayout } from '@/components/store-layout';

export const metadata: Metadata = { title: 'Payment information' };

export default function PaymentInformationPage() {
  return (
    <StoreLayout>
      <PageTitle eyebrow="Customer care" title="Payment information" />
      <div className="mx-auto grid max-w-3xl gap-10 px-5 pb-24">
        <section className="panel">
          <h2>Accepted methods</h2>
          <p className="text-sm leading-relaxed text-[var(--mid)]">
            Online payments accept <strong className="text-[var(--ink)]">UPI, credit and debit cards, and netbanking</strong>,
            processed securely through Cashfree Payments. Cash on delivery is available across India on all
            serviceable pin codes.
          </p>
        </section>
        <section className="panel">
          <h2>Currency</h2>
          <p className="text-sm leading-relaxed text-[var(--mid)]">
            Prices are shown in USD for browsing. Online payments are charged in <strong className="text-[var(--ink)]">Indian Rupees</strong>;
            the equivalent amount is shown at checkout before you confirm, using the rate displayed on the review step.
          </p>
        </section>
        <section className="panel">
          <h2>Security</h2>
          <p className="text-sm leading-relaxed text-[var(--mid)]">
            Card details are entered inside Cashfree&apos;s certified payment window and never touch our servers.
            Every order is verified with Cashfree before it is confirmed, and the paid amount is recorded on your receipt.
          </p>
        </section>
        <section className="panel">
          <h2>When a payment fails</h2>
          <p className="text-sm leading-relaxed text-[var(--mid)]">
            If a payment is declined or interrupted, nothing is charged and your bag is preserved —
            simply return to checkout and try again or choose cash on delivery. Details live on the{' '}
            <Link href="/payment/failed" className="underline">payment failed</Link> page.
          </p>
        </section>
      </div>
    </StoreLayout>
  );
}
