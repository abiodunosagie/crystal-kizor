import Image from "next/image";
import { SignOff } from "@/components/sign-off";
import { TrackedLink } from "@/components/tracked-link";
import { social, ventures } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="bg-cream">
      <SignOff />
      <div className="gutter mx-auto grid max-w-[1440px] grid-cols-1 gap-12 py-16 max-md:text-center md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Image src="/brand/logo-social.webp" alt="Crystal Kizor monogram" width={432} height={436} unoptimized className="center-mobile h-auto w-16" />
          <p className="center-mobile mt-6 max-w-[34ch] text-muted">Architect and Design Director of Studio COKA, Enugu, Nigeria.</p>
        </div>

        <nav aria-label="The work" className="md:col-span-3 md:col-start-6">
          <p className="eyebrow text-muted">The work</p>
          <ul className="mt-4 flex flex-col gap-2">
            {ventures.map((v) => (
              <li key={v.id}>
                <TrackedLink
                  href={v.href ?? v.anchor}
                  event={v.href?.startsWith("http") ? "outbound_click" : "route_select"}
                  params={{ location: "footer", target: v.id }}
                  className="hover:text-earth"
                >
                  {v.name}
                </TrackedLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Social" className="md:col-span-3 md:col-start-10">
          <p className="eyebrow text-muted">Follow</p>
          <ul className="mt-4 flex flex-col gap-2">
            {social.map((s) => (
              <li key={s.href}>
                <TrackedLink href={s.href} event="outbound_click" params={{ location: "footer", target: s.label }} className="hover:text-earth">
                  {s.label} <span className="text-muted">{s.handle}</span>
                </TrackedLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="gutter mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-line py-6 text-[0.85rem] text-muted max-md:pb-24 max-md:text-center md:flex-row md:justify-between">
        <p>© 2026 Crystal Kizor</p>
        <p>Concept landing page prepared for Studio COKA, October 2026.</p>
        <a href="#top" className="font-semibold text-ink hover:text-earth max-md:hidden">
          Back to top <span aria-hidden>↑</span>
        </a>
      </div>
    </footer>
  );
}
