"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/button-link";
import { Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { featured } from "@/lib/content";

// Drag (or use the arrow keys) to compare the building before and after.
// A native range input carries the interaction, so it works with touch,
// mouse, keyboard and screen readers without custom pointer handling.
function BeforeAfter() {
  const [split, setSplit] = useState(50);
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-night md:aspect-[16/9]">
      <Photo
        name="tesh-after"
        alt="TESH eye hospital after the renovation: lilac facade, yellow canopy and a sculptural purple eye"
        sizes="(min-width: 768px) 92vw, 100vw"
      />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
        <Photo
          name="tesh-before"
          alt="The same building before: a worn two-storey block with old shop signs and a dirt forecourt"
          sizes="(min-width: 768px) 92vw, 100vw"
        />
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-y-0" style={{ left: `${split}%` }}>
        <div className="h-full w-px -translate-x-1/2 bg-cream" />
        <div className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-cream text-ink">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 5 2 9l4 4M12 5l4 4-4 4" />
          </svg>
        </div>
      </div>

      <span className="pointer-events-none absolute bottom-3 left-3 bg-night px-2 py-1 text-caption font-semibold text-cream">Before</span>
      <span className="pointer-events-none absolute bottom-3 right-3 bg-cream px-2 py-1 text-caption font-semibold text-ink">After</span>

      <input
        type="range"
        min={0}
        max={100}
        value={split}
        onChange={(e) => setSplit(Number(e.target.value))}
        aria-label="Compare the building before and after the renovation"
        aria-valuetext={`${split}% before`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

export function FeaturedProject() {
  return (
    <div id="featured" className="gutter mx-auto max-w-[1440px] pt-24 md:pt-32">
      <div className="border-t border-cream/20 pt-14">
        <Reveal className="grid grid-cols-1 gap-6 max-md:text-center md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <p className="eyebrow text-earth-soft">Featured project</p>
            <h3 className="display mt-4 text-[2.6rem] md:text-[3.8rem]">{featured.title}</h3>
          </div>
          <p className="center-mobile max-w-[44ch] text-cream/80 md:col-span-4 md:col-start-9 md:self-end">
            {featured.name}, {featured.place}. {featured.story}
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <BeforeAfter />
          <p className="mt-3 text-caption text-cream/70 max-md:text-center">
            Drag to compare. Photographs: Studio COKA.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          <Reveal className="max-md:text-center md:col-span-5">
            <blockquote className="display text-[1.8rem] italic leading-tight text-earth-soft md:text-[2.2rem]">
              &ldquo;{featured.quote}&rdquo;
            </blockquote>
            <p className="mt-3 text-caption text-cream/70">From the Studio COKA case study</p>
          </Reveal>
          <div className="md:col-span-6 md:col-start-7">
            <dl className="grid grid-cols-1 border-t border-cream/20 sm:grid-cols-3">
              {featured.figures.map((f) => (
                <div key={f.value} className="flex flex-col-reverse border-b border-cream/20 py-6 max-sm:text-center sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0">
                  <dt className="mt-2 text-[0.95rem] text-cream/75">
                    <span className="sr-only">{f.value} </span>
                    {f.label}
                  </dt>
                  <dd aria-hidden className="display text-[3rem] leading-none text-cream md:text-[3.4rem]">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 max-md:text-center">
              <ButtonLink
                href={featured.href}
                event="outbound_click"
                params={{ location: "featured", target: "tesh_case_study" }}
                variant="outline-light"
              >
                Read the case study
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
