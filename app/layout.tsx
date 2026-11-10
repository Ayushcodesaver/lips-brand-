import { Michroma, Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import type { Metadata } from 'next';
import './globals.css';

const michroma = Michroma({ weight: '400', subsets: ['latin'], variable: '--font-michroma' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'Maison Vell Beauty — The Nail Colour Collection', template: '%s | Maison Vell Beauty' },
  description:
    'Six signature nail lacquers in a 21-free formula. Velvet Rouge, Nude Cashmere, Rose Silk, Champagne Veil, Midnight Noir and Pearl Ivory.',
  icons: { icon: '/favicon.ico' },
};

/**
 * Everything renders on demand: the store depends on live Clerk/Convex
 * sessions, so `next build` succeeds before keys are configured (SETUP.md).
 */
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${michroma.variable} ${inter.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
