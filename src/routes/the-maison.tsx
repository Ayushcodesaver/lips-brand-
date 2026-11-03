import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/the-maison")({
  head: () => ({
    meta: [
      { title: "The Maison — Maison Vell Beauty" },
      {
        name: "description",
        content:
          "The story of Maison Vell Beauty: a Paris atelier devoted to hand-mixed nail colour since 1987.",
      },
      { property: "og:title", content: "The Maison — Maison Vell Beauty" },
      {
        property: "og:description",
        content:
          "A Paris atelier devoted to hand-mixed nail colour since 1987. Craft, colour and care.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TheMaison,
});

function TheMaison() {
  return (
    <iframe
      src="/the-maison.html"
      title="The Maison — Maison Vell Beauty"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}
