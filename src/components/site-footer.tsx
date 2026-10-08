import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import { social, ventures } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="bg-cream">
      <div className="gutter mx-auto grid max-w-[1440px] grid-cols-1 gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Image src="/brand/logo-social.webp" alt="Crystal Kizor monogram" width={432} height={436} unoptimized className="h-auto w-20" />
          <p className="mt-6 max-w-[34ch] text-muted">Architect and Design Director of Studio COKA, Enugu, Nigeria.</p>
        </div>

        <nav aria-label="The work" className="md:col-span-3 md:col-start-6">
          <p className="eyebrow text-muted">The work</p>
          <ul className="mt-4 flex flex-col gap-2">
            {ventures.map((v) => (
              <li key={v.id}>
                {v.href ? (
                  <TrackedLink href={v.href} event="outbound_click" params={{ location: "footer", target: v.id }} className="hover:text-earth">
                    {v.name}
                  </TrackedLink>
                ) : (
                  <span className="text-muted">
                    {v.name} <span className="text-[0.8rem]">(link to follow)</span>
                  </span>
                )}
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
      <div className="gutter mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-line py-6 text-[0.85rem] text-muted md:flex-row md:justify-between">
        <p>© 2026 Crystal Kizor</p>
        <p>Concept landing page prepared for Studio COKA, October 2026.</p>
      </div>
    </footer>
  );
}
