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
