"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { EASE_OUT } from "@/lib/motion";

// Phones only (desktop uses the footer link). Its outline fills as the page is
// read, so it doubles as a progress indicator. Kept clear of the home bar.
export function BackToTop() {
  const lenis = useLenis();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > window.innerHeight * 1.5));

  // Each time the button appears, start the outline at the true position: after
  // a long jump (menu link, anchor) the spring would otherwise sweep up from 0.
  useEffect(() => {
    if (visible) progress.jump(scrollYProgress.get());
  }, [visible, progress, scrollYProgress]);

  const toTop = () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0 });
    document.querySelector<HTMLElement>("header a")?.focus({ preventScroll: true });
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          className="group fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-40 flex h-12 w-12 items-center justify-center bg-ink text-cream md:hidden"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 48 48" fill="none">
            <rect x="1" y="1" width="46" height="46" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
            {/* Starts at the top centre and runs clockwise, like a reading gauge. */}
            <motion.path
              d="M24 1 H47 V47 H1 V1 H24"
              stroke="var(--color-earth-soft)"
              strokeWidth="2"
              style={{ pathLength: progress }}
            />
          </svg>
          <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="relative transition-transform duration-300 group-active:-translate-y-0.5">
            <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
          </svg>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
