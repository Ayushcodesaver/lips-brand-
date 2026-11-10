import type { Metadata } from 'next';
import LookbookCampaign from '@/components/marketing/lookbook-campaign';

export const metadata: Metadata = {
  title: 'Lookbook — The Nail Colour Collection | Maison Vell Beauty',
  description: 'The Maison Vell Beauty nail colour lookbook: six shades in glass, pigment and high shine.',
};

export default function LookbookPage() {
  return <LookbookCampaign />;
}
