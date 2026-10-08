"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { EASE_OUT } from "@/lib/motion";

// The page closes on her own marks: the signature is written in (a left to
// right wipe of the signature artwork), then the full wordmark settles across
// the width of the page.
export function SignOff() {
  const reduce = usePrefersReducedMotion();
  return (
    <div className="gutter mx-auto max-w-[1440px] pt-20 md:pt-28">
      <motion.div
        data-reveal
        className="w-[min(220px,55vw)] max-md:mx-auto"
        initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: reduce ? 0 : 1.6, ease: [0.65, 0, 0.35, 1] }}
      >
        <Image src="/brand/logo-signature.webp" alt="Crystal Kizor signature" width={812} height={266} unoptimized className="h-auto w-full" />
      </motion.div>
      <motion.div
        data-reveal
        className="mt-10 md:mt-14"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -5% 0px" }}
        transition={{ duration: 1.2, delay: reduce ? 0 : 0.5, ease: EASE_OUT }}
      >
        <Image src="/brand/logo-primary.webp" alt="Crystal Kizor" width={1532} height={688} unoptimized className="h-auto w-full" />
      </motion.div>
    </div>
  );
}
