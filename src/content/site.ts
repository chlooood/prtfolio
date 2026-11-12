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
  headline: "Business and Computer Science at UBC — and no, that wasn’t an accident.",
  intro:
    "I like problems that don’t sit still long enough to be filed under one department. Business tells you what matters; code tells you if you’re actually right. I keep score here — what I built, what I read, what I got wrong.",
};

export const NOW = {
  basedIn: "Vancouver, BC",
  /* IANA zone for the live clock in the nav. */
  timeZone: "America/Vancouver",
  /* TODO: carried over from the summer. Set to null when you're home and the
     line disappears. */
  currentlyIn: "Toronto, ON" as string | null,
};

export const CONTACT = {
  /* Email stays off the page on purpose (plain-text addresses get scraped).
     Set a string here and an email row appears in the contact section. */
  email: null as string | null,
  linkedin: "https://linkedin.com/in/chloe-dacey",
  github: "https://github.com/chlooood",
};

/* ───────────────────────────────────────────────────────────────────────────
 *  BUILT — projects. The first entry is the feature (it gets the live figure).
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
  },
  /* TODO: replace these two with real projects, or delete them. */
  {
    name: "Project title goes here",
    year: "Year",
    blurb: "One or two sentences: what it does, and what was hard about it.",
    stack: ["Stack", "Stack", "Stack"],
    repo: null,
    live: null,
    image: null,
    placeholder: true,
  },
  {
    name: "Project title goes here",
    year: "Year",
    blurb: "One or two sentences: what it does, and what was hard about it.",
    stack: ["Stack", "Stack", "Stack"],
    repo: null,
    live: null,
    image: null,
    placeholder: true,
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 *  READ — what's open now, and what's finished (newest first).
 * ─────────────────────────────────────────────────────────────────────────── */
export type Book = { title: string; author: string };

export const READING: Book[] = [
  { title: "Kitchen Confidential", author: "Anthony Bourdain" },
  { title: "Careless People", author: "Sarah Wynn-Williams" },
];

export const FINISHED_YEAR = "2026";
export const FINISHED: Book[] = [
  { title: "Sunrise on the Reaping", author: "Suzanne Collins" },
  { title: "Bright Young Women", author: "Jessica Knoll" },
  { title: "Berlin", author: "Bea Setton" },
  { title: "Play It As It Lays", author: "Joan Didion" },
  { title: "Dirt", author: "Bill Buford" },
  { title: "The End of Poverty", author: "Jeffrey Sachs" },
];

/* ───────────────────────────────────────────────────────────────────────────
 *  OFF THE CLOCK
 *  An entry with an empty blurb renders as a placeholder. `photos` is a list
 *  of paths under /public; null slots render as labelled empty frames.
 * ─────────────────────────────────────────────────────────────────────────── */
export type Pursuit = { title: string; blurb: string; photos?: (string | null)[] };

export const PURSUITS: Pursuit[] = [
  { title: "Soccer", blurb: "Winger, attacking side. Still play." },
  { title: "Running", blurb: "Training for a faster 10k." },
  { title: "Travel", blurb: "Lyon this summer." }, // TODO: "this summer" was 2026 — update when it dates
  /* TODO: write the hiking line and drop photos into /public/hiking/. */
  { title: "Hiking", blurb: "", photos: [null, null, null] },
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
  "Illustrative only. The figure is a small seeded simulation running in your browser, written for this page; it is not output from the engine.",
];
