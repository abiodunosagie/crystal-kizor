"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { TrackedLink } from "@/components/tracked-link";
import { track } from "@/lib/track";

const links = [
  { href: "#about", label: "About" },
  { href: "#build", label: "Build" },
  { href: "#teach", label: "Teach" },
  { href: "#give", label: "Give" },
];

export function SiteHeader() {
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 24));

  // Highlights the section crossing the middle of the viewport.
  useEffect(() => {
    const sections = ["#top", ...links.map((l) => l.href), "#next"]
      .map((href) => document.querySelector<HTMLElement>(href))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        // "#top" and "#next" are watched only so the highlight clears in the hero
        // and after the last chapter.
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id === "top" || e.target.id === "next" ? null : `#${e.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => {
      observer.disconnect();
    };
  }, []);

  // Lenis is paused while the menu is open, so a menu link closes the menu,
  // resumes Lenis and then scrolls; otherwise the jump would be swallowed.
  const goFromMenu = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => {
      if (lenis) {
        lenis.start();
        lenis.scrollTo(href);
      } else {
        document.querySelector(href)?.scrollIntoView();
      }
    });
  };

  // The menu only exists below md; if the viewport grows past it (rotation,
  // split view, resize) close it so nothing stays locked behind it.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const close = () => desktop.matches && setOpen(false);
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);

  // While open: pause Lenis (wheel and touch), make the page behind inert so
  // Tab stays in the menu, and hand focus back to the toggle on close.
  useEffect(() => {
    if (!open) return;
    const behind = [document.querySelector("main"), document.querySelector("footer")].filter(Boolean) as HTMLElement[];
    const toggle = toggleRef.current;
    lenis?.stop();
    behind.forEach((el) => el.setAttribute("inert", ""));
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      behind.forEach((el) => el.removeAttribute("inert"));
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open, lenis]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid || open ? "border-b border-line bg-cream" : "border-b border-transparent"
      }`}
    >
      <div className="gutter mx-auto flex h-16 max-w-[1440px] items-center justify-between md:h-[72px]">
        <a href="#top" aria-label="Crystal Kizor, back to top" onClick={() => setOpen(false)}>
          <Image src="/brand/logo-horizontal.webp" alt="Crystal Kizor" width={1070} height={92} unoptimized className="h-[13px] w-auto md:h-[15px]" />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={active === l.href ? "location" : undefined}
              className={`border-b py-1 text-[0.95rem] font-medium transition-colors hover:text-ink ${
                active === l.href ? "border-ink text-ink" : "border-transparent text-muted"
              }`}
            >
              {l.label}
            </a>
          ))}
          <TrackedLink
            href="#next"
            event="cta_click"
            params={{ location: "header", target: "where_next" }}
            className="bg-ink px-5 py-2.5 text-[0.9rem] font-semibold text-cream transition-colors hover:bg-earth"
          >
            Work with Crystal
          </TrackedLink>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 p-2 text-[0.95rem] font-semibold md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-menu"
            aria-label="Main"
            className="gutter fixed inset-x-0 bottom-0 top-16 flex flex-col overflow-y-auto bg-cream pt-8 pb-10 md:hidden"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="flex flex-col">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-line"
                >
                  <a
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={l.href}
                    onClick={(e) => goFromMenu(e, l.href)}
                    className="display block py-4 text-[2.6rem]"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href="#next"
              onClick={(e) => {
                track("cta_click", { location: "mobile_menu", target: "where_next" });
                goFromMenu(e, "#next");
              }}
              className="mt-auto block w-full bg-ink py-4 text-center font-semibold text-cream"
            >
              Work with Crystal
            </a>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
