import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = { title: 'Terms & Conditions' };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & conditions"
      updated="1 November 2026"
      intro={
        <>
          <p>
            These terms govern your use of the Maison Vell Beauty website and any order you place through it.
            By using the site you accept them.
          </p>
        </>
      }
      sections={[
        {
          h: 'The service',
          ps: [
            <p key="a">We sell nail lacquers and related beauty products for personal use. Product imagery is indicative; colour may vary slightly between screens and batch finishes.</p>,
          ],
        },
        {
          h: 'Orders & acceptance',
          ps: [
            <p key="a">Your order is an offer to buy. An order is accepted — and a contract formed — when we confirm it on the confirmation page or by email.</p>,
            <p key="b">For online payments, the order is recorded only after the payment is verified with our payment provider. For cash on delivery, it is recorded on placement.</p>,
            <p key="c">We may decline an order (for example, where stock is unavailable or an address is not serviceable) with a full refund of any amount paid.</p>,
          ],
        },
        {
          h: 'Prices & payment',
          ps: [
            <p key="a">Prices are displayed in USD; online payments are charged in INR at the rate shown at checkout. Shipping is complimentary over $60, otherwise $5.</p>,
            <p key="b">Cash on delivery orders are payable in cash to the courier at the time of delivery.</p>,
          ],
        },
        {
          h: 'Delivery',
          ps: [
            <p key="a">Dispatch happens within 2 business days; delivery takes 3–7 business days. Risk passes to you on delivery.</p>,
          ],
        },
        {
          h: 'Cancellation, returns & refunds',
          ps: [
            <p key="a">Orders can be cancelled before dispatch by writing to care@maisonvell.example. Unopened products may be returned within the windows set out in our refund policy.</p>,
          ],
        },
        {
          h: 'Acceptable use',
          ps: [
            <p key="a">You agree not to misuse the site, attempt unauthorised access, scrape content commercially, or disrupt the service.</p>,
          ],
        },
        {
          h: 'Liability',
          ps: [
            <p key="a">The site is provided as-is. To the extent permitted by law, our liability for any claim connected to an order is limited to the amount you paid for that order.</p>,
          ],
        },
        {
          h: 'Governing law',
          ps: [
            <p key="a">These terms are governed by the laws applicable at our place of business; disputes will be resolved in the competent courts there.</p>,
          ],
        },
      ]}
    />
  );
}
