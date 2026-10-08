import { ButtonLink } from "@/components/button-link";
import { Reveal } from "@/components/reveal";
import { TrackedLink } from "@/components/tracked-link";
import { contact, doors, mailto, subjects } from "@/lib/content";

export function NextSteps() {
  return (
    <section id="next" className="bg-ink text-cream">
      <div className="gutter mx-auto max-w-[1440px] py-28 max-md:text-center md:py-40">
        <Reveal>
          <h2 className="display mx-auto max-w-[16ch] md:mx-0 text-[2.8rem] md:text-[4.4rem]">Find the right door.</h2>
        </Reveal>

        <ul className="mt-16 border-t border-cream/30">
          {doors.map((d) => (
            <li key={d.id} className="border-b border-cream/20">
              <TrackedLink
                href={d.href}
                event={d.event}
                params={{ location: "next", door: d.id, ...(d.lead ? { lead_type: d.lead } : {}) }}
                className="group grid grid-cols-1 gap-2 py-7 transition-colors hover:bg-cream/5 md:grid-cols-12 md:items-baseline md:gap-10 md:px-4"
              >
                <span className="text-cream/75 md:col-span-5">{d.who}</span>
                <span className="display text-[2rem] md:col-span-4 md:text-[2.4rem]">{d.go}</span>
                <span className="font-semibold text-earth-soft md:col-span-3 md:text-right">
                  {d.action}{" "}
                  <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </TrackedLink>
            </li>
          ))}
        </ul>

        <Reveal className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-12">
          <p className="display text-[1.9rem] leading-tight md:col-span-6 md:text-[2.4rem]">
            Not sure which door is yours? Start with one email.
          </p>
          <div className="md:col-span-4 md:col-start-9 md:self-end">
            <ButtonLink
              href={mailto(subjects.general)}
              event="generate_lead"
              params={{ location: "next", lead_type: "general" }}
              variant="cream"
              className="py-4 sm:w-full"
            >
              {contact.email}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
