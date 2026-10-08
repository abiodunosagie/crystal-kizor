"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

// A photograph opens upward like a curtain as it enters the screen, then
// drifts a little slower than the page. Fills a sized, relative parent.
export function Curtain({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The image is 10% taller than the frame (inset -5%), so +-4% never shows an edge.
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-4%", "4%"]);

  return (
    <motion.div
      ref={ref}
      data-reveal
      className="absolute inset-0 overflow-hidden"
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      // clip-path is not covered by MotionConfig's reduced-motion handling.
      transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="absolute inset-[-5%_0]" style={{ y }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
