import { v } from 'convex/values';
import { action, query } from './_generated/server';
import { internalMutation } from './_generated/server';
import { internal } from './_generated/api';
import {
  CASHFREE_API_VERSION,
  cashfreeBaseUrl,
  gatewayOrderId,
  usdCentsToInr,
} from '../lib/cashfree';
import { currentUser, pricedLines, recomputeTotals, requireUser, validateBagAndAddress } from './validation';

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

const itemsArg = v.array(v.object({ productId: v.number(), quantity: v.number() }));

function cashfreeConfig() {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  if (!appId || !secretKey) {
    throw new Error(
      'Online payments are not configured yet. Run `npx convex env set CASHFREE_APP_ID ...` and `npx convex env set CASHFREE_SECRET_KEY ...` (see SETUP.md).',
    );
  }
  return { appId, secretKey, base: cashfreeBaseUrl() };
}

function inrRate() {
  const raw = Number(process.env.CASHFREE_USD_TO_INR);
  return Number.isFinite(raw) && raw > 0 ? raw : 83;
}

/** Cash on delivery — places the order immediately, marked unpaid. */
export const placeCodOrder = action({
  args: { requestId: v.string(), items: itemsArg, address: v.object(addressArg) },
  handler: async (ctx, args) => {
    const clerkId = await requireUser(ctx);
    const { items, address } = validateBagAndAddress(args.items, args.address);
    return await ctx.runMutation(internal.orders.insertOrderInternal, {
      clerkId,
      requestId: args.requestId,
      items,
      address,
      paymentMethod: 'cod',
      paymentStatus: 'unpaid',
      gatewayOrderId: undefined,
      paidAmountInr: undefined,
    });
  },
});

/** Creates a Cashfree order for the current bag. Returns a drop-in payment session. */
export const createCashfreeOrder = action({
  args: {
    requestId: v.string(),
    items: itemsArg,
    address: v.object(addressArg),
    customerEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const clerkId = await requireUser(ctx);
    const { items, address } = validateBagAndAddress(args.items, args.address);
    const totals = recomputeTotals(items);
    const amountInr = usdCentsToInr(totals.total, inrRate());
    if (amountInr < 1) throw new Error('Order amount is too small to charge');

    const { appId, secretKey, base } = cashfreeConfig();
    const id = gatewayOrderId(args.requestId);

    const res = await fetch(`${base}/pg/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': CASHFREE_API_VERSION,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        order_id: id,
        order_amount: amountInr,
        order_currency: 'INR',
        customer_details: {
          customer_id: clerkId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64) || 'guest',
          customer_email: args.customerEmail,
          customer_phone: address.phone.replace(/[^0-9+]/g, '').slice(0, 25),
        },
      }),
    });

    const body: unknown = await res.json().catch(() => null);
    if (!res.ok || !body || typeof body !== 'object') {
      throw new Error(`Cashfree rejected the order (HTTP ${res.status}). Check your API keys.`);
    }
    const session = (body as { payment_session_id?: string }).payment_session_id;
    if (!session) throw new Error('Cashfree did not return a payment session. Check your API keys.');
    return { gatewayOrderId: id, paymentSessionId: session, amountInr };
  },
});

/** Verifies the payment with Cashfree and only then records the order as paid. */
export const verifyAndPlaceOnlineOrder = action({
  args: {
    requestId: v.string(),
    items: itemsArg,
    address: v.object(addressArg),
    customerEmail: v.string(),
    gatewayOrderId: v.string(),
  },
  handler: async (ctx, args) => {
    const clerkId = await requireUser(ctx);
    const { items, address } = validateBagAndAddress(args.items, args.address);
    const totals = recomputeTotals(items);
    const amountInr = usdCentsToInr(totals.total, inrRate());

    const { appId, secretKey, base } = cashfreeConfig();
    const res = await fetch(`${base}/pg/orders/${encodeURIComponent(args.gatewayOrderId)}`, {
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': CASHFREE_API_VERSION,
      },
    });
    const body: unknown = await res.json().catch(() => null);
    if (!res.ok || !body || typeof body !== 'object') {
      throw new Error(`Could not verify the payment (HTTP ${res.status}).`);
    }
    const order = body as { order_status?: string; order_amount?: number | string };
    if (order.order_status !== 'PAID') {
      throw new Error(`Payment not completed (status: ${order.order_status ?? 'unknown'}).`);
    }
    if (Math.abs(Number(order.order_amount) - amountInr) > 1) {
      throw new Error('Paid amount does not match the order total.');
    }

    return await ctx.runMutation(internal.orders.insertOrderInternal, {
      clerkId,
      requestId: args.requestId,
      items,
      address,
      paymentMethod: 'online',
      paymentStatus: 'paid',
      gatewayOrderId: args.gatewayOrderId,
      paidAmountInr: amountInr,
    });
  },
});

/** Shared internal insert — idempotent per (user, requestId), always recomputes prices. */
export const insertOrderInternal = internalMutation({
  args: {
    clerkId: v.string(),
    requestId: v.string(),
    items: itemsArg,
    address: v.object(addressArg),
    paymentMethod: v.string(),
    paymentStatus: v.string(),
    gatewayOrderId: v.optional(v.string()),
    paidAmountInr: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('orders')
      .withIndex('by_request', (q) => q.eq('clerkId', args.clerkId).eq('requestId', args.requestId))
      .unique();
    if (existing) return existing._id;

    const { items } = validateBagAndAddress(args.items, args.address);
    const lines = pricedLines(items);
    const totals = recomputeTotals(items);

    // Keep a lightweight profile row for the account page.
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique();
    if (!user) {
      await ctx.db.insert('users', {
        clerkId: args.clerkId,
        fullName: args.address.full_name,
        email: '',
        createdAt: Date.now(),
      });
    } else if (!user.fullName && args.address.full_name) {
      await ctx.db.patch(user._id, { fullName: args.address.full_name });
    }

    const orderId = await ctx.db.insert('orders', {
      clerkId: args.clerkId,
      requestId: args.requestId,
      items: lines,
      shippingAddress: args.address,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total,
      paymentMethod: args.paymentMethod,
      paymentStatus: args.paymentStatus,
      status: 'placed',
      gatewayOrderId: args.gatewayOrderId,
      paidAmountInr: args.paidAmountInr,
      paidAt: args.paymentStatus === 'paid' ? Date.now() : undefined,
      createdAt: Date.now(),
    });

    // Clear the bag only after the order is safely recorded.
    const bag = await ctx.db
      .query('shoppingBags')
      .withIndex('by_clerk', (q) => q.eq('clerkId', args.clerkId))
      .unique();
    if (bag) await ctx.db.patch(bag._id, { items: [] });

    return orderId;
  },
});

/** My order history, newest first. */
export const mine = query({
  args: {},
  handler: async (ctx) => {
    const clerkId = await currentUser(ctx);
    if (!clerkId) return [];
    return await ctx.db.query('orders').withIndex('by_clerk_date', (q) => q.eq('clerkId', clerkId)).order('desc').collect();
  },
});

/** A single order — only its owner may read it. */
export const get = query({
  args: { id: v.id('orders') },
  handler: async (ctx, args) => {
    const clerkId = await currentUser(ctx);
    if (!clerkId) return null;
    const order = await ctx.db.get(args.id);
    if (!order || order.clerkId !== clerkId) return null;
    return order;
  },
});
