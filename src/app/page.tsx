import { About } from "@/components/about";
import { BackToTop } from "@/components/back-to-top";
import { Build } from "@/components/build";
import { Give } from "@/components/give";
import { Hero } from "@/components/hero";
import { NextSteps } from "@/components/next-steps";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Teach } from "@/components/teach";

// The order answers the brief's four questions in sequence: who she is
// (Hero, About), what she does and is building (Build, Teach, Give), and
// where to go next (NextSteps, which the hero routes also jump to).
export default function Home() {
  return (
    <>
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-cream">
        Skip to content
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Build />
        <Teach />
        <Give />
        <NextSteps />
      </main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}
