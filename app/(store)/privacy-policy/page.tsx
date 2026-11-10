import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy policy"
      updated="1 November 2026"
      intro={
        <>
          <p>
            Maison Vell Beauty (&ldquo;we&rdquo;) respects your privacy. This policy explains what we collect when you
            browse or buy, why we collect it, and the rights you have over it.
          </p>
          <p>This policy applies to this website only. It is provided for information and is not legal advice.</p>
        </>
      }
      sections={[
        {
          h: 'What we collect',
          ps: [
            <p key="a">Account data you give us: name, email address and saved shipping addresses.</p>,
            <p key="b">Order data: items purchased, amounts, delivery address and payment status (never full card numbers — those stay with our payment provider).</p>,
            <p key="c">Bag and wishlist contents, to sync your selection across devices when you are signed in.</p>,
          ],
        },
        {
          h: 'Why we use it',
          ps: [
            <p key="a">To create your account, place and deliver orders, and provide customer care.</p>,
            <p key="b">To remember your bag and wishlist between visits.</p>,
            <p key="c">We do not sell your personal data or use it for third-party advertising.</p>,
          ],
        },
        {
          h: 'Who processes it',
          ps: [
            <p key="a"><strong>Authentication</strong> — Clerk holds your sign-in credentials securely.</p>,
            <p key="b"><strong>Database</strong> — Convex stores your profile, addresses, bag and orders.</p>,
            <p key="c"><strong>Payments</strong> — Cashfree Payments processes UPI, card and netbanking transactions under its own privacy policy.</p>,
          ],
        },
        {
          h: 'Your rights',
          ps: [
            <p key="a">You can view, correct and delete your profile, addresses and bag at any time in your account. You can request a copy or deletion of your order history by writing to care@maisonvell.example.</p>,
            <p key="b">You can delete your account, which removes your profile and associated data, by contacting support.</p>,
          ],
        },
        {
          h: 'Cookies & local storage',
          ps: [
            <p key="a">We use browser local storage for the guest bag and wishlist, and authentication cookies for your session. No advertising or analytics trackers are set.</p>,
          ],
        },
      ]}
    />
  );
}
