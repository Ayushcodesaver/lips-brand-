import type { Metadata } from 'next';
import Link from 'next/link';
import { PageTitle, StoreLayout } from '@/components/store-layout';

export const metadata: Metadata = { title: 'Nail care guide' };

const RITUAL = [
  { step: '01', title: 'Prepare', text: 'Clean nails with a gentle, acetone-free remover. Push back — never cut — the cuticles.' },
  { step: '02', title: 'Base', text: 'One thin layer of the included base coat. It protects the nail and gives the colour grip.' },
  { step: '03', title: 'Colour', text: 'Two thin layers, letting each dry for two minutes. Thin layers cure better than one thick one.' },
  { step: '04', title: 'Seal', text: 'Finish with the top coat, capping the free edge to lock in the glass-like shine.' },
  { step: '05', title: 'Maintain', text: 'Reapply top coat every third day. Moisturise cuticles nightly with a drop of oil.' },
];

export default function NailCarePage() {
  return (
    <StoreLayout>
      <PageTitle eyebrow="Customer care" title="The nail care guide" />
      <div className="mx-auto grid max-w-3xl gap-6 px-5 pb-24">
        {RITUAL.map((r) => (
          <section className="panel flex gap-6" key={r.step}>
            <span className="wide text-2xl text-[var(--dim)]">{r.step}</span>
            <div>
              <h2>{r.title}</h2>
              <p className="text-sm leading-relaxed text-[var(--mid)]">{r.text}</p>
            </div>
          </section>
        ))}
        <p className="text-center text-xs uppercase tracking-[0.14em] text-[var(--dim)]">
          Discover the formula on the <Link href="/beauty" className="underline">Beauty</Link> page
        </p>
      </div>
    </StoreLayout>
  );
}
