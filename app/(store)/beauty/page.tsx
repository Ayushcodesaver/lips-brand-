import type { Metadata } from 'next';
import BeautyCampaign from '@/components/marketing/beauty-campaign';

export const metadata: Metadata = {
  title: { absolute: 'Beauty — 21-Free Formula | Maison Vell Beauty' },
  description: 'Inside the Maison Vell Beauty 21-free formula: pigment, care and a lacquer-like shine.',
};

export default function BeautyPage() {
  return <BeautyCampaign />;
}
