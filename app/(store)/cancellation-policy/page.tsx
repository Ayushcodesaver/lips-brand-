import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = { title: 'Cancellation Policy' };

export default function CancellationPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cancellation policy"
      updated="1 November 2026"
      intro={
        <>
          <p>
            Plans change. Here is how cancellation works at each stage of your order&apos;s journey.
          </p>
        </>
      }
      sections={[
        {
          h: 'Before dispatch',
          ps: [
            <p key="a">Cancel any time before your parcel is dispatched by writing to care@maisonvell.example with your order number — or, for online payments that have not yet been verified, simply abandon the payment: nothing is charged.</p>,
            <p key="b">Cancellation before dispatch is always free and refunds the full amount paid.</p>,
          ],
        },
        {
          h: 'After dispatch',
          ps: [
            <p key="a">Once a parcel is with the courier it can no longer be cancelled, but you may refuse delivery or use the standard 30-day return window for unopened products.</p>,
          ],
        },
        {
          h: 'Refund timing',
          ps: [
            <p key="a"><strong>Online payments</strong> — full refund to the original payment method within 5–7 business days of cancellation.</p>,
            <p key="b"><strong>Cash on delivery</strong> — nothing to refund if cancelled before payment; COD orders cancelled in transit incur no charge.</p>,
          ],
        },
        {
          h: 'Cancellations by us',
          ps: [
            <p key="a">We may cancel an order where stock becomes unavailable, an address is not serviceable, or payment verification fails. You are notified by email and any amount paid is refunded in full.</p>,
          ],
        },
      ]}
    />
  );
}
