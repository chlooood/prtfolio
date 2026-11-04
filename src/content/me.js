/* ═══════════════════════════════════════════════════════════════════════════
 *  ME.JS - everything about you that the site displays.
 *
 *  This is the only file you need to edit to fill in the portfolio. Nothing
 *  here is design; nothing in the design files is content. Change a value,
 *  save, and the page updates.
 *
 *  Conventions used throughout:
 *    · Anything marked  TODO  is waiting on you.
 *    · Any section you leave empty ( [] or null ) simply doesn't render -
 *      the page never shows an empty box or a "coming soon".
 *    · Dates are plain strings, written however you want them displayed.
 *    · Every `url` may be null; links only appear when there's a URL.
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────────────────────
 *  1 · WHO YOU ARE
 *  Drives the wordmark, the page title, and the opening of the home page.
 * ─────────────────────────────────────────────────────────────────────────── */
export const PROFILE = {
  name: 'Chloe Dacey',

  /* The small line under the wordmark. Keep it short - it sits at ~12px. */
  signature: 'citations available on request',

  role: 'Business & Computer Science',
  school: 'UBC Sauder School of Business',
  gradYear: 2029,

  /* The big opening statement. One sentence, ideally under ~90 characters -
     it's set in the display face at a large size, so length shows. */
  headline: 'Business and Computer Science at UBC - and no, that wasn’t an accident.',

  /* The paragraph directly under it. This is the single most-read thing on
     the site. Two or three sentences, in your voice, about what you actually
     care about - not a summary of your résumé. */
  intro:
    'I like problems that don’t sit still long enough to be filed under one department. Business tells you what matters; code tells you if you’re actually right. I keep score here - what I built, what I read, what I got wrong.',
};

/* ───────────────────────────────────────────────────────────────────────────
 *  2 · CONTACT
 *  Deliberately no phone number: a résumé PDF you hand to a person is one
 *  thing, a public page that gets scraped is another. Add one only if you
 *  genuinely want it public.
 * ─────────────────────────────────────────────────────────────────────────── */
export const CONTACT = {
  /* All personal contact details removed at your request - the site publishes
     none of them. Every field below is optional: set one and its link appears
     in the footer; leave them null and the footer shows no contact block.

     Worth knowing before you add any back: an address published in plain text
     gets harvested by scrapers within days. If you do want to be reachable,
     the safer options are a form service (Formspree, Tally) or a forwarding
     alias you can burn, rather than your real inbox. */
  email: null, // Kept off deliberately - a plain-text address gets harvested.
  linkedin: 'https://linkedin.com/in/chloe-dacey',
  github: 'https://github.com/chlooood', // TODO: confirm this is actually your profile, not just where the repo lives
  resume: null, // staying off, per you
};

/* ───────────────────────────────────────────────────────────────────────────
 *  3 · NOW - the standing status strip near the top of the page.
 *  This is the part that dates fastest, and that's the point. Update it
 *  whenever it changes; it's three fields and a number.
 * ─────────────────────────────────────────────────────────────────────────── */
export const NOW = {
  /* Set `currentlyIn` to null when you're home and the line collapses to
     just "Based in ___". */
  basedIn: 'Vancouver, BC',
  currentlyIn: 'Toronto, ON',

  /* What you're reading. A list, because two at once is normal - the strip
     shows up to two, stacked. A single object still works if you drop back to
     one book; the component accepts either shape.
     `pages` and `of` drive each progress bar; leave `of` at 0 and that book's
     bar stays hidden while its title still shows. */
  reading: [
    {
      title: 'Kitchen Confidential',
      author: 'Anthony Bourdain',
      pages: 0, // TODO: page you're on, and the total below - the bar needs both
      of: 0,
      url: null,
    },
    {
      title: 'Careless People',
      author: 'Sarah Wynn-Williams',
      pages: 0,
      of: 0,
      url: null,
    },
  ],

  /* What you're building right now. Shown in the status strip, so keep the
     blurb to one line - the full write-up belongs in PROJECTS below. */
  building: {
    title: 'Low-Latency Odds Arbitrage Engine',
    blurb: 'Faking a market to find where it lies to itself - a C++ sim that generates synthetic betting odds across books and hunts the gaps between them.',
    stack: ['C++', 'CMake', 'Catch2', 'Linux'],
    url: 'https://github.com/chlooood/odds-engine',
  },
};

/* ───────────────────────────────────────────────────────────────────────────
 *  4 · PROJECTS  →  rail 01, "Selected work"
 *  Three to five is the right number. More than five and none of them land.
 *
 *  Shape:
 *    name    - what it's called
 *    year    - displayed as-is ('2026', 'In progress', '2025 - present')
 *    blurb   - 1–2 sentences: what it does and what was hard about it
 *    stack   - array of short strings, shown as chips
 *    links   - { repo, live } - either may be null
 * ─────────────────────────────────────────────────────────────────────────── */
export const PROJECTS = [
  {
    name: 'Low-Latency Odds Arbitrage Engine',
    year: 'In progress',
    blurb:
      'A deterministic C++ market simulator that generates synthetic multi-book betting odds, modelling latency and pricing noise until it reproduces the kind of structural mispricing that actually shows up in the wild. The hard part wasn’t finding the arbitrage - it was making the noise realistic enough that finding it meant something. CI enforces reproducibility across 90k+ records per run.',
    stack: ['C++', 'CMake', 'Catch2', 'GitHub Actions', 'Linux'],
    links: { repo: 'https://github.com/chlooood/odds-engine', live: null },
  },

  /* TODO: add the rest when they're ready. Template:
  {
    name: '',
    year: '',
    blurb: '',
    stack: [],
    links: { repo: null, live: null },
  },
  */
];

/* ───────────────────────────────────────────────────────────────────────────
 *  5 · EXPERIENCE  →  rail 03
 *  Transcribed from your résumé. Trim ruthlessly - a personal site is not a
 *  résumé, and two sharp lines beat four thorough ones.
 *
 *  Shape:
 *    org, role, location, period - all displayed as written
 *    notes - array of short lines; keep to 1–2 each
 * ─────────────────────────────────────────────────────────────────────────── */
export const EXPERIENCE = [
  {
    org: 'Nestlé Canada',
    role: 'Bilingual Operations & Process Intern',
    location: 'Brampton, ON',
    period: 'May 2026 - present',
    notes: [
      'Bilingual (EN/FR) B2B order entry and service in SAP for a team doing $6M in seasonal sales, across 100+ retail accounts.',
      'Built the Power BI analysis behind moving low-touch accounts to self-serve; adopted into the team’s account strategy.',
      'Designed agent-performance and order-processing dashboards now used in weekly team evaluations.',
    ],
  },
  {
    org: 'UBC Product Management Club',
    role: 'VP Executive Development',
    location: 'Vancouver, BC',
    period: 'Sept 2025 - present',
    notes: [
      'Co-founded an internal fellowship simulating end-to-end product development; designed the curriculum, grew it to 20+ fellows at 100% completion.',
      'Run résumé and interview workshops with industry recruiters; lead corporate outreach for the club’s case competition.',
    ],
  },
  {
    org: '180 Degrees Consulting UBC',
    role: 'Analyst',
    location: 'Vancouver, BC',
    period: 'Sept 2025 - May 2026',
    notes: [
      'Built the financial model behind a business plan that won Mount Adaklu, Ghana bank financing for a sustainable tourism development.',
      'Structured 10+ cost drivers across pricing sensitivity and breakeven scenarios, from an ambiguous brief with no template.',
    ],
  },
  {
    org: 'Oakville Soccer Club',
    role: 'Summer Camp Counselor / Youth Soccer Coach',
    location: 'Oakville, ON',
    period: 'June 2021 - Aug 2025',
    notes: [
      'Designed and delivered programming for 100+ campers across concurrent sessions.',
      'Onboarded and coordinated 40+ volunteers over four summers.',
    ],
  },
];

/* ───────────────────────────────────────────────────────────────────────────
 *  6 · OFF THE CLOCK  →  rail 04
 *  Hobbies. The section I refused to invent for you.
 *
 *  Shape: { title, blurb } - blurb is one or two sentences. Specific beats
 *  broad: 'goalkeeper, still' says more than 'sports'.
 * ─────────────────────────────────────────────────────────────────────────── */
export const HOBBIES = [
  { title: 'Soccer', blurb: 'Winger, attacking side. Still play.' },
  { title: 'Running', blurb: 'Training for a faster 10k.' },
  { title: 'Travel', blurb: 'Lyon this summer.' },
  // TODO - hiking: you want a whole new section with photos for this, which
  // is a bigger change than this file. HOBBIES only takes title + blurb text,
  // no images, and it's a fixed rail on the page - a photo section means new
  // fields here AND new layout code in whatever renders rail 04. I don't have
  // those page/component files, only me.js and site.js. If you want this
  // built, upload the page component (or point me to the repo) and I'll wire
  // it up properly instead of guessing at a schema that might not match.
  { title: 'Hiking', blurb: '' },
];

/* ───────────────────────────────────────────────────────────────────────────
 *  7 · INTERESTS
 *  Shorter than hobbies - a list of things you're into, rendered as a run of
 *  small chips. Six to twelve works well. Plain strings.
 *  e.g. ['market microstructure', 'typography', 'French', 'trail running']
 * ─────────────────────────────────────────────────────────────────────────── */
export const INTERESTS = [
  // Draft from your list - cut what's wrong, this is easy to edit later.
  'geopolitics',
  'podcasts',
  'clean energy',
  'sustainable agriculture',
  'global aid & AI',
  'prestige TV',
  'cats',
  'shopping',
];

/* ───────────────────────────────────────────────────────────────────────────
 *  8 · BOOKSHELF  →  rail "Recently read"
 *  Books you've finished, newest first. Separate from NOW.reading, which is
 *  what you're in the middle of.
 *
 *  The rail draws an actual shelf. Only the first four appear as titled,
 *  coloured spines - the pale unlabelled spines around them are texture, so
 *  the shelf looks full without claiming you've read things you haven't.
 *  Keep as many books here as you like; reordering this list is how you choose
 *  which four show. Empty array hides the section entirely.
 *
 *  Shape: { title, author, finished, note, review } - all but `title` optional.
 *    note   - what you made of it, not what it's about.
 *    review - links the spine to a write-up: either a post slug from
 *             src/content/posts/ (e.g. 'on-didion') or a full external URL.
 *             Reviewed books get a small gold mark at the foot of the spine
 *             and lift on hover; the rest just sit there.
 * ─────────────────────────────────────────────────────────────────────────── */
export const BOOKSHELF = [
  // TODO: all confirmed 2026. Order below is still my guess, not yours -
  // rearrange to the actual order you finished them if it matters to you.
  { title: 'Sunrise on the Reaping', author: 'Suzanne Collins', finished: '2026', note: '' },
  { title: 'Bright Young Women', author: 'Jessica Knoll', finished: '2026', note: '' },
  { title: 'Berlin', author: 'Bea Setton', finished: '2026', note: '' },
  { title: 'Play It As It Lays', author: 'Joan Didion', finished: '2026', note: '' },
  { title: 'Dirt', author: 'Bill Buford', finished: '2026', note: '' },
  { title: 'The End of Poverty', author: 'Jeffrey Sachs', finished: '2026', note: '' },
];