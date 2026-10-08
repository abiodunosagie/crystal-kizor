"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/track";

type Props = {
  href: string;
  event: string;
  params?: Record<string, string>;
  className?: string;
  children: ReactNode;
};

// A plain link that reports its click. External links open in a new tab;
// mailto links and in-page anchors stay where they are.
export function TrackedLink({ href, event, params, className, children }: Props) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={className}
      onClick={() => track(event, params)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
