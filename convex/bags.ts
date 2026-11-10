import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { bagSchema } from '../lib/catalog';
import { currentUser } from './validation';

/** The signed-in user's saved bag + wishlist (null when signed out). */
export const mine = query({
  args: {},
  handler: async (ctx) => {
    const clerkId = await currentUser(ctx);
    if (!clerkId) return null;
    return (
      (await ctx.db.query('shoppingBags').withIndex('by_clerk', (q) => q.eq('clerkId', clerkId)).unique()) ?? {
        items: [],
        wishlist: [],
      }
    );
  },
});

/** Upserts the bag. The client validates with bagSchema before calling. */
export const set = mutation({
  args: {
    items: v.array(v.object({ productId: v.number(), quantity: v.number() })),
    wishlist: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const clerkId = await currentUser(ctx);
    if (!clerkId) throw new Error('Sign in to save your bag');
    const parsed = bagSchema.parse(args.items);
    const existing = await ctx.db
      .query('shoppingBags')
      .withIndex('by_clerk', (q) => q.eq('clerkId', clerkId))
      .unique();
    const wishlist = args.wishlist.filter((n) => Number.isInteger(n) && n >= 0 && n < 6);
    if (existing) {
      await ctx.db.patch(existing._id, { items: parsed, wishlist });
      return existing._id;
    }
    return await ctx.db.insert('shoppingBags', { clerkId, items: parsed, wishlist });
  },
});
