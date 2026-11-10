import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const addressShape = {
  full_name: v.string(),
  phone: v.string(),
  line1: v.string(),
  line2: v.string(),
  city: v.string(),
  region: v.string(),
  postal_code: v.string(),
  country: v.string(),
};

const orderLine = v.object({
  productId: v.number(),
  name: v.string(),
  quantity: v.number(),
  unitPrice: v.number(),
});

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    fullName: v.string(),
    email: v.string(),
    createdAt: v.number(),
  }).index('by_clerk_id', ['clerkId']),

  addresses: defineTable({
    clerkId: v.string(),
    ...addressShape,
    createdAt: v.number(),
  }).index('by_clerk', ['clerkId']),

  shoppingBags: defineTable({
    clerkId: v.string(),
    items: v.array(v.object({ productId: v.number(), quantity: v.number() })),
    wishlist: v.array(v.number()),
  }).index('by_clerk', ['clerkId']),

  orders: defineTable({
    clerkId: v.string(),
    requestId: v.string(),
    items: v.array(orderLine),
    shippingAddress: v.object(addressShape),
    subtotal: v.number(),
    shipping: v.number(),
    total: v.number(),
    paymentMethod: v.string(), // 'cod' | 'online'
    paymentStatus: v.string(), // 'unpaid' | 'paid' | 'refunded'
    status: v.string(), // 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    gatewayOrderId: v.optional(v.string()),
    paidAmountInr: v.optional(v.number()),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_clerk_date', ['clerkId'])
    .index('by_request', ['clerkId', 'requestId'])
    .index('by_gateway_order', ['gatewayOrderId']),
});
