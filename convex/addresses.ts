import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { addressSchema } from '../lib/catalog';
import { currentUser } from './validation';

const addressArg = {
  full_name: v.string(),
  phone: v.string(),
  line1: v.string(),
  line2: v.string(),
  city: v.string(),
  region: v.string(),
  postal_code: v.string(),
  country: v.string(),
};

/** My saved shipping addresses. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const clerkId = await currentUser(ctx);
    if (!clerkId) return [];
    return await ctx.db
      .query('addresses')
      .withIndex('by_clerk', (q) => q.eq('clerkId', clerkId))
      .order('asc')
      .collect();
  },
});

/** Saves a new address (validated server-side). */
export const add = mutation({
  args: addressArg,
  handler: async (ctx, args) => {
    const clerkId = await currentUser(ctx);
    if (!clerkId) throw new Error('Sign in to save an address');
    const address = addressSchema.parse(args);
    return await ctx.db.insert('addresses', { clerkId, ...address, createdAt: Date.now() });
  },
});

/** Removes one of my addresses. */
export const remove = mutation({
  args: { id: v.id('addresses') },
  handler: async (ctx, args) => {
    const clerkId = await currentUser(ctx);
    if (!clerkId) throw new Error('Sign in first');
    const address = await ctx.db.get(args.id);
    if (!address || address.clerkId !== clerkId) throw new Error('Address not found');
    await ctx.db.delete(args.id);
  },
});
