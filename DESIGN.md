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
5. **The nav** — a handful of paper tags pinned along the top.

Boats sail between the map and the paper, so they never cross text.

## Colour

Paper and ink:

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#f4ecdb` | Sheets |
| `paper-2` | `#e9ddc3` | Small tags |
| `cream` | `#f7eed8` | Cut-out type on the map, birds |
| `ink` | `#221a17` | Text |
| `ink-2` / `muted` | `#4d4038` / `#6b5d50` | Secondary text, labels (AA on paper) |

Gouache — the same pigments in the UI and in the map:

`vermilion #c7401f` · `orange #e57f32` · `mustard #e2b043` · `forest #2f6b4f` ·
`teal #1f6b73` · `sea #1c4e8a` · `maroon #7a2230` · `pink #e9a593`

The map uses three eight-colour sets that hand over as you travel: dark
highland greens, maroon and ochre at the source (so the cream name reads);
hot vermilion, orange, mustard and pink mid-course; teal, sky, mint and sand
at the coast. Bands switch set one at a time along a wandering edge, so every
stripe stays a pure pigment.

The bare paper is the one place colour is allowed to drift. It is washed with
a day that passes as you travel: peach at sunrise just below the source, clear
paper through the middle, gold and then rose toward the coast. The wash is
laid on unevenly, like watercolour, and the sheets on top of it stay cream.

Vermilion is the only accent in text: footnote markers, live states,
placeholders.

## Type

| Role | Face | Settings |
| --- | --- | --- |
| Display (`.display`) | **Fraunces** 900 | `SOFT 100`, `WONK 1`, `opsz 144`, −0.035em, leading 0.88 |
| Statement (`.statement`) | Fraunces 400 | `SOFT 100`, `opsz 96`, −0.022em |
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

The hero name is fitted to the measure in JS. Section titles (`CutTitle`)
tumble into place letter by letter when they arrive.

## Cut paper

`Paper` is the one container. It draws its sheet on a pseudo-element so the
torn-edge filter (`#torn`, defined once in the layout) never touches the text,
adds paper grain and a soft shadow, and takes a `tilt` in degrees — nothing in
a collage sits square. Variants are only colour (`sheet`) and height off the
table (`flat`).

- **Sheets** carry reading matter. Sections are several overlapping scraps
  rather than one page: each project in Built is a coloured write-up note
  overlapping its working figure, alternating sides down the river;
  Read is a note of what's open beside a shelf standing on the page.
- **Tags** carry nav, stack items, links. They lift and twist on hover.
- **Spines** are the reading list: bands of colour, like the land outside.
- **Ring discs** are the pursuits: tree rounds cut from paper, one irregular
  ring after another, laid directly on the map with a caption scrap tucked
  under each.
- No cards, no rounded rectangles, no glass.

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
3. **Everything can be touched.** The pointer presses a soft dent into the
   bands. Boats rock harder when it comes near. Loose scraps — the hero
   notes, the open-books note, the ring discs — can be picked up with a mouse
   and left wherever you drop them. Tags lift, spines rise and
   their neighbours step back, ring discs turn, a paper plate trails the
   cursor over the project index and swings with its direction.
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
- Body text always sits on paper, never on the map. Cut-out type is large
  display only and carries a hard shadow for separation.
- Semantic landmarks, skip link, real buttons and links, visible focus rings,
  footnotes that link both ways. The map and boats are `aria-hidden`.
- One WebGL context. Three.js loads after first paint; DPR is capped at 1.25
  on desktop and 1.5 on phones; rendering pauses when the tab is hidden.
  Intro timing is wall-clock, so a throttled tab still ends fully painted.

## Content

All copy lives in `src/content/site.ts`. Anything marked `placeholder: true`
(or a pursuit with no blurb) renders with a dashed vermilion **PLACEHOLDER**
tag so it can't be mistaken for real content.
