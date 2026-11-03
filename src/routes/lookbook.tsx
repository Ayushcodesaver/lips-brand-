import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: "Lookbook — Shade Stories | Maison Vell Beauty" },
      {
        name: "description",
        content:
          "The Maison Vell Beauty lookbook: the story behind each of the six signature nail lacquer shades.",
      },
      { property: "og:title", content: "Lookbook — Shade Stories | Maison Vell Beauty" },
      {
        property: "og:description",
        content:
          "Six signature lacquers, each with its own temperament. The stories behind the colours.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Lookbook,
});

function Lookbook() {
  return (
    <iframe
      src="/editorial.html"
      title="Lookbook — Shade Stories | Maison Vell Beauty"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}
