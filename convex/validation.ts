import { z } from 'zod';
import { bagSchema, addressSchema, products, totals, type BagItem, type Address } from '../lib/catalog';

/**
 * Server-side re-validation of the bag and address, mirroring the checks the
 * original Postgres RPC performed. Prices are always recomputed from the
 * catalog — never trusted from the client.
 */
export function validateBagAndAddress(rawItems: unknown, rawAddress: unknown): { items: BagItem[]; address: Address } {
  const items = bagSchema.parse(rawItems);
  if (items.length === 0) throw new Error('Your bag is empty');
  const address = addressSchema.parse(rawAddress);
  return { items, address };
}

export function pricedLines(items: BagItem[]) {
  return items.map((i) => ({
    productId: i.productId,
    name: products[i.productId].name,
    quantity: i.quantity,
    unitPrice: products[i.productId].price,
  }));
}

export function recomputeTotals(items: BagItem[]) {
  return totals(items);
}

type AuthCtx = { auth: { getUserIdentity(): Promise<{ subject: string } | null> } };

const emailSchema = z.string().trim().max(254).email();

/**
 * Server-side format validation for the PSP customer email. Audit lead
 * payments/customer-email-client-asserted: the email cannot currently be bound
 * to a verified JWT claim (claim availability depends on the Clerk template),
 * so format validation is enforced here and the trust decision is documented
 * in NEEDS-VALIDATION.md.
 */
export function validateCustomerEmail(raw: string): string {
  const parsed = emailSchema.safeParse(raw);
  if (!parsed.success) throw new Error('A valid email address is required');
  return parsed.data;
}

/** Resolves the Clerk user id from the verified JWT, or throws. */
export async function requireUser(ctx: AuthCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.subject) throw new Error('Sign in to continue');
  return identity.subject;
}

/** Resolves the Clerk user id, or null when signed out. */
export async function currentUser(ctx: AuthCtx): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject ?? null;
}
