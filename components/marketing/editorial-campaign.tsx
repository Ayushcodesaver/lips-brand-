'use client';

import Link from 'next/link';
import { useStore } from '@/components/store-provider';
import styles from './editorial.module.css';
import type { CSSProperties } from 'react';

/* Product crop boxes on public/nail-polish-sprite.webp (2474 x 900).
   Sprite order: 0 Velvet Rouge, 1 Nude Cashmere, 2 Rose Silk,
   3 Champagne Veil, 4 Midnight Noir, 5 Pearl Ivory. */
const PRODUCT_BOXES: ReadonlyArray<readonly [number, number]> = [
  [0, 413],
  [413, 812],
  [812, 1224],
  [1224, 1650],
  [1650, 2055],
  [2055, 2474],
];

const SHEET_W = 2474;
const SHEET_H = 900;
const SPRITE = '/nail-polish-sprite.webp';

type Shade = {
  num: string;
  name: string;
  slug: string;
  shade: string;
  note: string;
  price: string;
  ratio: number;
};

const SHADES: Shade[] = [
  {
    num: 'Shade 01 · High Gloss',
    name: 'Velvet Rouge',
    slug: 'velvet-rouge',
    shade: 'Deep Luxury Red',
    note:
      'The first shade ever mixed in the atelier, and still the one every new colourist must learn. A rich lacquered red with a deep glass-like shine — the red of a theatre curtain just before it rises.',
    price: '$28',
    ratio: 0.459,
  },
  {
    num: 'Shade 02 · Cream',
    name: 'Nude Cashmere',
    slug: 'nude-cashmere',
    shade: 'Warm Nude',
    note:
      'A soft skin-warm nude with a velvety cream finish. Mixed to disappear into the hand and lengthen the fingers — the quietest shade in the collection, and the one most often repurchased.',
    price: '$26',
    ratio: 0.443,
  },
  {
    num: 'Shade 03 · Satin',
    name: 'Rose Silk',
    slug: 'rose-silk',
    shade: 'Dusty Rose',
    note:
      'A muted rose that settles into a quiet satin glow. Neither pink nor brown, it was matched to the inside of a faded silk lining found at a Paris flea market.',
    price: '$27',
    ratio: 0.458,
  },
  {
    num: 'Shade 04 · Fine Shimmer',
    name: 'Champagne Veil',
    slug: 'champagne-veil',
    shade: 'Soft Champagne',
    note:
      'A sheer champagne veil lit with a fine golden shimmer. Worn alone it is barely there; layered over another shade it becomes candlelight.',
    price: '$29',
    ratio: 0.473,
  },
  {
    num: 'Shade 05 · Ultra Gloss',
    name: 'Midnight Noir',
    slug: 'midnight-noir',
    shade: 'Deep Black',
    note:
      'An inky black lacquer with a mirror-bright finish. Three years of pigment trials went into a black that stays black — never grey, never green — in any light.',
    price: '$28',
    ratio: 0.45,
  },
  {
    num: 'Shade 06 · Cream',
    name: 'Pearl Ivory',
    slug: 'pearl-ivory',
    shade: 'Creamy Ivory',
    note:
      'A clean creamy ivory, pure and polished. The hardest shade in the collection to formulate — an opaque white that glides on without a single streak.',
    price: '$26',
    ratio: 0.466,
  },
];

function Bottle({ index, ratio }: { index: number; ratio: number }) {
  const [x0, x1] = PRODUCT_BOXES[index];
  const w = x1 - x0;
  return (
    <div className={styles.bottle} data-bottle={index} style={{ '--r': ratio } as CSSProperties}>
      <svg viewBox={`${x0} 0 ${w} ${SHEET_H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <svg x={x0} y={0} width={w} height={SHEET_H} viewBox={`${x0} 0 ${w} ${SHEET_H}`}>
          <image href={SPRITE} width={SHEET_W} height={SHEET_H} preserveAspectRatio="none" />
        </svg>
      </svg>
    </div>
  );
}

export default function EditorialCampaign() {
  const { items, signedIn } = useStore();
  const bagCount = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.r1}>
          <Link className={`${styles.brand} ${styles.wide}`} href="/" aria-label="Maison Vell Beauty">
            Maison Vell Beauty
          </Link>

          <nav className={`${styles.tabs} ${styles.wide}`} aria-label="Sections">
            <Link href="/">Collection</Link>
            <Link href="/the-maison">The Maison</Link>
            <Link href="/beauty">Beauty</Link>
            <Link className={styles.on} href="/lookbook" aria-current="page">
              Lookbook
            </Link>
            <Link href="/shop">Shop</Link>
          </nav>

          <div className={`${styles.acct} ${styles.wide}`}>
            <Link href={signedIn ? '/account' : '/auth'}>Login</Link>

            <Link href="#" aria-label="Search">
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
              Cart ({bagCount})
            </Link>
          </div>
        </div>

        <nav className={`${styles.r2} ${styles.wide}`} aria-label="Beauty Departments">
          <Link href="/shop">Nail Colour</Link>
          <Link href="/shop">New Arrivals</Link>
          <Link href="/shop">Best Sellers</Link>
          <Link href="/shop">Collections</Link>
          <Link href="/beauty">Beauty Ritual</Link>
          <Link href="/the-maison">Our World</Link>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <p className={`${styles.kicker} ${styles.wide}`}>Lookbook</p>
          <h1 className={styles.wide}>Shade Stories</h1>
          <p className={styles.lede}>
            Six signature lacquers, each with its own temperament. The stories behind the colours
            of the Maison Vell Beauty collection.
          </p>
        </section>

        {SHADES.map((s, i) => (
          <section className={styles.feature} key={s.slug}>
            <div className={styles.fig}>
              <Bottle index={i} ratio={s.ratio} />
            </div>
            <div className={styles.txt}>
              <span className={`${styles.num} ${styles.wide}`}>{s.num}</span>
              <h2 className={styles.wide}>
                <Link href={`/product/${s.slug}`}>{s.name}</Link>
              </h2>
              <p className={`${styles.shade} ${styles.wide}`}>{s.shade}</p>
              <p className={styles.note}>{s.note}</p>
              <p className={styles.price}>{s.price}</p>
              <Link className={`${styles.go} ${styles.wide}`} href={`/product/${s.slug}`}>
                Shop this shade
              </Link>
            </div>
          </section>
        ))}
      </main>

      <footer className={styles.footer}>
        <span className={styles.wide}>Maison Vell Beauty</span>
        <div className={`${styles.links} ${styles.wide}`}>
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
