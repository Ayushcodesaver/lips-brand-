'use client';

import Link from 'next/link';
import { useStore } from '@/components/store-provider';
import { products as catalog, type ProductTag } from '@/lib/catalog';
import shopStyles from '@/components/marketing/shop.module.css';

const HEART = (
  <svg viewBox="0 0 24 24">
    <path d="M12 20S3.5 15 3.5 9A4.6 4.6 0 0 1 12 6.6 4.6 4.6 0 0 1 20.5 9C20.5 15 12 20 12 20Z" />
  </svg>
);

/** Crops one bottle out of the shared sprite sheet with nested SVGs. */
function BottleCrop({ id, ratio }: { id: number; ratio: string }) {
  const p = catalog[id];
  return (
    <div className={shopStyles.bottle} style={{ '--r': ratio } as React.CSSProperties}>
      <svg viewBox={`${p.x} 0 ${p.width} 900`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <svg x={p.x} y="0" width={p.width} height="900" viewBox={`${p.x} 0 ${p.width} 900`}>
          <image href="/nail-polish-sprite.webp" width="2474" height="900" preserveAspectRatio="none" />
        </svg>
      </svg>
    </div>
  );
}

/**
 * The shop-style card grid, reused by /shop, the collection pages and search.
 */
export function ProductGrid({ tag, items }: { tag?: ProductTag; items?: readonly typeof catalog[number][] }) {
  const { wishlist, add, toggle } = useStore();
  const list = items ?? (tag ? catalog.filter((p) => (p.tags as readonly string[]).includes(tag)) : catalog);

  return (
    <section className={shopStyles.grid} aria-label="Products">
        {list.map((product) => {
          const ratio = (product.width / 900).toFixed(3);
          return (
            <article className={shopStyles.card} key={product.id}>
              <button
                className={shopStyles.fav}
                aria-pressed={wishlist.includes(product.id)}
                aria-label={`Save ${product.name}`}
                onClick={() => toggle(product.id)}
              >
                {HEART}
              </button>
              <BottleCrop id={product.id} ratio={ratio} />
              <div className={shopStyles.meta}>
                <h3 className="wide">
                  <Link href={`/product/${product.slug}`}>{product.name}</Link>
                </h3>
                <span className={shopStyles.shade}>{product.shade}</span>
                <em className={shopStyles.fin} style={{ fontStyle: 'normal' }}>
                  {product.finish} · ${Math.round(product.price / 100)}
                </em>
                <button className={shopStyles.add} aria-label={`Add ${product.name} to bag`} onClick={() => add(product.id)} />
              </div>
            </article>
          );
        })}
    </section>
  );
}
