'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageTitle, StoreLayout } from '@/components/store-layout';
import { ProductGrid } from '@/components/product-grid';
import { products } from '@/lib/catalog';

export default function SearchPage() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');

  const q = query.trim().toLowerCase();
  const matches = q
    ? products.filter((p) =>
        [p.name, p.shade, p.finish, p.note].some((t) => t.toLowerCase().includes(q)),
      )
    : products;

  return (
    <StoreLayout>
      <PageTitle eyebrow="Find your shade" title="Search" />
      <div className="mx-auto max-w-3xl px-5 pb-10">
        <div className="field-grid">
          <label className="col-span-full">
            <span>Search the collection</span>
            <input
              type="search"
              value={query}
              placeholder="Velvet, shimmer, cream…"
              autoFocus
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
          </label>
        </div>
      </div>
      {matches.length > 0 ? (
        <ProductGrid items={matches} />
      ) : (
        <div className="empty">
          <h2>Nothing found</h2>
          <p>No shade matches “{query}”. Try a colour, finish or mood.</p>
          <Link className="btn" href="/shop">Shop the collection</Link>
        </div>
      )}
    </StoreLayout>
  );
}
