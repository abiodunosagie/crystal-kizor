import { ButtonLink } from "@/components/button-link";
import { Photo } from "@/components/photo";
import { PlaceholderNote } from "@/components/placeholder-note";
import { Reveal } from "@/components/reveal";
import { TrackedLink } from "@/components/tracked-link";
import { contact, journal, mailto, pillars, speakingTopics, subjects, venture } from "@/lib/content";

export function Teach() {
  const tea = venture("tea");
  return (
    <section id="teach" className="bg-paper">
      <div className="gutter mx-auto max-w-[1440px] py-28 md:py-40">
        <Reveal>
          <p className="eyebrow text-earth">
            {pillars.teach.index} · {pillars.teach.title}
          </p>
          <h2 className="display mt-6 max-w-[22ch] text-[2.8rem] md:text-[4.4rem]">
            What the studio learns, she gives back to the profession.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-6">
            <div className="relative aspect-[6/5] overflow-hidden bg-sand">
              <Photo
                name="crystal-microphone"
                alt="Crystal Kizor speaking into a studio microphone at her desk"
                sizes="(min-width: 768px) 46vw, 100vw"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-5 md:col-start-8">
            <h3 className="display text-[2.4rem] md:text-[3rem]">{tea.name}</h3>
            <p className="mt-2 font-semibold text-earth">TEA · education and media</p>
            <p className="mt-5 text-muted">{tea.line}</p>
            <PlaceholderNote>platform link to follow.</PlaceholderNote>
            <div className="mt-6">
              <ButtonLink
                href={contact.instagram}
                event="outbound_click"
                params={{ location: "teach", target: "instagram" }}
                variant="outline"
              >
                Follow Crystal on Instagram
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <div id="speaking" className="mt-24 grid grid-cols-1 gap-12 border-t border-line pt-16 md:mt-32 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-5">
            <h3 className="display text-[2.4rem] md:text-[3rem]">Speaking</h3>
            <p className="mt-5 max-w-[44ch] text-muted">
              Talks, conversations and engagements, grounded in the work of a practising architect and studio founder.
            </p>
            <div className="mt-8">
              <ButtonLink
                href={mailto(subjects.speaking)}
                event="generate_lead"
                params={{ location: "teach", lead_type: "speaking" }}
                variant="ink"
              >
                Invite Crystal to speak
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
            <p className="eyebrow text-muted">She speaks on</p>
            <ul className="mt-4 border-t border-ink">
              {speakingTopics.map((t) => (
                <li key={t} className="display border-b border-line py-4 text-[1.6rem] md:text-[1.9rem]">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div id="writing" className="mt-24 grid grid-cols-1 gap-12 border-t border-line pt-16 md:mt-32 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-5">
            <h3 className="display text-[2.4rem] md:text-[3rem]">Research &amp; writing</h3>
            <p className="mt-5 max-w-[44ch] text-muted">
              Architecture, research, writing and ideas under her own name. Recent notes from the Studio COKA journal:
            </p>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
            <ul className="border-t border-ink">
              {journal.map((j) => (
                <li key={j.title} className="border-b border-line">
                  <TrackedLink
                    href={contact.studioJournal}
                    event="outbound_click"
                    params={{ location: "writing", target: "journal" }}
                    className="group flex items-baseline justify-between gap-6 py-5"
                  >
                    <span>
                      <span className="block text-caption font-semibold uppercase tracking-[0.05em] text-earth">{j.topic}</span>
                      <span className="mt-1 block text-[1.05rem] font-medium group-hover:underline">{j.title}</span>
                    </span>
                    <span aria-hidden className="text-muted transition-transform group-hover:translate-x-1">↗</span>
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
