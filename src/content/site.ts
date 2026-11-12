/* ═══════════════════════════════════════════════════════════════════════════
 *  SITE.TS — every word the site displays lives in this file.
 *
 *  Nothing here is design and nothing in the components is content.
 *  Change a value, save, and the page updates.
 *
 *  PLACEHOLDERS
 *  Anything with `placeholder: true` renders on the page with a visible red
 *  "PLACEHOLDER" tag so it can't be mistaken for real content. Replace the
 *  text, delete the `placeholder` line, and the tag disappears. Search this
 *  file for "TODO" to find everything still waiting on you.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const PROFILE = {
  firstName: "Chloe",
  lastName: "Dacey",
  signature: "citations available on request",
  role: "Business & Computer Science",
  school: "UBC Sauder School of Business",
  gradYear: 2029,
  headline: "Business and Computer Science at UBC.",
  intro:
    "I like problems that don’t sit still long enough to be filed under one department. Business tells you what matters; code tells you if you’re actually right. I keep score here — what I built, what I read, what I got wrong.",
};

export const NOW = {
  basedIn: "Vancouver, BC",
  /* IANA zone for the live clock in the nav. */
  timeZone: "America/Vancouver",
  /* No unverified live-location claim; set to a city when you want it shown. */
  currentlyIn: null as string | null,
};

export const CONTACT = {
  /* Email stays off the page on purpose (plain-text addresses get scraped).
     Set a string here and an email row appears in the contact section. */
  email: null as string | null,
  linkedin: "https://linkedin.com/in/chloe-dacey",
  github: "https://github.com/chlooood",
};

/* ───────────────────────────────────────────────────────────────────────────
 *  BUILT — projects, in the order they appear. Each one with a `figure` gets
 *  a write-up and a working demo side by side.
 * ─────────────────────────────────────────────────────────────────────────── */
export type Project = {
  name: string;
  year: string;
  blurb: string;
  stack: string[];
  repo: string | null;
  live: string | null;
  /* Path under /public for the hover plate, e.g. "/work/02.jpg". */
  image: string | null;
  /* Which interactive figure sits beside the write-up (see components/*Fig
     and OddsSim). Projects without one go in the plain index underneath. */
  figure?: "odds" | "ndtm" | "runway";
  /* The italic caption under the figure. */
  caption?: string;
  placeholder?: boolean;
};

export const PROJECTS: Project[] = [
  {
    name: "Low-Latency Odds Arbitrage Engine",
    year: "In progress",
    blurb:
      "A deterministic C++ market simulator that generates synthetic multi-book betting odds, modelling latency and pricing noise until it reproduces the kind of structural mispricing that actually shows up in the wild. The hard part wasn’t finding the arbitrage — it was making the noise realistic enough that finding it meant something. CI enforces reproducibility across 90k+ records per run.",
    stack: ["C++", "CMake", "Catch2", "GitHub Actions", "Linux"],
    repo: "https://github.com/chlooood/odds-engine",
    live: null,
    image: null,
    figure: "odds",
    caption:
      "The premise, small enough to play with. Turn up the latency and watch the market start contradicting itself.",
  },
  {
    name: "ndtm — Not Doing Too Much",
    year: "2026",
    blurb:
      "A scrapbook-style trip planner for exchange students. Screenshot a Reel, a TikTok or a trail page and get a destination with trains or driving already worked out, then share the itinerary with friends. The vision model is only trusted for what it can see — which place, city or alpine. Routes, booking links and packing lists come from plain rules on the device, shaped by your profile, so it can’t invent a hostel, a fare or a gear item.",
    stack: ["Expo", "React Native", "TypeScript", "Supabase", "Claude API", "NativeWind"],
    repo: "https://github.com/chlooood/ndtm-app",
    live: "https://chlooood.github.io/ndtm-app/",
    image: null,
    figure: "ndtm",
    caption:
      "The tailoring rules on their own. Change the trip and the plan rewrites itself; tick what you own and it comes off the list.",
  },
  {
    name: "Runway",
    year: "2026",
    blurb:
      "A friendly little forecaster for a question I kept asking myself: will I have saved enough for my exchange, and will it last? No machine learning, just rules you can follow. When you can flip between cities and watch your balance line bend, you end up exploring your money instead of avoiding it.",
    stack: ["FastAPI", "SQLAlchemy", "PostgreSQL", "React", "TypeScript", "Recharts", "pytest"],
    repo: "https://github.com/chlooood/runway-app",
    live: null,
    image: null,
    figure: "runway",
    caption:
      "The forecast rule on made-up numbers. Push the budget away up until the line goes red, then trim until it doesn’t.",
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 *  READ — what's open now, and what's finished (newest first).
 * ─────────────────────────────────────────────────────────────────────────── */
export type Book = { title: string; author: string };

export const READING: Book[] = [
  { title: "The Bee Sting", author: "Paul Murray" },
  { title: "Algorithms to Live By", author: "Brian Christian and Tom Griffiths" },
];

export const FINISHED_YEAR = "2026";
export const FINISHED: Book[] = [
  { title: "Funny Story", author: "Emily Henry" },
  { title: "Careless People", author: "Sarah Wynn-Williams" },
  { title: "Kitchen Confidential", author: "Anthony Bourdain" },
  { title: "Sunrise on the Reaping", author: "Suzanne Collins" },
  { title: "Bright Young Women", author: "Jessica Knoll" },
  { title: "Berlin", author: "Bea Setton" },
  { title: "Play It As It Lays", author: "Joan Didion" },
  { title: "Dirt", author: "Bill Buford" },
  { title: "The End of Poverty", author: "Jeffrey Sachs" },
];

/* ───────────────────────────────────────────────────────────────────────────
 *  EXCHANGE — place labels on the illustrated editorial cover.
 *  Add real posts as { title, href } when they exist. The place labels below
 *  are editable staging entries, not claims of published travel stories.
 * ─────────────────────────────────────────────────────────────────────────── */
export type ExchangePlace = {
  id: string;
  name: string;
  x: string;
  y: string;
  description: string;
  accent: string;
  motif: string;
  posts: { title: string; href: string }[];
};

export const EXCHANGE_PLACES: ExchangePlace[] = [
  {
    id: "vancouver",
    name: "Vancouver",
    x: "24%",
    y: "52%",
    description: "The starting point. A shelf for dispatches from home, before the next departure.",
    accent: "#1c4e8a",
    motif: "01 / Coastlines",
    posts: [],
  },
  {
    id: "toronto",
    name: "Toronto",
    x: "73%",
    y: "40%",
    description: "A place-marker ready for stories, photographs, and the little details that make a city memorable.",
    accent: "#c7401f",
    motif: "02 / City notes",
    posts: [],
  },
  {
    id: "elsewhere",
    name: "Next stop",
    x: "65%",
    y: "78%",
    description: "An empty page for wherever the road leads next. Update the place name when the journey begins.",
    accent: "#2f6b4f",
    motif: "03 / To be continued",
    posts: [],
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 *  OFF THE CLOCK
 *  Each pursuit is a title on a tree-ring disc. Two optional extras, both
 *  hidden until you fill them in:
 *    photos — objects: { src: "/hiking/01.jpg", alt: "Alpine trail", caption: "..." }.
 *             Add as many as you like; each item becomes one carousel slide.
 *    strava — the `src` URL from a Strava embed (Profile → Share → Embed),
 *             e.g. "https://www.strava.com/athletes/<id>/latest-rides/<hash>".
 * ─────────────────────────────────────────────────────────────────────────── */
export type PursuitPhoto = { src: string; alt: string; caption?: string };
export type Pursuit = { title: string; photos?: PursuitPhoto[]; strava?: string | null };

export const PURSUITS: Pursuit[] = [
  { title: "Soccer", photos: [] }, // TODO: soccer photos → /public/soccer/
  { title: "Running", strava: null }, // TODO: Strava embed URL
  { title: "Travel", photos: [] }, // TODO: travel photos → /public/travel/
  { title: "Hiking", photos: [] }, // TODO: hiking photos → /public/hiking/
];

export const INTERESTS = [
  "geopolitics",
  "podcasts",
  "clean energy",
  "sustainable agriculture",
  "global aid & AI",
  "prestige TV",
  "cats",
  "shopping",
];

/* ───────────────────────────────────────────────────────────────────────────
 *  CITATIONS — the footnotes. Referenced by number via <Cite n={1} />.
 *  Order matters: the index in this array + 1 is the footnote number.
 * ─────────────────────────────────────────────────────────────────────────── */
export const CITATIONS = [
  "Citations available on request.",
  "The combined major in Business and Computer Science at UBC — BUCS, to the people in it. Class of 2029.",
  "Illustrative only. The figures are small models written for this page, running in your browser on made-up numbers. They follow each project’s rules but are not output from the projects themselves.",
];
