import type { Metadata } from 'next';
import EditorialCampaign from '@/components/marketing/editorial-campaign';

export const metadata: Metadata = {
  title: 'Editorial — Lacquered in Light | Maison Vell Beauty',
  description:
    'The Maison Vell Beauty editorial: six nail lacquers photographed in glass, pigment and high shine.',
};

export default function EditorialPage() {
  return <EditorialCampaign />;
}
