/**
 * Pure Cashfree helpers shared by the Convex actions and unit tests.
 * Secrets never live here — only in Convex env vars (see SETUP.md).
 */

/** Fallback USD→INR rate when CASHFREE_USD_TO_INR is not set. */
export const INR_PER_USD_DEFAULT = 83;

/** Convert USD cents (catalog prices) to whole rupees (Cashfree amounts are in major units). */
export function usdCentsToInr(usdCents: number, rate: number = INR_PER_USD_DEFAULT): number {
  if (!Number.isFinite(usdCents) || usdCents <= 0) return 0;
  if (!Number.isFinite(rate) || rate <= 0) return 0;
  return Math.round((usdCents / 100) * rate);
}

/**
 * Cashfree order_id: alphanumeric, must start with a letter, ≤ 40 chars, unique.
 * Derived deterministically from the checkout requestId.
 */
export function gatewayOrderId(requestId: string): string {
  const hex = requestId.replace(/[^a-fA-F0-9]/g, '').toLowerCase();
  return `mv${hex}`.slice(0, 40);
}

export const CASHFREE_API_VERSION = '2023-08-01';

export function cashfreeBaseUrl(env?: string): string {
  return (env ?? process.env.CASHFREE_ENV ?? 'sandbox') === 'production'
    ? 'https://api.cashfree.com'
    : 'https://sandbox-api.cashfree.com';
}
