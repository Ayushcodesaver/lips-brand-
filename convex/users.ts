import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { currentUser } from './validation';

/** Upserts the profile row from Clerk data (called once after sign-in). */
export const ensure = mutation({
  args: { fullName: v.string(), email: v.string() },
  handler: async (ctx, args) => {
    const clerkId = await currentUser(ctx);
    if (!clerkId) throw new Error('Sign in first');
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        fullName: args.fullName || existing.fullName,
        email: args.email || existing.email,
      });
      return existing._id;
    }
    return await ctx.db.insert('users', {
      clerkId,
      fullName: args.fullName,
      email: args.email,
      createdAt: Date.now(),
    });
  },
});

/** My profile (null when signed out). */
export const me = query({
  args: {},
  handler: async (ctx) => {
    const clerkId = await currentUser(ctx);
    if (!clerkId) return null;
    return (
      (await ctx.db.query('users').withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId)).unique()) ?? {
        fullName: '',
        email: '',
      }
    );
  },
});
