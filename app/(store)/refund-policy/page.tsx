import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = { title: 'Refund Policy' };

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund policy"
      updated="1 November 2026"
      intro={
        <>
          <p>
            We want every unboxing to feel right. If something is wrong with your order, this policy explains
            exactly when and how we refund.
          </p>
        </>
      }
      sections={[
        {
          h: 'Eligible for a refund',
          ps: [
            <p key="a">Unopened, sealed lacquers returned within 30 days of delivery.</p>,
            <p key="b">Damaged or faulty products reported within 48 hours of delivery (with a photo) — refunded or replaced at your choice.</p>,
            <p key="c">Orders cancelled before dispatch — refunded in full, including shipping.</p>,
          ],
        },
        {
          h: 'Not eligible',
          ps: [
            <p key="a">Opened or used products, for hygiene reasons.</p>,
            <p key="b">Returns requested after the 30-day window.</p>,
            <p key="c">Cash-on-delivery orders refused at the door without contacting us first (courier costs may be deducted).</p>,
          ],
        },
        {
          h: 'How refunds are issued',
          ps: [
            <p key="a"><strong>Online payments</strong> — refunded to the original payment method within 5–7 business days of the returned parcel reaching us.</p>,
            <p key="b"><strong>Cash on delivery</strong> — refunded by bank transfer to an account you nominate, in the same window.</p>,
          ],
        },
        {
          h: 'Return shipping',
          ps: [
            <p key="a">Complimentary for damaged or faulty goods and for order cancellations. For change-of-mind returns, a flat return fee of $5 may be deducted from the refund.</p>,
          ],
        },
        {
          h: 'How to start',
          ps: [
            <p key="a">Email care@maisonvell.example with your order number and reason. We reply with a prepaid label and pickup window within one business day.</p>,
          ],
        },
      ]}
    />
  );
}
