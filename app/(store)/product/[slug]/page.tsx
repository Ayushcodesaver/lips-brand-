'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Minus, Plus } from 'lucide-react';
import { PageTitle, Bottle, StoreLayout } from '@/components/store-layout';
import { useStore } from '@/components/store-provider';
import { money, products, productBySlug } from '@/lib/catalog';

const SWATCH: Record<number, string> = {
  0: '#7a1420',
  1: '#caa88f',
  2: '#b97383',
  3: '#d9c39a',
  4: '#14151a',
  5: '#ece4d4',
};

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { add, toggle, wishlist } = useStore();
  const [qty, setQty] = useState(1);

  const product = productBySlug(slug);
  if (!product) {
    return (
      <StoreLayout>
        <div className="empty">
          <h2>Shade not found</h2>
          <p>The lacquer you are looking for is not part of the current collection.</p>
          <Link className="btn" href="/shop">Shop the collection</Link>
        </div>
      </StoreLayout>
    );
  }

  const saved = wishlist.includes(product.id);

  return (
    <StoreLayout>
      <PageTitle eyebrow="The Nail Colour Collection" title={product.name} />
      <div className="mx-auto grid max-w-5xl gap-10 px-5 pb-24 md:grid-cols-2">
        <div className="panel flex items-center justify-center p-10">
          <Bottle id={product.id} />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-sm text-[var(--mid)]">
              {product.shade} · {product.finish}
            </p>
            <p className="wide text-lg">{money(product.price)}</p>
          </div>
          <p className="text-[15px] leading-relaxed text-[var(--mid)]">{product.note}</p>
          <p className="flex items-center gap-2 text-sm text-[var(--mid)]">
            <span className="swatch" style={{ background: SWATCH[product.id] }} />
            21-free formula · 12 ml · vegan &amp; cruelty-free
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.14em] text-[var(--mid)]">Quantity</span>
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                <Minus size={14} />
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity">
                <Plus size={14} />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="btn flex-1"
              onClick={() => {
                for (let i = 0; i < qty; i++) add(product.id);
              }}
            >
              <ShoppingBag size={15} /> Add to bag — {money(product.price * qty)}
            </button>
            <button className="btn ghost" onClick={() => toggle(product.id)} aria-pressed={saved} aria-label="Save to wishlist">
              <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>
          <p className="text-xs text-[var(--dim)]">
            Complimentary shipping on orders over {money(6000)} · <Link href="/shipping" className="underline">Shipping &amp; returns</Link>
          </p>
          <nav className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.14em] text-[var(--dim)]" aria-label="More shades">
            {products
              .filter((p) => p.id !== product.id)
              .map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="hover:text-[var(--ink)]">
                  {p.name}
                </Link>
              ))}
          </nav>
        </div>
      </div>
    </StoreLayout>
  );
}
