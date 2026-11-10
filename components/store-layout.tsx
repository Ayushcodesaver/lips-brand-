'use client';

import Link from 'next/link';
import { Heart, ShoppingBag, UserRound, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useStore, productCount } from './store-provider';
import { products } from '@/lib/catalog';

/** A single bottle cropped out of the shared sprite sheet. */
export function Bottle({ id, className = '' }: { id: number; className?: string }) {
  const p = products[id];
  if (!p) return null;
  return (
    <svg className={`product-bottle ${className}`} viewBox={`${p.x} 0 ${p.width} 900`} role="img" aria-label={`${p.name} nail lacquer`}>
      <svg x={p.x} y="0" width={p.width} height="900" viewBox={`${p.x} 0 ${p.width} 900`}>
        <image href="/nail-polish-sprite.webp" width="2474" height="900" preserveAspectRatio="none" />
      </svg>
    </svg>
  );
}

export function StoreLayout({ children }: { children: ReactNode }) {
  const { signedIn, items } = useStore();
  const count = productCount(items);
  return (
    <div className="min-h-screen">
      <header className="store-header">
        <Link href="/" className="wordmark">
          MAISON VELL <span>BEAUTY</span>
        </Link>
        <nav className="store-nav" aria-label="Store">
          <Link href="/shop">Shop</Link>
          <Link href="/shades">Collections</Link>
          <Link href="/lookbook">Lookbook</Link>
          <Link href="/beauty">Beauty</Link>
          <Link href="/the-maison">The Maison</Link>
          <Link href="/editorial">Editorial</Link>
        </nav>
        <div className="store-actions">
          <Link href="/search" className="icon-link" aria-label="Search" title="Search">
            <Search />
          </Link>
          <Link href={signedIn ? '/account' : '/auth'} className="icon-link" aria-label={signedIn ? 'My account' : 'Sign in'} title={signedIn ? 'My account' : 'Sign in'}>
            <UserRound />
          </Link>
          <Link href="/wishlist" className="icon-link" aria-label="Wishlist" title="Wishlist">
            <Heart />
          </Link>
          <Link href="/bag" className="icon-link" aria-label={`Bag (${count})`} title="Bag">
            <ShoppingBag />
            <span className="badge">{count}</span>
          </Link>
        </div>
      </header>
      <main className="store-main">{children}</main>
      <footer className="store-footer">
        <div className="wordmark">MAISON VELL BEAUTY</div>
        <div className="footer-cols">
          <div>
            <h3>Shop</h3>
            <Link href="/shop">Shop All</Link>
            <Link href="/new-arrivals">New Arrivals</Link>
            <Link href="/best-sellers">Best Sellers</Link>
            <Link href="/shades">Collections</Link>
          </div>
          <div>
            <h3>About</h3>
            <Link href="/the-maison">The Maison</Link>
            <Link href="/beauty">Beauty</Link>
            <Link href="/lookbook">Lookbook</Link>
            <Link href="/editorial">Editorial</Link>
          </div>
          <div>
            <h3>Customer Care</h3>
            <Link href="/contact">Contact</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/shipping">Shipping</Link>
            <Link href="/returns">Returns</Link>
            <Link href="/track-order">Track Order</Link>
          </div>
          <div>
            <h3>Legal</h3>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/refund-policy">Refund Policy</Link>
            <Link href="/shipping-policy">Shipping Policy</Link>
            <Link href="/cancellation-policy">Cancellation Policy</Link>
          </div>
        </div>
        <div className="footer-social">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">Pinterest</a>
        </div>
        <span>© 2026 Maison Vell Beauty · Beauty · Colour · Elegance</span>
      </footer>
    </div>
  );
}

export function PageTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="page-title">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
