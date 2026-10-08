import type { ReactNode } from "react";

// Marks content the brief allows us to leave open (missing links or imagery)
// so a visitor never mistakes it for a finished page.
export function PlaceholderNote({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  const colour = tone === "dark" ? "border-cream/40 text-cream/75" : "border-muted/50 text-muted";
  return <p className={`mt-6 inline-block border border-dashed px-3 py-2 text-caption ${colour}`}>Placeholder: {children}</p>;
}
