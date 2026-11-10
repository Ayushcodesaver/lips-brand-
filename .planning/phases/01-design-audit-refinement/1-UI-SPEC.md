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

1. **Destructive confirmation:** every delete of persisted user data (saved addresses) requires an inline two-step confirm — "Remove this address?" → [Remove address] / [Keep]. Bag item removal stays one-click (recoverable by re-adding).
2. **Loading states:** bare "Loading…" strings are replaced by a branded loader component (three pulsing ink dots + copy "Preparing your collection…") used by account/order reads.
3. **Error copy:** checkout catch fallback becomes brand voice: "The maison could not complete your request — nothing has been charged. Please try again."

## Non-goals

Campaign page scale unification (rejected at checkpoint), skeletons for every surface, focal hero bands.
