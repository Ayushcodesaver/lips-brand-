import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/beauty")({
  head: () => ({
    meta: [
      { title: "Beauty — The Beauty Ritual | Maison Vell Beauty" },
      {
        name: "description",
        content:
          "The Maison Vell beauty ritual: four steps to a salon-perfect manicure at home, from preparation to high-shine seal.",
      },
      { property: "og:title", content: "Beauty — The Beauty Ritual | Maison Vell Beauty" },
      {
        property: "og:description",
        content:
          "Four steps, ten minutes, and a finish that holds its shine for a week or more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Beauty,
});

function Beauty() {
  return (
    <iframe
      src="/beauty.html"
      title="The Beauty Ritual — Maison Vell Beauty"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}
