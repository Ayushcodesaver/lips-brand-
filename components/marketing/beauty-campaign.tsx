'use client';

import Link from 'next/link';
import { useStore, productCount } from '@/components/store-provider';
import s from './beauty.module.css';

const steps = [
  {
    num: '01',
    title: 'Prepare',
    body: 'Shape with a glass file, always in one direction. Soften cuticles in warm water, push back gently, and buff the nail plate until it is smooth and matte. Colour holds best on a calm surface.',
  },
  {
    num: '02',
    title: 'Base',
    body: 'One thin layer of protective base coat, edge to edge, sealing the free edge of the nail. Let it dry for a full two minutes — patience here is what prevents staining and chipping later.',
  },
  {
    num: '03',
    title: 'Colour',
    body: 'Two thin coats of lacquer, never one thick one. Place the brush a breath away from the cuticle, push toward it, then draw to the tip in a single stroke. Three strokes per nail; five minutes between coats.',
  },
  {
    num: '04',
    title: 'Seal',
    body: 'Finish with the high-shine top coat, wrapping the free edge. Refresh it every two to three days and the manicure keeps its glass finish for a week or more.',
  },
];

const depts = [
  { label: 'Nail Colour', note: 'Six signature shades' },
  { label: 'New Arrivals', note: 'The latest from the atelier' },
  { label: 'Best Sellers', note: 'Most loved' },
  { label: 'Collections', note: 'Curated edits' },
];

export default function BeautyCampaign() {
  const { items, signedIn } = useStore();
  const count = productCount(items);

  return (
    <div className={s.root}>
      <header className={s.header}>
        <div className={s.r1}>
          <Link className={`${s.brand} ${s.wide}`} href="/" aria-label="Maison Vell Beauty">
            Maison Vell Beauty
          </Link>

          <nav className={`${s.tabs} ${s.wide}`} aria-label="Sections">
            <Link href="/">Collection</Link>
            <Link href="/the-maison">The Maison</Link>
            <Link className={s.on} href="/beauty" aria-current="page">
              Beauty
            </Link>
            <Link href="/lookbook">Lookbook</Link>
            <Link href="/shop">Shop</Link>
          </nav>

          <div className={`${s.acct} ${s.wide}`}>
            <Link href={signedIn ? '/account' : '/auth'}>Login</Link>

            <Link href="/search" aria-label="Search">
              <svg viewBox="0 0 24 24">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m15.5 15.5 5 5" />
              </svg>
            </Link>

            <Link href="/wishlist" aria-label="Wishlist">
              <svg viewBox="0 0 24 24">
                <path d="M12 20S3.5 15 3.5 9A4.6 4.6 0 0 1 12 6.6 4.6 4.6 0 0 1 20.5 9C20.5 15 12 20 12 20Z" />
              </svg>
            </Link>

            <Link href="/bag" aria-label="Bag">
              <svg viewBox="0 0 24 24">
                <path d="M5 8h14l1 13H4Z" />
                <path d="M9 10V6a3 3 0 0 1 6 0v4" />
              </svg>
            </Link>

            <Link href="/bag">
              Cart (<span>{count}</span>)
            </Link>
          </div>
        </div>

        <nav className={`${s.r2} ${s.wide}`} aria-label="Beauty Departments">
          <Link href="/shop">Nail Colour</Link>
          <Link href="/shop">New Arrivals</Link>
          <Link href="/shop">Best Sellers</Link>
          <Link href="/shop">Collections</Link>
          <Link href="/beauty">Beauty Ritual</Link>
          <Link href="/the-maison">Our World</Link>
        </nav>
      </header>

      <main>
        <section className={s.hero}>
          <p className={`${s.kicker} ${s.wide}`}>Beauty Ritual</p>
          <h1 className={s.wide}>The Ritual</h1>
          <p className={s.lede}>
            A Maison Vell manicure is unhurried. Four steps, ten minutes, and a finish that holds its shine for a week
            or more.
          </p>
        </section>

        <section className={s.steps} aria-label="The four steps of the beauty ritual">
          {steps.map((step) => (
            <div className={s.step} key={step.num}>
              <b>{step.num}</b>
              <h2 className={s.wide}>{step.title}</h2>
              <p>{step.body}</p>
            </div>
          ))}
        </section>

        <section className={s.depts}>
          <h2 className={s.wide}>Departments</h2>
          <ul>
            {depts.map((dept) => (
              <li key={dept.label}>
                <Link className={s.wide} href="/shop">
                  {dept.label} <span>{dept.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className={s.footer}>
        <span className={s.wide}>Maison Vell Beauty</span>
        <div className={`${s.links} ${s.wide}`}>
          <Link href="/">Collection</Link>
          <Link href="/the-maison">The Maison</Link>
          <Link href="/beauty">Beauty</Link>
          <Link href="/lookbook">Lookbook</Link>
          <Link href="/shop">Shop</Link>
        </div>
        <span>© 2026 Maison Vell Beauty, Paris</span>
      </footer>
    </div>
  );
}
