# Maison Vell Beauty

A luxury nail-lacquer storefront — full e-commerce website with **online payments**.

**Stack:** Next.js 15 (App Router) · Clerk (auth) · Convex (database) · Cashfree (payments: UPI / cards / netbanking) · Tailwind v4

## Quick start

```sh
npm install
npx convex dev      # creates your Convex deployment, pushes the schema
npm run dev         # http://localhost:3000
```

Then add your Clerk keys to `.env.local` and (optionally) Cashfree keys to Convex —
**the full walkthrough is in [SETUP.md](./SETUP.md)**.

Until keys are configured:
- browsing, bag and wishlist work immediately (guest state in localStorage),
- checkout offers **Cash on delivery** once Clerk + Convex are connected,
- the **Pay online** option unlocks automatically when Cashfree keys are set on the deployment.

## What's inside

| Area | Routes |
| --- | --- |
| Campaign pages (ported pixel-for-pixel from the original design) | `/` · `/shop` · `/lookbook` · `/beauty` · `/the-maison` · `/editorial` |
| Commerce | `/product/[slug]` · `/bag` · `/wishlist` · `/checkout` · `/order/[id]` |
| Account | `/auth` · `/account` |
| Care | `/shipping` · `/faq` |

- **Payments:** Cashfree Orders API via Convex actions — the bag, address and amount are re-validated
  server-side, prices are recomputed from `lib/catalog.ts` (never trusted from the client), USD prices are
  converted to INR, the payment is verified with Cashfree before the order is recorded as paid.
- **Orders are idempotent** per checkout session (`requestId`), so double-clicks never double-charge.
- **COD** works out of the box; online payments degrade gracefully when keys are missing.
- **Auth:** Clerk hosts sign-in/sign-up; Convex trusts Clerk JWTs (`convex/auth.config.ts`).

## Scripts

```sh
npm run dev      # dev server
npm run build    # production build
npm run lint     # eslint
npm test         # vitest unit tests (catalog, INR conversion, order validation)
```
