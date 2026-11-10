# Needs-Validation Leads — lips-brand run-1

Prioritized leads from source review. **No severity is assigned** — a lead becomes a finding only after the listed validation establishes the boundary and result. Do not probe live deployments; all "deployment" steps are owner-observed checks.

---

## 1 · `checkout/cashfree-sdk-mode-hardcoded-sandbox` — SDK mode hardcoded to sandbox

**Priority rationale:** first — it is the only lead that certainly breaks the online-payment path in production, independent of attacker behavior.

- **Boundary:** client SDK environment ↔ server session environment (both under operator deployment config).
- **Trace:** `app/(store)/checkout/page.tsx:116` (client requests session) → `:118` `new Cashfree('sandbox')` literal → `lib/cashfree.ts:28` server selects `https://api.cashfree.com` when `CASHFREE_ENV=production` (`convex/orders.ts:76`, `:124`).
- **Evidence:** `checkout:118` (literal verified); `lib/cashfree.ts:28`; `convex/payments.ts:11` (`enabled` returns only key presence — client has no source of the server's mode).
- **Claimed result if validated:** production session id handed to a sandbox-mode modal — payment cannot complete.
- **Local step (sandboxed):** set `CASHFREE_ENV=production` with test credentials, run checkout on an isolated loopback, observe modal failure; apply the fix below and observe completion.
- **Owner step:** switch `CASHFREE_ENV` in a staging deployment, attempt one sandbox-card checkout, check which environment the modal hits (visible in the Cashfree dashboard).
- **Smallest source fix:** have `convex/payments.ts#enabled` also return `env: process.env.CASHFREE_ENV ?? 'sandbox'`; pass it to `new Cashfree(mode)` in checkout.

## 2 · `payments/no-reconciliation-webhook` — charged but unrecorded orders possible

- **Boundary:** PSP payment state ↔ application order records.
- **Trace:** `app/(store)/checkout/page.tsx:131` (verify runs only on the client success path) → `:133` (errors route to `/payment/failed`, no retry queue) → `convex/orders.ts:196` (`insertOrderInternal` is the sole order writer; grep: 0 webhook handlers in `app/`/`convex/`; `SETUP.md:49` defers webhooks).
- **Claimed result if validated:** a PAID Cashfree order with no application order row — customer charged, nothing recorded.
- **Owner step (decisive):** in the Cashfree sandbox, complete a payment and block/corrupt the verify call (offline after payment); observe the dashboard shows PAID while no order row exists.
- **Local step (sandboxed):** build a webhook/reconciliation handler fixture and unit-test idempotent insertion through `insertOrderInternal` against a stored PAID payload.
- **Smallest source fix:** add a Cashfree webhook endpoint (verify signature, look up by `gatewayOrderId`, call `insertOrderInternal` with `paymentStatus: 'paid'` — idempotency already holds), plus a periodic reconciliation query.

## 3 · `app/checkout-frame-ancestors-unset` — checkout frameable if hosting adds no header

- **Boundary:** victim browser session ↔ third-party framing page.
- **Trace:** `app/(store)/checkout/page.tsx:190` (state-changing controls on plain clicks) → `next.config.ts` (no `headers()` anywhere) → `middleware.ts:15` (passthrough).
- **Claimed result if validated:** UI-redress can drive a payment with the victim's session when no hosting-level header intervenes.
- **Owner step (decisive):** fetch live response headers for `/checkout`; check `Content-Security-Policy: frame-ancestors` / `X-Frame-Options`.
- **Local step (sandboxed):** `npm run build && npx next start` on a loopback-only namespace; `curl -sI http://127.0.0.1:3000/checkout`.
- **Smallest source fix:** add `async headers()` to `next.config.ts` with `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'` (keep `*.cashfree.com` allowances in mind for the modal's own framing needs — verify against vendor docs before shipping).

## 4 · `payments/customer-email-client-asserted` — PSP email is client-chosen

- **Boundary:** verified identity (JWT subject) ↔ client-asserted contact data reaching the PSP.
- **Trace:** `app/(store)/checkout/page.tsx:107` (email from client session object) → `convex/orders.ts:67` (`v.string()`, no format/ownership check) → `:93` (verbatim into `customer_details.customer_email`).
- **Attribution note:** `customer_id` is correctly sanitized from the verified `clerkId` (`:92`) — account attribution is intact; only the email attribute is attacker-chosen.
- **Claimed result if validated:** PSP records/emails an arbitrary address for the order; malformed values reject order creation.
- **Owner step:** inspect the Clerk `convex` JWT template claim payload for an email claim; observe one sandbox order's recorded email.
- **Local step (sandboxed):** harness-call the action with a dummy identity and an attacker email; diff the `customer_details` body.
- **Smallest source fix:** if the JWT carries an email claim, read it via `getUserIdentity()` claims server-side; otherwise validate with the same `z.string().email()` the client uses and record the trust decision.

## 5 · `payments/create-order-no-rate-limit` — unbounded PSP order creation

- **Boundary:** authenticated user capability ↔ operator-owned third-party quota/spend.
- **Trace:** `convex/orders.ts:62` (public action; only gate is `requireUser` at `:70`) → `:77` (distinct client `requestId` → distinct PSP order id, `lib/cashfree.ts:19-27`) → `:79` (external `POST /pg/orders` with operator keys). Grep: 0 rate-limit/throttle hits in `convex/`, `lib/`.
- **Claimed result if validated:** scripted account generates unlimited PSP orders (dashboard pollution, quota consumption).
- **Owner step (decisive):** bounded test — 5–10 orders from one test account in the sandbox; observe dashboard count and any PSP rate responses.
- **Local step (sandboxed):** 10-iteration loop with dummy keys through a local harness; observe 10 successes with no rejection.
- **Smallest source fix:** cap outstanding unverified Cashfree orders per user (query by `gatewayOrderId` prefix or a small counter table) before calling the PSP; return a friendly retry error when the cap is hit.

## 6 · `checkout/cashfree-sdk-no-integrity-pin` — vendor script without integrity pin

- **Boundary:** provider distribution chain ↔ checkout page origin (payment session in scope).
- **Trace:** `app/(store)/checkout/page.tsx:27` (`loadCashfreeSdk`) → `:31` (`script.src = https://sdk.cashfree.com/js/v3/cashfree.js`, no `integrity`/pin — grep 0 hits) → `:118` (script executes with page-origin authority during payment).
- **Context:** this is Cashfree's documented drop-in integration — an accepted vendor trade-off for most PSP integrations; the lead is about making the trust decision explicit, not an accusation of weakness.
- **Owner step (decisive):** check current Cashfree guidance for SRI support, pinned versions, or a self-hosted bundle; record the decision.
- **Local step (sandboxed):** hash the vendored script across releases to document drift; test a pinned/self-hosted variant against a local fixture.
- **Smallest source fix (if vendor supports it):** pin a version + SRI hash, or self-host the SDK with an update process; otherwise add `script-src https://sdk.cashfree.com` to a CSP so the trust is at least scoped.

---

**Deferred coverage:** `convex/users.ts#ensure+updateName+me` (self-scope write surface) was accepted by the final coverage critic after the single quick-profile hunter wave and is deferred to the next run (`quick_profile_final_critic`). Preliminary read: writes are bounded to the caller's own profile row via `ctx.auth`.
