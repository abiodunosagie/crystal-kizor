import Image from "next/image";
import { Photo } from "@/components/photo";
import { Reveal } from "@/components/reveal";
import { person, pillars, ventures, type Pillar } from "@/lib/content";

const order: Pillar[] = ["build", "teach", "give"];

export function About() {
  return (
    <section id="about" className="gutter mx-auto max-w-[1440px] py-28 md:py-40">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
        <Reveal className="md:sticky md:top-28 md:col-span-5 md:self-start">
          <div className="relative aspect-[6/5] overflow-hidden bg-sand md:aspect-[4/5]">
            <Photo
              name="crystal-arms-crossed"
              alt="Crystal Kizor with arms folded in front of a wall of site plans, renders and material swatches"
              sizes="(min-width: 768px) 38vw, 100vw"
            />
          </div>
        </Reveal>

        <div className="md:col-span-6 md:col-start-7">
          <Reveal>
            <p className="eyebrow text-earth">Who she is</p>
            <h2 className="display mt-5 text-[2.6rem] md:text-[3.6rem]">
              One question runs through all of her work.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <blockquote className="display mt-8 border-l border-earth pl-6 text-[1.7rem] italic leading-tight text-earth md:text-[2rem]">
              &ldquo;{person.question}&rdquo;
            </blockquote>
            <p className="mt-3 pl-6 text-caption text-muted">The question Studio COKA begins with</p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-[58ch]">
              Crystal answers it first as an architect, with buildings that work with heat, light and air instead of
              fighting them. Then she keeps going: into the furniture people live with, the education architects
              receive, the stages where the built environment is debated, and the young people who will inherit it.
              Different brands, one conviction. Good design should make everyday life better, and it should be built
              for the place it stands in.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-8 flex flex-col gap-1.5 text-[0.95rem] text-muted">
              {person.credentials.map((c) => (
                <li key={c.label}>{c.label}</li>
              ))}
            </ul>
            <Image
              src="/brand/logo-signature.webp"
              alt="Crystal Kizor signature"
              width={812}
              height={266}
              unoptimized
              className="mt-10 h-auto w-[180px]"
            />
          </Reveal>
        </div>
      </div>

      <div className="mt-28 md:mt-40">
        <Reveal>
          <p className="eyebrow text-earth">What she is building</p>
          <h2 className="display mt-5 max-w-[20ch] text-[2.6rem] md:text-[3.6rem]">
            Three ways of building, one body of work.
          </h2>
        </Reveal>

        <ol className="mt-14 border-t border-ink">
          {order.map((key, i) => {
            const p = pillars[key];
            const items = ventures.filter((v) => v.pillar === key);
            return (
              <Reveal as="li" key={key} delay={i * 0.06} className="border-b border-line">
                <div className="grid grid-cols-1 gap-6 py-10 md:grid-cols-12 md:gap-10 md:py-12">
                  <div className="md:col-span-4">
                    <span className="text-caption font-semibold text-earth">{p.index}</span>
                    <h3 className="display mt-2 text-[3.4rem] leading-none md:text-[4.6rem]">
                      <a href={`#${key}`} className="transition-colors hover:text-earth">
                        {p.title}
                      </a>
                    </h3>
                    <p className="mt-3 text-muted">{p.verb}</p>
                  </div>
                  <ul className="flex flex-col gap-5 md:col-span-7 md:col-start-6">
                    {items.map((v) => (
                      <li key={v.id} className="grid grid-cols-1 gap-1 sm:grid-cols-[13rem_1fr] sm:gap-6">
                        {v.href ? (
                          <a href={v.href} className="font-semibold underline-offset-4 hover:text-earth hover:underline">
                            {v.name}
                          </a>
                        ) : (
                          <span className="font-semibold">{v.name}</span>
                        )}
                        <span className="text-muted">{v.line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
