# UI Review — Phase 1: Design Audit + Refinement

**Audited:** commit `96464c5`, source-only (screenshots NOT captured — no Playwright/Chrome in session; code-review audit per fallback rule). Overall: **17/24**.

## Pillar Scores

| Pillar | Score | Key evidence |
| --- | --- | --- |
| Copywriting | 3/4 | Luxury voice held everywhere; generics remain: "Save address"/"Save profile" (`account/addresses:79`, `account/profile:68`), bare "Loading…" (`account/orders:31`, `components/order-detail.tsx:34`), generic catch "Something went wrong. Please try again." (`checkout:143`) |
| Visuals | 3/4 | Strong focal hierarchy on campaign pages; all icon-only actions labeled (8 aria-labels, 0 unlabeled); commerce pages are panel-flat with no focal treatment of their own |
| Color | 4/4 | **0 hardcoded hex in commerce pages** — all via tokens (`--ink/--mid/--dim/--line/--ice`); product swatch hexes are catalog data, not UI; 60/30/10 holds (porcelain ground, white panels, ink actions) |
| Typography | 2/4 | **44 distinct size utilities** across commerce pages incl. arbitrary `text-[13px]`/`text-[15px]` — no declared scale; Michroma display vs Inter body discipline is clean, but size governance is absent |
| Spacing | 3/4 | Consistent Tailwind rhythm (`px-5`, `pb-24`, `gap-6/10`, `max-w-3xl/4xl/5xl`); few arbitrary values (`max-w-[220px]`, `md:grid-cols-[1fr_320px]`) — container system consistent |
| Experience Design | 2/4 | Loading = bare text, **0 skeletons**; **destructive `removeAddress` has no confirmation dialog** (grep: 0 confirm patterns in components); empty states excellent (branded bag/wishlist/search/orders); disabled/busy gating good (checkout step + busy states, online radio disabled when unconfigured) |

**Overall: 17/24** — no BLOCKERs (no task-breaking defect); WARNINGs below.

## Top 3 Priority Fixes

1. **Typography scale governance (WARNING, Typography 2/4)** — declare a size/weight scale in `app/globals.css` (CSS variables + `.wide` rules) and sweep commerce pages to it; kills the 44-utility sprawl and makes Michroma/Inter roles enforceable.
2. **Destructive-action confirmation (WARNING, Experience 2/4)** — address removal (`account/addresses`) deletes instantly; add an inline confirm step ("Remove this address? — Remove / Keep").
3. **Branded loading + error copy (WARNING, Copy 3/4 + Experience 2/4)** — replace bare "Loading…" with a brand pulse/skeleton; replace the generic checkout catch with brand copy ("The maison could not reach the payment desk — nothing has been charged.").

## Registry Safety Audit

Skipped — no `components.json` (shadcn not initialized), no third-party UI registries in use.

---

# RE-AUDIT — after refinement round 2 (Experience Design to 4/4)

**Audited:** post-`ac624d5` follow-up (error boundary, branded 404, checkout/profile loaders, destructive inventory). Overall: **20/24**.

| Pillar | Score | Change and evidence |
| --- | --- | --- |
| Copywriting | 3/4 | — (error copy now branded; "Save…" labels retained — functional, documented decision) |
| Visuals | 3/4 | — (focal treatment for commerce pages remains a phase-2 lead) |
| Color | 4/4 | — |
| Typography | 4/4 | **FIXED** — declared scale in `globals.css` with `.t-*` roles; grep: 0 arbitrary `text-[Npx]` in commerce pages |
| Spacing | 3/4 | — |
| Experience Design | **4/4** | **FIXED** — complete state coverage: loaders on every async read (8 files use `BrandLoader`; checkout addresses + profile included; loading ≠ empty on account); **destructive-action inventory complete and documented** in UI-SPEC (address delete = inline confirm — the only irrecoverable action; bag/wishlist/sign-out one-click by documented recoverability rule); **error boundaries exist** — branded `app/error.tsx` (retry + digest) and `app/not-found.tsx` (verified live: 404 renders the brand page); empty states branded; disabled/busy gating on checkout |

**Overall: 20/24** — Typography and Experience Design closed. Remaining leads for a future phase: focal treatment for commerce pages (Visuals), "Save…" label polish (Copy), arbitrary container values (Spacing, cosmetic).
