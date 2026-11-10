'use client';

import Link from 'next/link';
import { useStore, productCount } from '@/components/store-provider';
import s from './the-maison.module.css';

const values = [
  {
    title: 'Craft',
    body: 'Small batches, hand-mixed pigment and a seventy-two hour rest. Nothing leaves the atelier until the colour is exactly itself.',
  },
  {
    title: 'Colour',
    body: 'Six signature shades, chosen to endure. Depth over novelty, quiet luxury over trend.',
  },
  {
    title: 'Care',
    body: 'A twenty-one free formula, cruelty free from the first batch, in recyclable glass with minimal packaging.',
  },
];

const numbers = [
  { value: '1987', label: 'Founded in Paris' },
  { value: '06', label: 'Signature shades' },
  { value: '21-Free', label: 'Clean formula' },
  { value: '72h', label: 'Small-batch rest' },
];

export default function TheMaisonStory() {
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
            <Link className={s.on} href="/the-maison" aria-current="page">
              The Maison
            </Link>
            <Link href="/beauty">Beauty</Link>
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
          <p className={`${s.kicker} ${s.wide}`}>Our World</p>
          <h1 className={s.wide}>The Maison</h1>
          <p className={s.lede}>
            Founded in Paris in 1987, Maison Vell Beauty began as a small atelier devoted to a single idea: that
            colour, mixed by hand and worn on the fingertips, could be as considered as couture.
          </p>
        </section>

        <section className={s.story}>
          <div>
            <h2 className={s.wide}>The Atelier</h2>
            <p>
              Every Maison Vell shade begins as a pigment study on paper, mixed by hand in our Paris atelier.
              Colourists work in small batches, resting each lacquer for seventy-two hours so the pigment settles into
              its true depth before a single bottle is filled.
            </p>
            <p>
              The collection is deliberately narrow. We release few shades and keep them for years, believing that a
              signature colour — like a signature scent — is found, not chased.
            </p>
          </div>
          <div>
            <h2 className={s.wide}>The Formula</h2>
            <p>
              Our lacquer is twenty-one free: formulated without the twenty-one ingredients most commonly questioned
              in nail colour, without compromising shine, coverage or wear.
            </p>
            <p>
              Each bottle is glass, weighted to sit low in the hand, with a flat precision brush cut to follow the
              curve of the nail in a single stroke.
            </p>
          </div>
        </section>

        <section className={s.values}>
          {values.map((value) => (
            <article key={value.title}>
              <h3 className={s.wide}>{value.title}</h3>
              <p>{value.body}</p>
            </article>
          ))}
        </section>

        <section className={`${s.numbers} ${s.wide}`}>
          {numbers.map((stat) => (
            <div key={stat.value}>
              <b>{stat.value}</b>
              <span>{stat.label}</span>
            </div>
          ))}
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
