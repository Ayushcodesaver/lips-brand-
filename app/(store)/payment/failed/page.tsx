import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTitle, StoreLayout } from '@/components/store-layout';

export const metadata: Metadata = { title: 'Payment failed' };

export default function PaymentFailedPage() {
  return (
    <StoreLayout>
      <PageTitle eyebrow="Almost there" title="Payment not completed" />
      <div className="mx-auto grid max-w-3xl gap-10 px-5 pb-24">
        <div className="notice">
          The payment could not be completed — most often the window was closed or the bank declined the
          attempt. <strong className="text-[var(--ink)]">No amount has been charged</strong> and your bag is untouched.
        </div>
        <section className="panel">
          <h2>Things to try</h2>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-[var(--mid)]">
            <li>· Retry the payment — UPI limits reset quickly, and cards occasionally need a second attempt.</li>
            <li>· Switch method: cards, UPI and netbanking behave differently per bank.</li>
            <li>· Choose cash on delivery at checkout — it is always available.</li>
          </ul>
        </section>
        <div className="flex flex-wrap justify-center gap-3">
          <Link className="btn" href="/checkout">Return to checkout</Link>
          <Link className="btn ghost" href="/payment-information">Payment information</Link>
        </div>
      </div>
    </StoreLayout>
  );
}
