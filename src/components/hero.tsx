"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Photo } from "@/components/photo";
import { TrackedLink } from "@/components/tracked-link";
import { doors, person } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

// The statement and intro paragraph are the largest paint on phones, so they
// ship as plain HTML with no entrance motion; the rest moves with transforms
// only, never starting hidden.
const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // The image is 12% taller than its frame (inset -6%), so it may drift at most
  // 5% of its own height either way without exposing the frame behind it.
  const portraitY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-5%", "5%"]);

  return (
    <section ref={ref} id="top" className="gutter mx-auto max-w-[1440px] pt-24 md:pt-32">
      <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-10">
        <div className="md:col-span-7 md:pt-10">
          <motion.p
            className="eyebrow text-balance text-earth"
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            Architect · Designer · Founder of Studio COKA
          </motion.p>

          <h1 className="mt-6">
            <span className="sr-only">Crystal Kizor</span>
            <motion.span
              aria-hidden
              className="block"
              initial={{ y: 24 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.15, ease }}
            >
              <Image
                src="/brand/logo-primary.webp"
                alt=""
                width={1532}
                height={688}
                unoptimized
                priority
                className="h-auto w-full max-w-[640px]"
              />
            </motion.span>
          </h1>

          <p className="display mt-10 max-w-[18ch] text-[2.1rem] leading-[1.05] md:text-[2.9rem]">
            Building for this climate, and for the people in it.
          </p>
          <p className="mt-6 max-w-[52ch] text-muted">
            Crystal Kizor is {person.headlineFact} and the Design Director of
            Studio COKA. Architecture is where her work starts. From there it reaches into furniture, education, public
            speaking and the young people she believes will shape Africa&rsquo;s cities next.
          </p>
        </div>

        <div className="relative md:col-span-5">
          <motion.div
            className="relative aspect-[4/5] overflow-hidden bg-sand md:aspect-[2/3]"
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, delay: 0.1, ease }}
          >
            <motion.div className="absolute inset-[-6%_0]" style={{ y: portraitY }}>
              <Photo
                name="crystal-standing"
                alt="Crystal Kizor leaning on a stone worktop in her design studio, with drawings and material samples pinned behind her"
                sizes="(min-width: 768px) 40vw, 100vw"
                priority
                className="object-[50%_20%]"
              />
            </motion.div>
          </motion.div>
          <p className="mt-3 text-caption text-muted">Crystal Kizor, Design Director, Studio COKA</p>
        </div>
      </div>

      <div className="mt-16 md:mt-24">
        <p className="eyebrow text-muted">I&rsquo;m here to</p>
        <ul className="mt-4 grid grid-cols-1 border-t border-ink md:grid-cols-4">
          {doors
            .filter((d) => d.inHero)
            .map((d, i) => (
            <li key={d.id} className="border-b border-line md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
              <TrackedLink
                href={d.href}
                event={d.event}
                params={{ location: "hero", door: d.id, ...(d.lead ? { lead_type: d.lead } : {}) }}
                className="group flex h-full flex-col items-start gap-2 py-5 transition-colors hover:text-earth md:gap-0 md:py-7"
              >
                <span className="flex items-baseline gap-3">
                  <span className="text-caption font-semibold text-earth">{String.fromCharCode(65 + i)}</span>
                  <span className="display text-[1.65rem] md:text-[1.9rem]">{d.want}</span>
                </span>
                <span className="pl-6 text-[0.9rem] text-muted transition-transform duration-300 group-hover:translate-x-1 md:mt-6 md:pl-0">
                  {d.action} <span aria-hidden>→</span>
                </span>
              </TrackedLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
