# Security Audit Report — lips-brand (Maison Vell Beauty)

## Run statement

| Field | Value |
| --- | --- |
| Profile | `quick` (bounded pass: one hunter wave, one final coverage-critic, one fresh verifier pass per candidate — Phases 3 and 5 merged per quick-profile rule) |
| Scope | Full first-party application: `app/`, `components/`, `convex/`, `lib/`, `middleware.ts`, `next.config.ts`, `package.json`, `.gitignore` |
| Source ref | `0cddb7175a2aeca4261ff693f87bc27b7fd57c7c` (worktree clean) |
| Execution | **Sandboxed source-and-local-only** — this host cannot enforce the required OS sandbox controls (external-network isolation, empty allowlisted environment, resource limits), so **no target-controlled code was executed**; every check is source-only |
| Budget | None set |
| Prior runs | None (first run) |
| Validation | `findings.json` — PASS (6 records); `coverage-ledger.json` — PASS (19 units). Validators ran on Windows with a disclosed `O_NOFOLLOW`/`O_NONBLOCK` shim (win32 lacks the constants; input files are parent-created regular files with no symlink components). |
| Delegation deviation | Hunter/critic/verifier phases were executed inline by the parent agent because this platform exhibited subagent concurrency and quota failures during the session. The evidence bar, fresh re-reads, and the candidate gate were unchanged; **this is a disclosed deviation from the skill's write-isolation design**. |

**This is a partial pass.** It is a `quick`-profile, source-only review; it does not claim complete coverage, and every lead below remains unresolved pending the listed validation steps.

## Posture summary

The application's core trust boundaries are **well-designed at source level**: every privileged Convex function authenticates via the Clerk-verified JWT subject and owner-scopes every row; client-supplied bag contents and prices are re-validated and recomputed server-side; online orders are recorded as paid only after server-side verification with Cashfree (status `PAID` + amount match); checkout requestIds are idempotent per user; no dangerous rendering or execution sinks exist. The six open leads are concentrated in **deployment-coupled payment plumbing** (environment mismatch, reconciliation, integrity pinning) and **absent hardening layers** (rate limiting, frame protection) — none is a demonstrated cross-principal compromise.

## Confirmed findings

**None.** No record reached `confirmed`: the skill's candidate gate requires a bounded local observed result, and target-controlled execution was unavailable on this host. Six strong source-grounded leads are recorded as `needs_validation` — they carry **no severity** until validated.

## NEEDS VALIDATION (leads, not findings)

| # | Fingerprint | Lead | Decisive blocker |
| --- | --- | --- | --- |
| 1 | `checkout/cashfree-sdk-mode-hardcoded-sandbox` | Checkout SDK hardcoded to `sandbox` while server honors `CASHFREE_ENV` → online payments cannot complete in production | Requires running checkout against a production-configured deployment |
| 2 | `payments/no-reconciliation-webhook` | Completed payment can stay unrecorded if the post-modal verify call fails — no webhook/reconciliation exists | Requires observing PSP state across a forced verify failure |
| 3 | `app/checkout-frame-ancestors-unset` | No frame-blocking header configured anywhere in the repo → checkout is frameable if hosting adds none | Deployed response headers are the decisive fact |
| 4 | `payments/customer-email-client-asserted` | PSP `customer_email` comes from client-side session data, unvalidated server-side (attribution itself is correct) | Requires Clerk JWT claim check + PSP observation |
| 5 | `payments/create-order-no-rate-limit` | Any authenticated account can generate unbounded Cashfree orders (operator quota) | Quota impact observable only in the PSP dashboard |
| 6 | `checkout/cashfree-sdk-no-integrity-pin` | Payment-context SDK loaded from provider CDN with no SRI/pin (vendor-documented trade-off) | Provider distribution integrity is not source-visible |

Full traces, evidence, and step-by-step validation plans: see `NEEDS-VALIDATION.md`.

## Hardening notes (non-findings)

- **Bag re-population after order:** the server clears the bag on order insert (`convex/orders.ts:218`), but the signed-in client still holds its old items and the debounced sync (`components/store-provider.tsx:102`) re-writes them. Self-impact only (no boundary crossed) — clear client bag state on successful order placement.
- **Unbounded per-user lists:** `orders.mine` has no pagination and `addresses.add` has no per-user cap — self-data growth only; paginate/cap as the data grows.
- **No admin/order-status path exists** — no source path advances `status` past `placed`; an operator backend should be designed with its own authorization boundary when needed.
- **Git history:** the pre-rebuild commit (`11befca`) tracked a Supabase `.env` containing publishable/anon keys and a project id — public-by-design values, not secret-class; do not add secret-class values to any tracked `.env*` file (Cashfree secrets belong in Convex env).
- **Edge route protection:** `middleware.ts` is a documented passthrough; client-side guards are UX only. The enforcing boundary is per-function auth in Convex, which is sound — but `clerkMiddleware` can add defense-in-depth once keys exist.
- **CSP beyond frame-ancestors** (script-src, connect-src for the Cashfree SDK and Convex endpoints) would constrain the trust granted to the vendor script in lead 6.
- **Dependency CVEs:** `npm audit` requires registry access (prohibited this run) — owner should run it in CI.

## Positive source patterns (verified)

- Server-side price/quantity re-validation and recomputation — client prices never trusted (`convex/validation.ts`, `convex/bags.ts`, `lib/catalog.ts`).
- Payment verified with the PSP server-side (`PAID` + amount tolerance ≤ ₹1) before an order is recorded (`convex/orders.ts:125-142`).
- Idempotent order insertion on `(clerkId, requestId)`; deterministic PSP order ids prevent replay double-charges (`convex/orders.ts:170-174`, `lib/cashfree.ts`).
- Owner scoping on every multi-user table via the auth-derived `clerkId` (`orders`, `bags`, `addresses`).
- No `dangerouslySetInnerHTML`/`innerHTML`/`eval`/`child_process` anywhere; all external URLs HTTPS; secrets live only in Convex deployment env; only `.env.example` is tracked.

## Coverage summary (ledger)

| State | Count |
| --- | --- |
| `covered` | 10 |
| `candidate` | 6 (all carried as `needs_validation` leads above) |
| `deferred` | 1 — `convex/users.ts` self-scope write surface (`ensure`/`updateName`/`me`), accepted by the final coverage-critic after the single quick-profile hunter wave (`quick_profile_final_critic`); low-risk (writes only the caller's own profile row), first assignment due next run |
| `out_of_scope` | 2 — CI workflows and deployment manifests (none exist in the repository) |

Final coverage-critic result: accepted one missing unit (users.ts, recorded `deferred`), no reassignments, `stop: true`. **Not a complete-coverage claim** — see the quick-profile disclosure above.

## Artifacts

`run-metadata.json` · `architecture.md` · `coverage-ledger.json` · `findings.json` · `NEEDS-VALIDATION.md` · `FINDINGS-DETAIL.md` (empty — no confirmed medium+ records) · this report. Hunters' hardening notes are retained in ledger bookkeeping.
