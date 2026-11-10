import type { Metadata } from 'next';
import TheMaisonStory from '@/components/marketing/the-maison-story';

export const metadata: Metadata = {
  title: { absolute: 'The Maison | Maison Vell Beauty' },
  description: 'The story of Maison Vell Beauty — a nail colour maison built on glass, pigment and restraint.',
};

export default function TheMaisonPage() {
  return <TheMaisonStory />;
}
