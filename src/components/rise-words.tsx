"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/lib/motion";

// Each word rises from behind its own mask. Words (not measured lines) keep the
// effect correct at every width; reduced motion skips the movement entirely via
// MotionConfig, and data-reveal lets the <noscript> rule show it without JS.
export function RiseWords({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            data-reveal
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, delay: delay + i * 0.06, ease: EASE_OUT }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}
