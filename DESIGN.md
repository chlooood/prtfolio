# Design

## Concept — *Downstream*

The whole site is one aerial map, painted in bands of gouache, with the
content laid on top as cut paper — and a lot of clean paper left bare.

Two streams rise at the top corners of the page and meet at a confluence at
the foot of the hero. From there one river runs the length of the page to the
sea at the bottom. Scrolling is travelling downstream. The picture is left to
speak for itself: nothing on the page labels or explains it.

Taste references, used for feeling and never for layout: a 1949 *New Yorker*
cover (a city seen from above in vermilion and green, birds crossing it),
cut-paper collage, tree-ring prints, banded gouache, an embroidered river.
What they share is what this site is built from: **the view from above, flat
saturated colour in bands, and things cut out and laid down by hand.**

### Loud at the ends, quiet in the middle

The map is painted edge to edge only twice: at the source (the hero, which
works as a poster) and at the sea (the footer). Through the middle of the
page the colour keeps to a ribbon a few bands wide along the river, plus
rings around the odd hill, and the rest of the sheet is bare paper. That is
where the content lives, so reading happens on a calm, clean ground with the
river always somewhere in view. The ribbon widens and narrows stripe by
stripe; nothing ever fades.

This is the cleanness of the earlier watercolour version, kept on purpose.

### What it replaced, and why

The previous direction was a typographic ledger (hairlines, mono labels, one
red) with a watercolour landscape added to it. It was tidy but generic: the
picture decorated the layout instead of being the layout, the palette was
timid, and nothing about it was recognisable at thumbnail size. That version
is kept on the `design/watercolour` branch.

## Layers

Back to front:

1. **The map** (`RiverMap`) — a fixed full-viewport fragment shader that
   scrolls with the page.
2. **The boats** (`Boats`) — four small watercolour sailboats, seen from above.
3. **The paper** — every piece of content: sheets, tags, spines, ring discs,
   cut-out type.
4. **The sun** (`Sun`) — pinned to the screen. It rises bottom-left as you
   leave the source, is overhead mid-page and sets bottom-right at the sea.
   Solid gouache against the map; a transparent wash where it crosses paper,
   so text reads through it.
5. **The nav** — a quiet translucent paper-colored text bar; no tag pile.

Boats sail between the map and the paper, so they never cross text.

## Colour — watercolor editorial experiment

This branch shifts the original saturated gouache into a softer family of
dusk-blue, lilac, dusty rose, apricot, sage and cream. The **map shader**
(`RiverMap.tsx`) contains three related eight-color palettes, and its
water/sky colors are independently tuned to match the CSS theme.

| Token | Value | Intended use |
| --- | --- | --- |
| `paper` | `#f6efe7` | Cream editorial ground |
| `paper-2` | `#ebddcb` | Subtle secondary ground |
| `ink` | `#2a1f27` | Reading text |
| `vermilion` | `#b36b7d` | Reserved accent (dusty rose) |
| `orange` | `#e39a68` | Apricot |
| `mustard` | `#d8af83` | Warm sand |
| `forest` | `#728e83` | Sage green |
| `teal` | `#628eac` | Lake blue |
| `sea` | `#456f9d` | Deeper blue |
| `maroon` | `#82678f` | Muted mauve |
| `pink` | `#d8a1aa` | Rose |

The highlands remain dark enough to hold cream cut-out typography. Through
the page, color gives way to generous unpainted reading space. Avoid
turning every interface element into a saturated ornament.

## Type

| Role | Face | Settings |
| --- | --- | --- |
| Display (`.display`) | **Bricolage Grotesque** 800 | `opsz 96`, `wdth 100`, −0.065em, leading 0.97 |
| Statement (`.statement`) | Fraunces 400 | `SOFT 15`, `opsz 72`, −0.015em |
| Text and annotations | Fraunces 400, roman and italic | Italic is the caption/aside voice |
| Labels and figures (`.label`, `.figure`) | **DM Mono** | 11px, uppercase, +0.13em; tabular numerals |

Display type appears three ways:

- **Cut out** (`.cutout`) — cream with a hard shadow, laid on fully painted
  map. The hero name and the links on the sea.
- **Sticker** (`.sticker`) — ink with a cream margin, like letters cut out
  with scissors. Section titles. On bare paper the margin disappears and the
  title reads as plain ink; where the river wanders underneath, the margin
  keeps it legible.
- **Plain ink** on a sheet.

The display headings use bold Bricolage Grotesque as a more graphic, contemporary contrast to the hand-painted map. Body copy and statements keep Fraunces to retain the editorial warmth. The hero name is fitted to the measure in JS. Section titles (`CutTitle`)
tumble into place letter by letter when they arrive.

## Paper, not clutter

`Paper` remains a tactile sheet component with torn edges and grain, used
deliberately around working figures, scrapbook content and footnotes.
The hero still has one personal-note sheet; supporting metadata is quiet
type directly on the map. The main navigation and project technology labels
are plain text, not a stack of little colored scraps.

The three featured projects are editorial case studies: their question,
approach, takeaway and evidence are modeled in `src/content/site.ts`.
Only **verified** screenshots and results belong in `evidenceImages`.
The original interactive figures stay; they explain a project's mechanism,
but they are not presented as authentic output from the associated apps.

The reading shelf and tree rounds retain their tactile character. The rounds
expand inline photograph scrapbooks rather than navigating to new pages.

## The map

Everything is computed per pixel in `RiverMap`; there is no image file.

- The river's course is a sum of sines in page space (`src/lib/river.ts`
  mirrors it for the boats). Above the confluence it splits into two
  tributaries; near the footer the channel opens until it is all sea.
- Land is banded by distance from the water and ringed around nine hills,
  blended so rings and strata flow into each other.
- Each band gets its own density, streaks along the stroke, dry-brush gaps
  where paper shows through, and paper tooth over everything.
- `data-confluence` (on the hero) and `data-sea` (on the footer) tell the map
  where those two events happen, so layout changes move the geography.

## Motion and interaction

1. **The paint arrives from the water.** On load, colour spreads outward from
   the river until the map is full; the name's letters tumble up into place.
2. **Scrolling is travel.** The map moves 1:1 with the page. Each boat keeps
   its place down the screen and steers by the channel beneath it: two come
   down each tributary, meet at the confluence, and follow every bend to the
   sea. The light goes from sunrise to sunset on the way.
3. **Everything can be explored.** The pointer dents the bands; boats rock and
   fan out into the sea. The interactive name responds to hover and tap.
   Loose hero and reading sheets can be moved on desktop; tree rounds open
   accessible inline photograph scrapbooks. Project demos are interactive.
4. **Paper is put down, not faded in.** Sheets slide up and settle from a
   slightly crooked angle with a little overshoot. Small pieces rise in
   sequence. Nothing loops except the boats' gentle rocking and the interests ribbon,
   which leans on scroll speed and settles.
5. **Interaction should explain something.** Every project gets a figure you
   can operate, built from that project's own rules on made-up numbers:
   Fig. 1 (`OddsSim`) turns latency and noise until arbitrage appears; Fig. 2
   (`NdtmFig`) changes the trip and watches the plan and packing list rewrite
   themselves; Fig. 3 (`RunwayFig`) bends a savings forecast with a city
   toggle and two dials. Footnotes open in place.

## Accessibility and performance

- `prefers-reduced-motion`: no paint-in, no entrances, no wing-flap or drift;
  the map renders still frames on scroll only; the sim starts paused; the
  ribbon becomes a scrollable row. Everything is visible without animation.
- Reading copy sits in calm paper zones or on sheets; only short high-contrast
  hero metadata sits on the painted map. Cut-out type is large display only.
- Semantic landmarks, skip link, real buttons and links, visible focus rings,
  footnotes that link both ways. The map and boats are `aria-hidden`.
- One WebGL context. Three.js loads after first paint; DPR is capped at 1.25
  on desktop and 1.5 on phones; rendering pauses when the tab is hidden.
  Intro timing is wall-clock, so a throttled tab still ends fully painted.

## Content

All copy lives in `src/content/site.ts`. Anything marked `placeholder: true`
(or a pursuit with no blurb) renders with a dashed vermilion **PLACEHOLDER**
tag so it can't be mistaken for real content.

## Exchange

The illustrated editorial cover opens place chapters without leaving the page.
Real photo essays can be added via `EXCHANGE_PLACES[].photos` and
`EXCHANGE_PLACES[].notes`; unpublished posts remain empty. Never invent
personal travel writing or substitute generated images for the user’s photos.

## Favicon

`src/app/icon.svg` is a small original watercolor-inspired **CD** monogram,
using rose, lilac, apricot and blue over cream paper.
