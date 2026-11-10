import type { ReactNode } from 'react';
import { PageTitle, StoreLayout } from '@/components/store-layout';

export type LegalSection = { h: string; ps: ReactNode[] };

/**
 * Shared layout for the policy pages: title + numbered sections.
 */
export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <StoreLayout>
      <PageTitle eyebrow={eyebrow} title={title} />
      <div className="mx-auto grid max-w-3xl gap-10 px-5 pb-24">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--dim)]">Last updated — {updated}</p>
        <section className="panel">
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-[var(--mid)]">{intro}</div>
        </section>
        {sections.map((s, i) => (
          <section className="panel" key={s.h}>
            <h2>
              {String(i + 1).padStart(2, '0')} · {s.h}
            </h2>
            <div className="flex flex-col gap-3 text-sm leading-relaxed text-[var(--mid)]">{s.ps}</div>
          </section>
        ))}
        <p className="text-center text-xs uppercase tracking-[0.14em] text-[var(--dim)]">
          Questions about this policy? Write to care@maisonvell.example
        </p>
      </div>
    </StoreLayout>
  );
}
