// Every brand, fact, link and route on the page lives here, so the facts can
// be checked against their sources without reading layout code.
// Sources: the assessment brief (primary) and studiocoka.com (read 2026-10-08).

export const SITE_URL = "https://crystal-kizor.smitho.workers.dev";

export const STUDIO_SOURCE = "https://studiocoka.com/studio";

export const contact = {
  email: "contact@studiocoka.com",
  studioSite: "https://studiocoka.com",
  studioHire: "https://studiocoka.com/hire",
  studioJournal: "https://studiocoka.com/journal",
  instagram: "https://www.instagram.com/crystalkizor/",
};

export function mailto(subject: string) {
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`;
}

export const subjects = {
  speaking: "Speaking enquiry for Crystal Kizor",
  ako: "Partnering with AKO Alliance",
  general: "Hello Crystal",
};

export const person = {
  name: "Crystal Kizor",
  role: "Architect and Design Director of Studio COKA",
  base: "Enugu, Nigeria",
  description:
    "Crystal Kizor is an architect, designer and Design Director of Studio COKA. She designs climate-responsive buildings and objects, teaches and speaks on the built environment, and invests in young people through AKO Alliance and Alive and Free.",
  // studiocoka.com/studio: "the designer behind Nigeria's first off-grid hospital, completed in 2019".
  headlineFact: "the designer behind Nigeria’s first fully off-grid hospital",
  credentials: [
    { label: "B.Sc. Architecture, University of Nigeria", school: "University of Nigeria" },
    { label: "M.A. Interior Architecture, Coventry University", school: "Coventry University" },
    { label: "Sustainable Real Estate, University of Cambridge", school: "University of Cambridge" },
  ],
  // Studio COKA's stated philosophy (studiocoka.com/studio).
  question: "How were humans originally meant to live?",
};

export const social = [
  { label: "Instagram", handle: "@crystalkizor", href: contact.instagram },
  { label: "Studio COKA on Instagram", handle: "@studio.coka", href: "https://www.instagram.com/studio.coka/" },
  { label: "LinkedIn", handle: "Studio COKA", href: "https://www.linkedin.com/company/studio-coka/" },
  { label: "YouTube", handle: "Studio COKA", href: "https://www.youtube.com/channel/UC21NBowgir5hC8ZStfBCXIg" },
  { label: "X", handle: "@studiocoka", href: "https://x.com/studiocoka" },
];

export type Pillar = "build" | "teach" | "give";

export const pillars: Record<Pillar, { index: string; title: string; verb: string }> = {
  build: { index: "01", title: "Build", verb: "She designs and builds" },
  teach: { index: "02", title: "Teach", verb: "She shares what she learns" },
  give: { index: "03", title: "Give", verb: "She invests in the next generation" },
};

export type Venture = {
  id: string;
  name: string;
  pillar: Pillar;
  // Index wording; the full line is used once, in the brand's own chapter.
  short: string;
  line: string;
  // Real destination, or null when the brand has no public page yet.
  href: string | null;
  // Where the brand is described on this page.
  anchor: string;
};

// Lines follow the brand context in the brief.
export const ventures: Venture[] = [
  {
    id: "studio-coka",
    name: "Studio COKA",
    pillar: "build",
    short: "Architecture, interiors and construction",
    line: "Architecture, interior design and construction studio focused on thoughtful, climate-responsive design.",
    href: contact.studioSite,
    anchor: "#build",
  },
  {
    id: "elevated",
    name: "ELEvated",
    pillar: "build",
    short: "Furniture and products",
    line: "Contemporary furniture and product design rooted in African context, materials and ideas.",
    href: null,
    anchor: "#elevated",
  },
  {
    id: "tea",
    name: "The Effective Architect",
    pillar: "teach",
    short: "Education and media for architects",
    line: "An education and media platform helping architects and built-environment professionals learn, grow and build better careers.",
    href: null,
    anchor: "#teach",
  },
  {
    id: "speaking",
    name: "Speaking",
    pillar: "teach",
    short: "Talks and conversations",
    line: "Talks and conversations on architecture, climate-responsive design, African cities, entrepreneurship and the built environment.",
    href: "#speaking",
    anchor: "#speaking",
  },
  {
    id: "writing",
    name: "Research & Writing",
    pillar: "teach",
    short: "Ideas under her own name",
    line: "Architecture, research, writing, media and ideas that sit directly under her own name.",
    href: "#writing",
    anchor: "#writing",
  },
  {
    id: "ako",
    name: "AKO Alliance",
    pillar: "give",
    short: "Education access for young people",
    line: "Expanding access to education and creating opportunities for children and young people.",
    href: null,
    anchor: "#give",
  },
  {
    id: "alive-and-free",
    name: "Alive and Free",
    pillar: "give",
    short: "A Christian youth movement",
    line: "A Christian youth movement helping young people walk in truth, healing, freedom, identity, purpose and life in Christ.",
    href: null,
    anchor: "#alive-and-free",
  },
];

export function venture(id: string): Venture {
  const v = ventures.find((x) => x.id === id);
  if (!v) throw new Error(`Unknown venture "${id}"`);
  return v;
}

// Published on studiocoka.com (home and studio pages).
export const studioFacts = [
  { prefix: "Up to", value: "70%", label: "less energy demand in the studio's climate-responsive designs" },
  { prefix: "Up to", value: "90%", label: "less cooling required" },
  { prefix: "", value: "95%", label: "less diesel at Nigeria's first fully off-grid hospital, designed by Crystal" },
];

export type Frame = {
  image: string;
  title: string;
  note: string;
  status: "Completed" | "Visualisation" | "Concept";
};

// Nature Home is photographed on site; the other two are design images and are
// labelled as such everywhere they appear.
export const studioFrames: Frame[] = [
  { image: "nature-home-front", title: "Nature Home", note: "Arrival beneath a mature shade tree", status: "Completed" },
  { image: "nature-home-cantilever", title: "Nature Home", note: "Deep cantilevers shade the terrace and the glazing", status: "Completed" },
  { image: "nature-home-garden", title: "Nature Home", note: "Grass-jointed paving and a young tree in the back garden", status: "Completed" },
  { image: "nature-home-living", title: "Nature Home", note: "Tall windows, light curtains, a calm family room", status: "Completed" },
  { image: "nature-home-study", title: "Nature Home", note: "A study wrapped in warm timber", status: "Completed" },
  { image: "earth-house-garden", title: "Nature Home 2, Enugu", note: "Earth walls, deep eaves and a garden threshold", status: "Visualisation" },
  { image: "community-centre-courtyard", title: "Community Centre", note: "A courtyard roof opened around a single great tree", status: "Concept" },
];

// From the brief's description of Speaking Engagements.
export const speakingTopics = [
  "Architecture and design",
  "Climate-responsive design",
  "African cities",
  "Entrepreneurship",
  "The built environment",
];

// Titles and tags as listed on studiocoka.com/journal.
export const journal = [
  { title: "Rethinking the Tropical Home: Beyond Walls and Air Conditioning", topic: "Architecture" },
  { title: "A new normal for Nigerian Architecture: Laterite bricks", topic: "Site research" },
  { title: "7 Ceiling Materials We Use for Homes in Hot Climates", topic: "Tropical design" },
];

export type Door = {
  id: string;
  // Hero shows the four intent routes; the closing section shows every door.
  inHero: boolean;
  who: string;
  want: string;
  go: string;
  action: string;
  href: string;
  event: "generate_lead" | "route_select" | "outbound_click";
  lead?: string;
};

// "Where should I go next?" answered once per kind of visitor.
export const doors: Door[] = [
  {
    id: "studio_project",
    inHero: true,
    who: "You want a home, workplace or public building designed or built",
    want: "Design or build a space",
    go: "Studio COKA",
    action: "Start a project with Studio COKA",
    href: contact.studioHire,
    event: "generate_lead",
    lead: "studio_project",
  },
  {
    id: "tea",
    inHero: true,
    who: "You are an architect or student who wants to grow",
    want: "Grow as an architect",
    go: "The Effective Architect",
    action: "Explore The Effective Architect",
    href: "#teach",
    event: "route_select",
  },
  {
    id: "speaking",
    inHero: true,
    who: "You are planning an event, panel or interview",
    want: "Invite Crystal to speak",
    go: "Speaking",
    action: "Send a speaking enquiry",
    href: mailto(subjects.speaking),
    event: "generate_lead",
    lead: "speaking",
  },
  {
    id: "ako",
    inHero: true,
    who: "You want to back education for young people",
    want: "Support young people",
    go: "AKO Alliance",
    action: "Partner with AKO Alliance",
    href: mailto(subjects.ako),
    event: "generate_lead",
    lead: "ako_partner",
  },
  {
    id: "elevated",
    inHero: false,
    who: "You are looking for furniture and objects",
    want: "Find furniture and objects",
    go: "ELEvated",
    action: "See the direction",
    href: "#elevated",
    event: "route_select",
  },
  {
    id: "journal",
    inHero: false,
    who: "You want to read about climate-responsive design",
    want: "Read the thinking",
    go: "Journal",
    action: "Read the journal",
    href: contact.studioJournal,
    event: "outbound_click",
  },
];
