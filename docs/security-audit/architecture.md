# Architecture — lips-brand (Maison Vell Beauty)

## 1. Product, principals, authority, protected resources

Luxury nail-lacquer e-commerce site. **Principals:** anonymous visitor (browse, guest bag/wishlist in localStorage), authenticated customer (Clerk sign-in; bag/wishlist sync, checkout, orders, addresses, profile), operator (no admin UI exists; order status is never mutated by any source path). **Trust-sensitive actions:** place order (COD or Cashfree online payment), create/verify Cashfree payment sessions, read own order history, manage own addresses. **Protected resources:** user profiles, addresses, bags, orders (all in Convex), Cashfree operator account (API keys in Convex env), payment sessions.

## 2. Comparable baseline

Comparable: small vendor-managed SaaS commerce stacks (Next.js app + hosted auth + hosted DB + hosted PSP). Such stacks accept vendor-managed session/JWT handling, vendor CORS, and PSP-hosted drop-in scripts; they typically still own server-side price recomputation and owner-scoped queries. Those two invariants are present here; calibration below uses them, not to dismiss findings.

## 3. Stack, deployment paths, offline limits

Next.js 15 App Router (React 19, all routes `force-dynamic`), Clerk auth (`@clerk/nextjs`), Convex database/functions, Cashfree Payments REST + drop-in SDK. No Dockerfile/CI/IaC in repo — deployment is external (out of scope). Offline: `npm run build`, `npm run lint`, `npm test` (vitest, pure functions) — but this host cannot enforce the required execution sandbox, so **no target-controlled execution was performed**; every check is source-only.

## 4. Entry surfaces and source→sink paths

- **Convex functions** (the only server API; no Next route handlers): `convex/orders.ts` (actions `placeCodOrder`, `createCashfreeOrder`, `verifyAndPlaceOnlineOrder`; internal mutation `insertOrderInternal`; queries `mine`, `get`), `convex/bags.ts` (`mine`, `set`), `convex/addresses.ts` (`list`, `add`, `remove`), `convex/users.ts` (`ensure`, `updateName`, `me`), `convex/payments.ts` (`enabled`).
- **Client pages** under `app/(store)/`: checkout (Clerk identity, bag, address zod, Cashfree drop-in via `loadCashfreeSdk()`), search (query param → text render), order/account pages (Convex reads), marketing pages (static content).
- **External calls:** Cashfree REST `POST /pg/orders` and `GET /pg/orders/{id}` (server actions, keys from Convex env); checkout loads `https://sdk.cashfree.com/js/v3/cashfree.js` at runtime.

## 5. Trust boundaries and strongest source-visible control

| Boundary | Strongest source-visible control |
| --- | --- |
| Anonymous → Convex functions | `convex/validation.ts#requireUser` (JWT `getUserIdentity().subject` or throw) |
| Authenticated user A → user B's rows | owner scope: every query/mutation filters `clerkId` from `ctx.auth` (`bags.ts`, `addresses.ts`, `orders.ts#mine/get`) |
| Client bag/amount claims → money | server re-validation: `validateBagAndAddress` (zod bounds, dupes) + `pricedLines`/`recomputeTotals` from `lib/catalog.ts` — client prices never trusted |
| Payment claim → recorded paid order | `verifyAndPlaceOnlineOrder` re-fetches order from Cashfree, requires `PAID` and amount match before `insertOrderInternal` |
| Replay of checkout requestId | unique `(clerkId, requestId)` dedupe in `insertOrderInternal` |
| Browser rendering of inputs | React escaping; no `dangerouslySetInnerHTML`/`innerHTML`/`eval`/`child_process` anywhere (grep: 0 hits) |
| Repo → release | `.gitignore` covers `.env*`; only `.env.example` is tracked (verified via `git ls-files`) |

Unobserved deployment facts: Clerk JWT template configuration (`convex/auth.config.ts` reads env), Cashfree keys presence, hosting headers, Cashfree account settings.

## 6. Repository-relative starting paths

`convex/orders.ts`, `convex/validation.ts`, `convex/bags.ts`, `convex/addresses.ts`, `convex/users.ts`, `convex/payments.ts`, `convex/auth.config.ts`, `app/(store)/checkout/page.tsx`, `components/providers.tsx`, `components/store-provider.tsx`, `middleware.ts`, `next.config.ts`, `.gitignore`, `lib/catalog.ts`.

## 7. Prior coverage

No prior runs. No carried confirmations, no exclusions from prior evidence.

## 8. Companion selection

Selected because reconnaissance found the described boundaries: `CLIENT-SIDE.md` (framed checkout, browser rendering/storage), `SUPPLY-CHAIN-AND-RELEASE.md` (runtime CDN script into payment context; release inputs/secrets), `RESOURCE-EXHAUSTION-AND-AVAILABILITY.md` (authenticated users → operator-owned third-party API quota), `DATA-ISOLATION-AND-LIFECYCLE.md` (owner-scoped rows; paid-order lifecycle), `WEB-PROTOCOL-AND-AUTH.md` (Clerk JWT consumption boundary). Not selected: `MEMORY-SAFETY-AND-BINARY.md` (no native code), `AI-AND-LLM.md` (no model integration), `DESKTOP-MOBILE-AND-LOCAL-IPC.md` (no desktop/mobile surface), `PROTOCOLS-RPC-AND-MESSAGING.md` (no broker/webhook receiver in repo).
