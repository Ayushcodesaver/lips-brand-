import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** All public routes, prioritised for crawlers. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const route = (path: string, priority = 0.7) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    priority,
  });

  return [
    route('/', 1),
    route('/shop', 1),
    route('/new-arrivals', 0.9),
    route('/best-sellers', 0.9),
    route('/collections/nail-lacquer', 0.9),
    route('/collections/limited-edition', 0.8),
    route('/shades', 0.8),
    route('/lookbook', 0.8),
    route('/beauty', 0.8),
    route('/the-maison', 0.8),
    route('/editorial', 0.8),
    ...[
      '/product/velvet-rouge',
      '/product/nude-cashmere',
      '/product/rose-silk',
      '/product/champagne-veil',
      '/product/midnight-noir',
      '/product/pearl-ivory',
    ].map((p) => route(p, 0.9)),
    route('/bag', 0.4),
    route('/wishlist', 0.4),
    route('/search', 0.4),
    route('/auth', 0.3),
    route('/contact', 0.5),
    route('/faq', 0.5),
    route('/shipping', 0.5),
    route('/returns', 0.5),
    route('/track-order', 0.3),
    route('/nail-care', 0.5),
    route('/payment-information', 0.3),
    route('/privacy-policy', 0.3),
    route('/terms', 0.3),
    route('/refund-policy', 0.3),
    route('/shipping-policy', 0.3),
    route('/cancellation-policy', 0.3),
  ];
}
