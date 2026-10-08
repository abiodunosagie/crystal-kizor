import manifest from "./image-manifest.json";

type Entry = { widths: number[] };
const images = manifest.images as Record<string, Entry>;

// next/image asks for a width; serve the smallest pre-built size that covers
// it, or the largest one we have.
export default function imageLoader({ src, width }: { src: string; width: number }) {
  const entry = images[src];
  if (!entry) return src;
  const chosen = entry.widths.find((w) => w >= width) ?? entry.widths[entry.widths.length - 1];
  return `/images/${src}-${chosen}.webp`;
}
