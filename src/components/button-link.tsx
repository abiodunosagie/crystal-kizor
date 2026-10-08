import type { ReactNode } from "react";
import { TrackedLink } from "@/components/tracked-link";

const variants = {
  ink: "bg-ink text-cream hover:bg-earth",
  cream: "bg-cream text-ink hover:bg-earth-soft",
  outline: "border border-ink hover:bg-ink hover:text-cream",
  "outline-light": "border border-cream/40 text-cream hover:border-cream",
};

type Props = {
  href: string;
  event: string;
  params?: Record<string, string>;
  variant: keyof typeof variants;
  className?: string;
  children: ReactNode;
};

// Full width on phones (thumb target), natural width from the sm breakpoint.
export function ButtonLink({ variant, className = "", ...rest }: Props) {
  return (
    <TrackedLink
      {...rest}
      className={`block w-full px-6 py-3.5 text-center font-semibold transition-colors sm:inline-block sm:w-auto ${variants[variant]} ${className}`}
    />
  );
}
