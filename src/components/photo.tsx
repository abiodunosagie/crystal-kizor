import Image from "next/image";
import manifest from "@/lib/image-manifest.json";

type Entry = { width: number; height: number; blur: string };
const images = manifest.images as Record<string, Entry>;

type Props = {
  name: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  // "cover" fills a sized parent; "intrinsic" keeps the photo's own ratio.
  fit?: "cover" | "intrinsic";
};

// Every photograph goes through here so it gets its real dimensions (no
// layout shift), a blurred placeholder and the pre-built responsive sizes.
export function Photo({ name, alt, sizes, className, priority, fit = "cover" }: Props) {
  const entry = images[name];
  if (!entry) throw new Error(`Unknown image "${name}". Add it to scripts/prepare-assets.mjs.`);
  const common = {
    src: name,
    sizes,
    priority,
    placeholder: "blur" as const,
    blurDataURL: entry.blur,
  };
  if (fit === "intrinsic") {
    return <Image {...common} alt={alt} width={entry.width} height={entry.height} className={className} />;
  }
  return <Image {...common} alt={alt} fill className={`object-cover ${className ?? ""}`} />;
}
