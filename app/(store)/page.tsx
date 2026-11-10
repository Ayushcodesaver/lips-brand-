import type { Metadata } from 'next';
import LookbookCampaign from '@/components/marketing/lookbook-campaign';

export const metadata: Metadata = {
  title: 'Maison Vell Beauty — The Nail Colour Collection',
  description:
    'Six signature nail lacquers stand in depth. Drag, scroll or use the arrow keys to bring each shade forward.',
};

export default function HomePage() {
  return <LookbookCampaign />;
}
