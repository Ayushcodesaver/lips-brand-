import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — The Nail Colour Collection | Maison Vell Beauty" },
      {
        name: "description",
        content:
          "Shop the six signature Maison Vell Beauty nail lacquers: Velvet Rouge, Nude Cashmere, Rose Silk, Champagne Veil, Midnight Noir and Pearl Ivory.",
      },
      { property: "og:title", content: "Shop — The Nail Colour Collection | Maison Vell Beauty" },
      {
        property: "og:description",
        content:
          "Six signature nail lacquers in a 21-free formula. Complimentary shipping over $60.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  return (
    <iframe
      src="/shop.html"
      title="Shop the nail colour collection — Maison Vell Beauty"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}
