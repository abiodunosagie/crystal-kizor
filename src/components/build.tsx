"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/button-link";
import { Photo } from "@/components/photo";
import { PlaceholderNote } from "@/components/placeholder-note";
import { Reveal } from "@/components/reveal";
import { contact, pillars, studioFacts, studioFrames, STUDIO_SOURCE, venture, type Frame } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

// How far the strip must travel for its last frame to end flush with the
// viewport. clientWidth, not innerWidth, so a visible scrollbar is excluded.
function useTravel(stripRef: React.RefObject<HTMLDivElement | null>) {
  const [travel, setTravel] = useState(0);
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const measure = () => setTravel(Math.max(0, el.scrollWidth - document.documentElement.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [stripRef]);
  return travel;
}

function FrameCard({ frame, index }: { frame: Frame; index: number }) {
  return (
    <figure className="w-[78vw] shrink-0 snap-start sm:w-[46vw] md:w-[30vw] lg:w-[26vw]">
      <div className="relative aspect-[4/5] overflow-hidden bg-night">
        <Photo
          name={frame.image}
          alt={`${frame.title}: ${frame.note}`}
          sizes="(min-width: 1024px) 26vw, (min-width: 768px) 30vw, 78vw"
        />
        <span
          className={`absolute left-3 top-3 px-2 py-1 text-caption font-semibold uppercase tracking-[0.05em] ${
            frame.status === "Completed" ? "bg-cream text-ink" : "bg-night text-cream"
          }`}
        >
          {frame.status}
        </span>
      </div>
      <figcaption className="mt-4 flex gap-3 text-[0.95rem]">
        <span className="font-semibold text-earth-soft">{String(index + 1).padStart(2, "0")}</span>
        <span>
          <span className="block font-semibold text-cream">{frame.title}</span>
          <span className="text-cream/75">{frame.note}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function Frames() {
  return (
    <>
      {studioFrames.map((f, i) => (
        <FrameCard key={f.image} frame={f} index={i} />
      ))}
    </>
  );
}

// Desktop with motion allowed: vertical scroll walks the pinned strip sideways.
function PinnedSequence() {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const travel = useTravel(track);
  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={outer} className="relative" style={{ height: `calc(100vh + ${travel}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max gap-8 px-[var(--gutter)]">
          <Frames />
        </motion.div>
        <div className="gutter mt-10">
          <div className="h-px w-full bg-cream/20">
            <motion.div className="h-px bg-earth-soft" style={{ width: progress }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Phones, and anyone who prefers reduced motion: a native swipe strip.
function SwipeStrip({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-5 overflow-x-auto px-[var(--gutter)] pb-4 [scrollbar-width:none] ${className}`}
    >
      <Frames />
    </div>
  );
}

function Sequence() {
  const reduce = usePrefersReducedMotion();
  return (
    <>
      <div className="hidden md:block">{reduce ? <SwipeStrip /> : <PinnedSequence />}</div>
      <SwipeStrip className="md:hidden" />
    </>
  );
}

export function Build() {
  const elevated = venture("elevated");
  return (
    <section id="build" className="bg-night text-cream">
      <div className="gutter mx-auto max-w-[1440px] pt-28 md:pt-40">
        <Reveal>
          <p className="eyebrow text-earth-soft">
            {pillars.build.index} · {pillars.build.title}
          </p>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <h2 className="display text-[2.8rem] md:text-[4.4rem]">
              Studio COKA. Built for this climate, designed for people.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:pt-3">
            <p className="text-cream/80">
              The flagship. A design-and-build studio in Enugu working across architecture, interiors and urban design,
              from first sketch to final handover. Every project is shaped by the climate, the site and the people who
              will use the space.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href={contact.studioHire}
                event="generate_lead"
                params={{ location: "build", lead_type: "studio_project" }}
                variant="cream"
              >
                Start a project
              </ButtonLink>
              <ButtonLink
                href={contact.studioSite}
                event="outbound_click"
                params={{ location: "build", target: "studio_site" }}
                variant="outline-light"
              >
                Visit studiocoka.com
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <dl className="mt-20 grid grid-cols-1 border-t border-cream/20 sm:grid-cols-3">
          {studioFacts.map((f, i) => (
            <Reveal
              key={f.value}
              delay={i * 0.08}
              className="flex flex-col-reverse border-b border-cream/20 py-8 sm:border-b-0 sm:border-r sm:px-8 sm:first:pl-0 sm:last:border-r-0"
            >
              <dt className="mt-3 max-w-[30ch] text-[0.95rem] text-cream/75">{f.label}</dt>
              <dd className="display text-[4rem] leading-none text-earth-soft md:text-[5.2rem]">{f.value}</dd>
            </Reveal>
          ))}
        </dl>
        <p className="mt-4 text-caption text-cream/70">
          Figures as published by{" "}
          <a href={STUDIO_SOURCE} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-cream">
            Studio COKA
          </a>
          .
        </p>

        <Reveal className="mt-24 md:mt-28">
          <p className="eyebrow text-earth-soft">Inside the work</p>
          <p className="mt-3 max-w-[48ch] text-cream/80">
            Nature Home, photographed on site, followed by two projects in design. Scroll or swipe to walk through.
          </p>
        </Reveal>
      </div>

      <div className="mt-10 md:mt-0">
        <Sequence />
      </div>

      <div id="elevated" className="gutter mx-auto max-w-[1440px] pb-28 pt-24 md:pb-40 md:pt-32">
        <div className="grid grid-cols-1 gap-10 border-t border-cream/20 pt-14 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="eyebrow text-earth-soft">Also under {pillars.build.title}</p>
            <h3 className="display mt-4 text-[2.6rem] md:text-[3.4rem]">{elevated.name}</h3>
            <p className="mt-4 max-w-[46ch] text-cream/80">
              Furniture and product design at the scale of the hand. {elevated.line}
            </p>
            <PlaceholderNote tone="dark">collection link and product photography to follow.</PlaceholderNote>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
            <div className="relative aspect-[6/5] overflow-hidden bg-night">
              <Photo
                name="crystal-desk"
                alt="Crystal Kizor at her desk surrounded by stone, timber and terrazzo material samples"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
            <p className="mt-3 text-caption text-cream/70">
              Material studies in the studio, shown until ELEvated photography is available.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
