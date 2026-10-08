"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Lenis gives the page its weighted scroll and handles in-page anchors (the
// header offset comes from scroll-margin-top in globals.css). MotionConfig
// "user" drops transform animations for people who ask for reduced motion
// without changing the rendered markup.
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.09, anchors: true, stopInertiaOnNavigate: true }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}
