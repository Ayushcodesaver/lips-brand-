'use client';

import Link from 'next/link';
import { useStore } from '@/components/store-provider';
import { products } from '@/lib/catalog';
import styles from './shop.module.css';

const HEART = (
  <svg viewBox="0 0 24 24">
    <path d="M12 20S3.5 15 3.5 9A4.6 4.6 0 0 1 12 6.6 4.6 4.6 0 0 1 20.5 9C20.5 15 12 20 12 20Z" />
  </svg>
);

const BAG = (
  <svg viewBox="0 0 24 24">
    <path d="M5 8h14l1 13H4Z" />
    <path d="M9 10V6a3 3 0 0 1 6 0v4" />
  </svg>
);

/** Crops one bottle out of the shared sprite sheet with nested SVGs. */
function BottleCrop({ id, ratio }: { id: number; ratio: string }) {
  const p = products[id];
  return (
    <div className={styles.bottle} style={{ '--r': ratio } as React.CSSProperties}>
      <svg viewBox={`${p.x} 0 ${p.width} 900`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <svg x={p.x} y="0" width={p.width} height="900" viewBox={`${p.x} 0 ${p.width} 900`}>
          <image href="/nail-polish-sprite.webp" width="2474" height="900" preserveAspectRatio="none" />
        </svg>
      </svg>
    </div>
  );
}

export default function ShopCollection() {
  const { items, wishlist, add, toggle, signedIn } = useStore();
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.r1}>
          <Link className={`${styles.brand} wide`} href="/" aria-label="Maison Vell Beauty">
            Maison Vell Beauty
          </Link>
          <nav className={`${styles.tabs} wide`} aria-label="Sections">
            <Link href="/">Collection</Link>
            <Link href="/the-maison">The Maison</Link>
            <Link href="/beauty">Beauty</Link>
            <Link href="/lookbook">Lookbook</Link>
            <Link className={styles.on} href="/shop" aria-current="page">Shop</Link>
          </nav>
          <div className={`${styles.acct} wide`}>
            <Link href={signedIn ? '/account' : '/auth'}>Login</Link>
            <Link href="/search" aria-label="Search">
              <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>
            </Link>
            <Link href="/wishlist" aria-label="Wishlist">{HEART}</Link>
            <Link href="/bag" aria-label="Bag">{BAG}</Link>
            <Link href="/bag">Cart (<span>{count}</span>)</Link>
          </div>
        </div>
        <nav className={`${styles.r2} wide`} aria-label="Beauty Departments">
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
          <div>
            <h1 className="wide">The Collection</h1>
            <p>Six signature nail lacquers · 21-free formula · 12 ml</p>
          </div>
        </section>

        <section className={styles.grid} aria-label="Products">
          {products.map((product) => {
            const ratio = (product.width / 900).toFixed(3);
            return (
              <article className={styles.card} key={product.id}>
                <button
                  className={styles.fav}
                  aria-pressed={wishlist.includes(product.id)}
                  aria-label={`Save ${product.name}`}
                  onClick={() => toggle(product.id)}
                >
                  {HEART}
                </button>
                <BottleCrop id={product.id} ratio={ratio} />
                <div className={styles.meta}>
                  <h3 className="wide">
                    <Link href={`/product/${product.slug}`}>{product.name}</Link>
                  </h3>
                  <span className={styles.shade}>{product.shade}</span>
                  <em className={styles.fin} style={{ fontStyle: 'normal' }}>
                    {product.finish} · ${Math.round(product.price / 100)}
                  </em>
                  <button className={styles.add} aria-label={`Add ${product.name} to bag`} onClick={() => add(product.id)} />
                </div>
              </article>
            );
          })}
        </section>

        <p className={`${styles.note} wide`}>Complimentary shipping on orders over $60 · Free returns within 30 days</p>
      </main>

      <footer className={styles.footer}>
        <span className="wide">Maison Vell Beauty</span>
        <div className={`${styles.links} wide`}>
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
