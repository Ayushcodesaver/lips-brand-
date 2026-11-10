import { PageTitle, StoreLayout } from '@/components/store-layout';

export const metadata = { title: 'FAQ' };

const QA: Array<{ q: string; a: string }> = [
  { q: 'What is the 21-free formula?', a: 'Our lacquers are formulated without 21 controversial ingredients — including formaldehyde, toluene and DBP — while keeping a deep, lacquer-like shine. Vegan and never tested on animals.' },
  { q: 'How long does one bottle last?', a: 'Each 12 ml bottle carries roughly 60 applications with the included brush, engineered for a single clean stroke.' },
  { q: 'Which payment methods can I use?', a: 'Online payments accept UPI, credit and debit cards, and netbanking through Cashfree. Cash on delivery is available across India.' },
  { q: 'In which currency am I charged?', a: 'Prices are shown in USD for browsing; online payments are charged in Indian Rupees at the rate displayed at checkout before you pay.' },
  { q: 'When will my order arrive?', a: 'Orders leave the atelier within 2 business days and arrive in 3–7 business days. You receive tracking by email the moment the parcel ships.' },
  { q: 'Is the packaging recyclable?', a: 'Yes — the glass bottles, aluminium caps and paper boxes are all recyclable. The outer mailer is plastic-free.' },
  { q: 'How do I care for my manicure?', a: 'Apply the included base coat, two thin layers of colour, and the top coat. Reapply top coat every third day to keep the glass-like finish.' },
  { q: 'Can I change my address after ordering?', a: 'Write to care@maisonvell.example within 12 hours of placing the order and we will update it before dispatch.' },
];

export default function FaqPage() {
  return (
    <StoreLayout>
      <PageTitle eyebrow="Customer care" title="Frequently asked" />
      <div className="mx-auto grid max-w-3xl gap-4 px-5 pb-24">
        {QA.map((item) => (
          <section className="panel" key={item.q}>
            <h2>{item.q}</h2>
            <p className="text-sm leading-relaxed text-[var(--mid)]">{item.a}</p>
          </section>
        ))}
      </div>
    </StoreLayout>
  );
}
