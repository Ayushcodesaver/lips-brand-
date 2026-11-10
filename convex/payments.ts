import { action } from './_generated/server';

/**
 * Tells the checkout UI whether online payments are configured, and which
 * Cashfree environment the server actions use — the drop-in SDK must be
 * initialized in the same mode (audit lead checkout/cashfree-sdk-mode-hardcoded-sandbox).
 * Cashfree keys live in Convex env vars (SETUP.md §3) and are read
 * only inside actions — never shipped to the browser.
 */
export const enabled = action({
  args: {},
  handler: async () => {
    const onlineEnabled = Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);
    return { onlineEnabled, currency: 'INR', env: process.env.CASHFREE_ENV ?? 'sandbox' };
  },
});
