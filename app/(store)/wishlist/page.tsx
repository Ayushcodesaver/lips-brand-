'use client';

import Link from 'next/link';
import { ShoppingBag, X } from 'lucide-react';
import { PageTitle, StoreLayout, Bottle } from '@/components/store-layout';
import { useStore } from '@/components/store-provider';
import { money, products } from '@/lib/catalog';

export default function WishlistPage() {
  const { wishlist, toggle, add } = useStore();

  if (wishlist.length === 0) {
    return (
      <StoreLayout>
        <div className="empty">
          <h2>Nothing saved yet</h2>
          <p>Tap the heart on any lacquer to keep it here for later.</p>
          <Link className="btn" href="/shop">Shop the collection</Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <PageTitle eyebrow="Saved for later" title="Wishlist" />
      <div className="mx-auto grid max-w-5xl gap-10 px-5 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map((id) => {
          const product = products[id];
          if (!product) return null;
          return (
            <div className="panel flex flex-col items-center gap-4 text-center" key={id}>
              <Link href={`/product/${product.slug}`} className="w-full max-w-[220px]">
                <Bottle id={id} />
              </Link>
              <Link href={`/product/${product.slug}`} className="name">{product.name}</Link>
              <p className="text-sm text-[var(--mid)]">{money(product.price)}</p>
              <div className="flex gap-2">
                <button className="btn small" onClick={() => add(id)}>
                  <ShoppingBag size={13} /> Add to bag
                </button>
                <button className="btn small ghost" onClick={() => toggle(id)} aria-label="Remove from wishlist">
                  <X size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </StoreLayout>
  );
}
