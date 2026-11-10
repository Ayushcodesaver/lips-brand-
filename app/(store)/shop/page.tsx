import type { Metadata } from 'next';
import ShopCollection from '@/components/marketing/shop-collection';

export const metadata: Metadata = {
  title: 'Shop — The Nail Colour Collection | Maison Vell Beauty',
  description:
    'Shop the six signature Maison Vell Beauty nail lacquers: Velvet Rouge, Nude Cashmere, Rose Silk, Champagne Veil, Midnight Noir and Pearl Ivory.',
};

export default function ShopPage() {
  return <ShopCollection />;
}
