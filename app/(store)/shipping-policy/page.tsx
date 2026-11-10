import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = { title: 'Shipping Policy' };

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Shipping policy"
      updated="1 November 2026"
      intro={
        <>
          <p>
            Every order leaves the atelier in a protective Maison Vell box, cushioned so the glass travels safely.
          </p>
        </>
      }
      sections={[
        {
          h: 'Dispatch times',
          ps: [
            <p key="a">Orders are prepared and dispatched within 2 business days (excluding public holidays). You receive tracking by email the moment the parcel ships.</p>,
          ],
        },
        {
          h: 'Delivery estimates',
          ps: [
            <p key="a">3–7 business days across serviceable pin codes in India. Limited-edition atelier releases may take 1–2 additional business days.</p>,
          ],
        },
        {
          h: 'Shipping charges',
          ps: [
            <p key="a">Complimentary shipping on orders over $60 (subtotal). Otherwise a flat $5 per order. The charge is shown at checkout before you pay.</p>,
          ],
        },
        {
          h: 'Cash on delivery',
          ps: [
            <p key="a">Available on all serviceable pin codes. Please keep exact change ready — couriers carry limited cash. Repeated refusal of COD deliveries may limit COD on the account.</p>,
          ],
        },
        {
          h: 'Undeliverable parcels',
          ps: [
            <p key="a">If a parcel cannot be delivered after repeated attempts and returns to us, we refund the order minus shipping where the address or contact details were incorrect. We will always try to contact you first.</p>,
          ],
        },
        {
          h: 'International delivery',
          ps: [
            <p key="a">We currently deliver within India only. Write to care@maisonvell.example to be notified when your country becomes serviceable.</p>,
          ],
        },
      ]}
    />
  );
}
