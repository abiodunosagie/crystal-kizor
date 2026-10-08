import { ButtonLink } from "@/components/button-link";
import { Photo } from "@/components/photo";
import { PlaceholderNote } from "@/components/placeholder-note";
import { Reveal } from "@/components/reveal";
import { mailto, pillars, subjects, venture } from "@/lib/content";

export function Give() {
  const ako = venture("ako");
  const aliveAndFree = venture("alive-and-free");
  return (
    <section id="give" className="gutter mx-auto max-w-[1440px] py-28 md:py-40">
      <Reveal>
        <p className="eyebrow text-earth">
          {pillars.give.index} · {pillars.give.title}
        </p>
        <h2 className="display mt-6 max-w-[20ch] text-[2.8rem] md:text-[4.4rem]">
          The longest building project is a generation.
        </h2>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-7">
          <div className="relative aspect-[6/5] overflow-hidden bg-sand">
            <Photo
              name="crystal-white-shirt"
              alt="Crystal Kizor in a white shirt at her studio desk, chin resting on her hand"
              sizes="(min-width: 768px) 55vw, 100vw"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 md:self-end">
          <h3 className="display text-[2.4rem] md:text-[3rem]">{ako.name}</h3>
          <p className="mt-5 text-muted">{ako.line}</p>
          <ButtonLink
            href={mailto(subjects.ako)}
            event="generate_lead"
            params={{ location: "give", lead_type: "ako_partner" }}
            variant="ink"
            className="mt-8 sm:w-full"
          >
            Partner, donate or volunteer
          </ButtonLink>
        </Reveal>
      </div>

      <Reveal className="mt-24 md:mt-32">
        <div className="grid grid-cols-1 gap-8 border-y border-ink py-14 md:grid-cols-12 md:gap-10 md:py-20">
          <div className="md:col-span-5">
            <h3 className="display text-[2.4rem] md:text-[3rem]">{aliveAndFree.name}</h3>
            <p className="mt-2 font-semibold text-earth">A Christian youth movement</p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="display text-[1.7rem] leading-snug md:text-[2.1rem]">
              Helping young people walk in truth, healing, freedom, identity, purpose and life in Christ.
            </p>
            <PlaceholderNote>movement page link to follow.</PlaceholderNote>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
