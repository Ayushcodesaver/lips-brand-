# UI-SPEC — Phase 1: Design Refinement (commerce surfaces only)

**Scope:** commerce/interaction pages. Campaign pages (`components/marketing/*`) are LOCKED — their hand-tuned scale is out of scope.

## Typography contract (declared scale)

| Token | Value | Role | Font |
| --- | --- | --- | --- |
| `--text-eyebrow` | 10px / 0.22em / uppercase / `--dim` | eyebrow labels | Michroma |
| `--text-title` | 13px / 0.14em / uppercase / `--ink` | panel headings, product names | Michroma |
| `--text-em` | 15px / normal | prices, order totals | Inter |
| `--text-body` | 14px / relaxed / `--mid` | body copy | Inter |
| `--text-meta` | 12px / `--dim` or `--mid` | meta lines, captions | Inter |
| Tailwind `text-xs` | 12px | = `--text-meta` (allowed alias) | — |
| Tailwind `text-sm` | 14px | = `--text-body` (allowed alias) | — |
| Tailwind `text-lg`/`xl`/`2xl` | 18/20/24px | page-level emphasis (sparingly) | — |

**Forbidden:** arbitrary `text-[Npx]` font sizes in commerce pages. Implementation: semantic classes `.t-eyebrow/.t-title/.t-em/.t-body/.t-meta` in `app/globals.css`.

## Interaction contract

1. **Destructive confirmation — full inventory (phase 1 final):**
   - **Saved address deletion** (`account/addresses`): inline two-step confirm — "Remove this address?" → [Remove address] / [Keep]. Irrecoverable persisted-data loss → confirmed.
   - **Bag item removal**: one-click — recoverable (re-add from any product page), and checkout still re-validates server-side. No confirm by design.
   - **Wishlist toggle**: one-click — recoverable. No confirm by design.
   - **Sign out** (`account`): one-click — reversible (sign back in); no data loss. No confirm by design.
   - Rule: **confirm exactly the irrecoverable**; anything re-obtainable in one gesture stays frictionless.
2. **Loading states:** every async read has a branded state — `BrandLoader` (three pulsing ink dots + copy) on account, orders, order detail, track-order, checkout saved-addresses, profile; loading is never conflated with empty.
3. **Error boundaries:** `app/error.tsx` catches route/Convex errors with brand voice, the error digest for support, and a real retry; `app/not-found.tsx` brands 404s. Framework default crash screens never render.
4. **Error copy:** checkout catch fallback is brand voice: "The maison could not complete your request — nothing has been charged. Please try again."

## Non-goals

Campaign page scale unification (rejected at checkpoint), skeletons for every surface, focal hero bands.
