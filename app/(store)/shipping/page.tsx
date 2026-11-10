import { PageTitle, StoreLayout } from '@/components/store-layout';
import Link from 'next/link';

export const metadata = { title: 'Shipping & returns' };

export default function ShippingPage() {
  return (
    <StoreLayout>
      <PageTitle eyebrow="Customer care" title="Shipping & returns" />
      <div className="mx-auto grid max-w-3xl gap-10 px-5 pb-24">
        <section className="panel">
          <h2>Shipping</h2>
          <div className="flex flex-col gap-4 text-sm leading-relaxed text-[var(--mid)]">
            <p>
              Orders are prepared within 2 business days and delivered in 3–7 business days across India via our
              courier partners. Every order ships in a protective Maison Vell box.
            </p>
            <p>
              Shipping is <strong className="text-[var(--ink)]">complimentary on orders over $60</strong>; otherwise a
              flat $5 applies. Amounts are charged in INR for online payments at the prevailing rate shown at checkout.
            </p>
            <p>Tracking is shared by email as soon as the parcel leaves the atelier.</p>
          </div>
        </section>
        <section className="panel">
          <h2>Returns</h2>
          <div className="flex flex-col gap-4 text-sm leading-relaxed text-[var(--mid)]">
            <p>
              Unopened lacquers may be returned within 14 days of delivery for a full refund. Write to
              care@maisonvell.example with your order number and we will arrange a pickup.
            </p>
            <p>Refunds are issued to the original payment method within 5–7 business days of the parcel reaching us.</p>
          </div>
        </section>
        <section className="panel">
          <h2>Cash on delivery</h2>
          <p className="text-sm leading-relaxed text-[var(--mid)]">
            COD is available on all serviceable pin codes. Please keep the exact amount ready — our courier partners
            carry limited change.
          </p>
        </section>
        <p className="text-center text-xs uppercase tracking-[0.14em] text-[var(--dim)]">
          Questions? See the <Link href="/faq" className="underline">FAQ</Link> or write to care@maisonvell.example
        </p>
      </div>
    </StoreLayout>
  );
}
