# Maison Vell Beauty — Project Context

## What This Is
Luxury nail-lacquer e-commerce site: Next.js 15 App Router, Clerk auth, Convex database,
Cashfree payments. Six signature shades, light-pink campaign aesthetic (#faf2f2 porcelain,
#f7ece9 ice, #eeddd9 lines, #16191f ink; Michroma display + Inter body).

## Current State
- 37 routes live: campaign pages (home carousel, shop, lookbook, beauty, the-maison, editorial),
  full commerce (product, bag, wishlist, checkout, order), account hub, support + legal pages.
- Cashfree online payments + COD; Clerk auth; guest localStorage mode pre-configuration.
- Security-audited (source-only, quick profile) at commit 0cddb71; fixes pushed 96464c5.

## Design Constraints (locked)
- Palette and typography must stay recognizably the original campaign identity.
- Michroma is display-only (uppercase tracking); Inter carries body copy.
- Single accent discipline: ink (#16191f) is the action color; pink tones are surface, never action.
