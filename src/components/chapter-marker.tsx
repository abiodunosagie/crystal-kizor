import { pillars, type Pillar } from "@/lib/content";

// "01 · Build": ties each chapter back to the index in the About section.
export function ChapterMarker({ pillar, tone = "light" }: { pillar: Pillar; tone?: "light" | "dark" }) {
  const p = pillars[pillar];
  return (
    <p className={`eyebrow ${tone === "dark" ? "text-earth-soft" : "text-earth"}`}>
      {p.index} · {p.title}
    </p>
  );
}
