import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Vell Beauty — The Nail Colour Collection" },
      {
        name: "description",
        content:
          "Six signature nail lacquers stand in depth. Drag, scroll or use the arrow keys to bring each shade forward.",
      },
      { property: "og:title", content: "Maison Vell Beauty — The Nail Colour Collection" },
      {
        property: "og:description",
        content: "A luxury nail lacquer campaign: six signature shades in glass, pigment and high shine.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/lookbook.html"
      title="Maison Vell Beauty nail colour collection"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}
