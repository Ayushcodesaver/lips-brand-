/**
 * Shared runtime flag: true once real Clerk + Convex credentials exist in
 * .env.local (SETUP.md). Placeholders like `pk_test_REPLACE_ME` intentionally
 * fail these patterns, so the site falls back to guest mode until configured.
 */
export const connected =
  /^pk_(test|live)_[A-Za-z0-9]{20,}$/.test(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '') &&
  /^https:\/\/[a-z0-9-]+\.convex\.cloud$/.test(process.env.NEXT_PUBLIC_CONVEX_URL ?? '');
