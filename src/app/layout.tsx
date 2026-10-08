import type { Metadata, Viewport } from "next";
import { Cormorant, Hanken_Grotesk } from "next/font/google";
import Script from "next/script";
import { SmoothScroll } from "@/components/smooth-scroll";
import { contact, person, SITE_URL, social } from "@/lib/content";
import "./globals.css";

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const title = "Crystal Kizor | Architect, Designer, Builder";
const description = person.description;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: "Crystal Kizor",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ed",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  url: SITE_URL,
  jobTitle: person.role,
  worksFor: { "@type": "Organization", name: "Studio COKA", url: contact.studioSite },
  alumniOf: person.credentials.map((c) => ({ "@type": "CollegeOrUniversity", name: c.school })),
  knowsAbout: ["Climate-responsive architecture", "Interior design", "Furniture design", "Architecture education"],
  sameAs: social.map((s) => s.href),
};

// Escaped so the JSON can never close the script tag it sits in.
const personJsonLd = JSON.stringify(personSchema).replace(/</g, "\\u003c");

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" className={`${cormorant.variable} ${hanken.variable} antialiased`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <SmoothScroll>{children}</SmoothScroll>
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
