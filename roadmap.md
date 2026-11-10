# Roadmap

- [x] Full website — campaign pages ported natively to Next.js (home/lookbook, shop, beauty, the maison, editorial).
- [x] Customer sign-up, sign-in and account details via Clerk; saved addresses in Convex.
- [x] Product-aware bag and wishlist, guest state with merge on sign-in, product detail pages.
- [x] Shipping and review checkout with address validation and order creation.
- [x] Online payment gateway — Cashfree (UPI / cards / netbanking) with server-side verification; COD preserved.
- [x] Order confirmation and private order history.
- [x] Shipping, returns and FAQ pages in the original light-pink design.
- [x] Complete page structure — collections, new arrivals, best sellers, shades, search, payment results,
      account sub-pages (profile / orders / addresses), contact, track order, nail care, payment information
      and all five legal policies; recommended header/footer navigation and sitemap.
- [ ] Phase 2 — brand storytelling pages: our philosophy, ingredients & formula, the colour story,
      beauty rituals, press & media, store locator.
- [ ] Production: complete Cashfree KYC + set `CASHFREE_ENV=production`; add Cashfree webhook for async payment states; set Clerk + Convex to production keys.
