import { z } from 'zod';

/**
 * Single source of truth for the catalog. Imported by both the Next.js app
 * and the Convex functions (server-side price validation) — keep it pure.
 */
export type ProductTag = 'new' | 'best-seller' | 'limited';

export const products = [
  { id: 0, slug: 'velvet-rouge', name: 'Velvet Rouge', shade: 'Deep Luxury Red', finish: 'High Gloss', price: 2800, x: 0, width: 413, hex: '#7a1420', tags: ['best-seller'], note: 'A rich lacquered red with a deep glass-like shine.' },
  { id: 1, slug: 'nude-cashmere', name: 'Nude Cashmere', shade: 'Warm Nude', finish: 'Cream', price: 2600, x: 413, width: 399, hex: '#caa88f', tags: ['best-seller'], note: 'A soft skin-warm nude with a velvety cream finish.' },
  { id: 2, slug: 'rose-silk', name: 'Rose Silk', shade: 'Dusty Rose', finish: 'Satin', price: 2700, x: 812, width: 412, hex: '#b97383', tags: [], note: 'A muted rose that settles into a quiet satin glow.' },
  { id: 3, slug: 'champagne-veil', name: 'Champagne Veil', shade: 'Soft Champagne', finish: 'Fine Shimmer', price: 2900, x: 1224, width: 426, hex: '#d9c39a', tags: ['new', 'limited'], note: 'A sheer champagne veil lit with a fine golden shimmer.' },
  { id: 4, slug: 'midnight-noir', name: 'Midnight Noir', shade: 'Deep Black', finish: 'Ultra Gloss', price: 2800, x: 1650, width: 405, hex: '#14151a', tags: ['new', 'limited'], note: 'An inky black lacquer with a mirror-bright finish.' },
  { id: 5, slug: 'pearl-ivory', name: 'Pearl Ivory', shade: 'Creamy Ivory', finish: 'Cream', price: 2600, x: 2055, width: 419, hex: '#ece4d4', tags: ['new'], note: 'A clean creamy ivory, pure and polished.' },
] as const;

/** Collection selectors shared by the storefront pages. */
export const byTag = (tag: ProductTag) => products.filter((p) => (p.tags as readonly string[]).includes(tag));
export const newArrivals = byTag('new');
export const bestSellers = byTag('best-seller');
export const limitedEdition = byTag('limited');
export const nailLacquerCollection = products;

export const money = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

const bagItemSchema = z.object({ productId: z.number().int().min(0).max(5), quantity: z.number().int().min(1).max(20) });

export const bagSchema = z
  .array(bagItemSchema)
  .max(6)
  .refine((items) => new Set(items.map((i) => i.productId)).size === items.length, 'Duplicate products');

export type BagItem = z.infer<typeof bagItemSchema>;

const field = (max: number) => z.string().trim().min(1, 'This field is required').max(max);

export const addressSchema = z.object({
  full_name: field(100),
  phone: field(30).min(5),
  line1: field(200),
  line2: z.string().trim().max(200).default(''),
  city: field(100),
  region: field(100),
  postal_code: field(20),
  country: field(100),
});

export type Address = z.infer<typeof addressSchema>;

export const emptyAddress: Address = {
  full_name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  region: '',
  postal_code: '',
  country: '',
};

export function totals(items: BagItem[]) {
  const subtotal = items.reduce((sum, item) => sum + (products[item.productId]?.price ?? 0) * item.quantity, 0);
  const shipping = subtotal > 6000 || !subtotal ? 0 : 500;
  return { subtotal, shipping, total: subtotal + shipping };
}

/** Free shipping kicks in above this subtotal (USD cents). */
export const FREE_SHIPPING_THRESHOLD = 6000;
export const SHIPPING_FEE = 500;

export const PAYMENT_METHODS = ['online', 'cod'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const codOrderSchema = z.object({
  requestId: z.string().uuid(),
  items: bagSchema.refine((i) => i.length > 0, 'Your bag is empty'),
  address: addressSchema,
});

export const onlineOrderSchema = codOrderSchema.extend({
  customerEmail: z.string().email(),
});

export type CodOrderInput = z.infer<typeof codOrderSchema>;
export type OnlineOrderInput = z.infer<typeof onlineOrderSchema>;

export function productBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}
