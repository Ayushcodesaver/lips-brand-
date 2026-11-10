'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { PageTitle, StoreLayout, Bottle } from '@/components/store-layout';
import { useStore } from '@/components/store-provider';
import { money, products, totals } from '@/lib/catalog';

export default function BagPage() {
  const { items, quantity } = useStore();
  const t = totals(items);

  if (items.length === 0) {
    return (
      <StoreLayout>
        <div className="empty">
          <h2>Your bag is empty</h2>
          <p>Six signature lacquers are waiting in the collection.</p>
          <Link className="btn" href="/shop">Shop the collection</Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <PageTitle eyebrow="Your selection" title="Shopping bag" />
      <div className="mx-auto grid max-w-5xl gap-10 px-5 pb-24 md:grid-cols-[1fr_320px]">
        <div className="panel">
          {items.map((item) => {
            const product = products[item.productId];
            if (!product) return null;
            return (
              <div className="line-item" key={item.productId}>
                <Link href={`/product/${product.slug}`} aria-label={product.name}>
                  <Bottle id={product.id} />
                </Link>
                <div>
                  <Link href={`/product/${product.slug}`} className="name">{product.name}</Link>
                  <p className="meta">{product.shade} · {product.finish} · {money(product.price)}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="qty">
                      <button onClick={() => quantity(item.productId, item.quantity - 1)} aria-label="Decrease quantity"><Minus size={13} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => quantity(item.productId, item.quantity + 1)} aria-label="Increase quantity"><Plus size={13} /></button>
                    </div>
                    <button
                      className="flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-[var(--dim)] hover:text-[var(--ink)]"
                      onClick={() => quantity(item.productId, 0)}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
                <p className="price">{money(product.price * item.quantity)}</p>
              </div>
            );
          })}
        </div>
        <aside className="panel h-fit">
          <h2>Summary</h2>
          <div className="totals">
            <div className="row"><span>Subtotal</span><span>{money(t.subtotal)}</span></div>
            <div className="row"><span>Shipping</span><span>{t.shipping ? money(t.shipping) : 'Complimentary'}</span></div>
            <div className="row grand"><span>Total</span><span>{money(t.total)}</span></div>
          </div>
          <Link href="/checkout" className="btn mt-6 w-full">Checkout</Link>
          <p className="mt-4 text-center text-xs text-[var(--dim)]">
            or <Link href="/shop" className="underline">continue shopping</Link>
          </p>
        </aside>
      </div>
    </StoreLayout>
  );
}
