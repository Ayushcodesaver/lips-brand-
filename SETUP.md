# Maison Vell Beauty — Setup Guide

The full site runs on **Next.js + Clerk (auth) + Convex (database) + Cashfree (online payments)**.
Follow the three sections below in order — each takes ~5 minutes with a free account.

---

## 1 · Clerk — authentication (required)

1. Create a free account at <https://dashboard.clerk.com> → **Create application**.
2. Copy the keys into `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
3. In the Clerk dashboard, **API Keys → JWT Templates → New template**, name it exactly `convex`.
4. From that template, copy **JWKS Endpoint** and **Application ID**, then set them on Convex (after §2):
   ```sh
   npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<your-slug>.clerk.accounts.dev
   npx convex env set CLERK_APPLICATION_ID <application-id>
   ```

## 2 · Convex — database (required)

```sh
npx convex dev
```
- Log in (free account), create a project — the deployment is linked automatically and the
  schema/functions in `convex/` are pushed and code-generated (`convex/_generated`).
- The command prints/updates `NEXT_PUBLIC_CONVEX_URL` in `.env.local` — keep it there.
- Leave `npx convex dev` running while developing; run `npx convex deploy` before production.

## 3 · Cashfree — online payments (optional until you want live checkout)

1. Create a free **Merchant Dashboard** account at <https://www.cashfree.com> (Sandbox is enabled by default).
2. Copy your **App ID** and **Secret key** (Dashboard → Payment Gateway → API keys) into Convex:
   ```sh
   npx convex env set CASHFREE_APP_ID <your-app-id>
   npx convex env set CASHFREE_SECRET_KEY <your-secret-key>
   npx convex env set CASHFREE_USD_TO_INR 83      # optional, default 83
   npx convex env set CASHFREE_ENV sandbox         # switch to `production` when you go live
   ```
3. Restart `npm run dev`. The checkout's **“Pay online — UPI · Cards · Netbanking”** option unlocks automatically.
   Until then the online option is shown disabled and **Cash on delivery works out of the box**.

Test cards in sandbox mode: use <https://docs.cashfree.com/docs/test-card-details> (e.g. UPI success VPA `success@upi`, test card `4111 1111 1111 1111`, any future expiry, any CVV).

> Going live: complete Cashfree KYC, set `CASHFREE_ENV=production`, and swap to live keys.
> For robustness also add a Cashfree **webhook** later (POST endpoint → verify signature → mark order paid);
> the current flow verifies payment server-side synchronously, which covers the modal checkout path.

## 4 · Run the site

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # production build check
npm test           # unit tests (catalog, INR conversion, validation)
```

---

## Environment reference

`.env.local` (Next.js — client-visible keys are the `NEXT_PUBLIC_*` ones):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CASHFREE_MODE=sandbox   # cosmetic: hides the "sandbox" hint when set to production
```

Convex deployment env (`npx convex env set …`):

```
CLERK_JWT_ISSUER_DOMAIN=
CLERK_APPLICATION_ID=
CASHFREE_APP_ID=
CASHFREE_SECRET_KEY=
CASHFREE_USD_TO_INR=83
CASHFREE_ENV=sandbox
```

## Where things live

| Piece | Path |
| --- | --- |
| Database schema & order logic | `convex/schema.ts`, `convex/orders.ts`, `convex/bags.ts`, `convex/addresses.ts`, `convex/users.ts` |
| Cashfree REST + conversion helpers | `convex/orders.ts`, `lib/cashfree.ts` |
| Catalog / prices / validation | `lib/catalog.ts` (imported by both app and Convex) |
| Store state (bag/wishlist sync) | `components/store-provider.tsx` |
| Checkout with Cashfree modal | `app/(store)/checkout/page.tsx` |
| Marketing pages | `components/marketing/*` (ported from the original static HTML) |
