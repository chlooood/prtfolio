# Design

## Concept — *Keeping score*

The site is a ledger kept in a sketchbook. The ledger comes from the copy
("I keep score here — what I built, what I read, what I got wrong") and gives
the page its structure: numbered sections, ruled lines, tallies, footnotes, an
errata column. The sketchbook gives it its pictures: one watercolour view,
painted in code, that opens the page by day and closes it by night.

Two registers, deliberately: **rigorous type on rules** and **loose paint on
paper**. Neither decorates the other.

References studied for taste, not layout: dwell.au (paper, serif numerals, a
drawing that washes into colour), meesverberne.com (one enormous wordmark, one
illustration with presence), maximilianberndt.com/archive (strict small Swiss
type, numbered index).

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#f2eee3` | Ground |
| `paper-2` | `#e8e2d2` | Plates, tints |
| `ink` | `#191c12` | Text, rules, the closing section's ground |
| `ink-2` | `#45483a` | Secondary text |
| `muted` | `#5f6150` | Labels (AA on paper) |
| `pen` | `#c4320f` | The red pen: footnote markers, margin rule, live states, placeholders, the sun |
| `pen-soft` | `#e9a48f` | Pen on ink |

Paint lives only in the painting and the swatches: cerulean and blue-grey
ridges, sap green treeline, burnt sienna, ochre. UI never borrows those
colours; paint never uses `pen` except for the sun.

## Type

| Role | Face | Notes |
| --- | --- | --- |
| Display | **Archivo** (variable, width 62–125, weight 800) | Uppercase, −0.02em, leading 0.86. Class `.display`. |
| Text & statements | **Newsreader** (optical size, roman + italic) | Italic is the "annotation" voice: captions, roles, notes. |
| Labels & figures | **DM Mono** | 11px, uppercase, +0.14em (`.label`); tabular numerals (`.figure`). |

Sizes are fluid `clamp()` values; the hero name is fitted to the measure in JS.

## Layout

- 12 columns on desktop, 4 on mobile; one page gutter, `--pad`.
- Every section opens the same way (`SectionHead`): a rule, `§ 0N` and a tally
  in mono, then a one-word title in display.
- Hairlines, not boxes. No cards, no shadows, no rounded corners. The one
  exception is the plate that trails the cursor, which is a physical object.
- A red margin rule runs the full height of the page, like ruled paper.

## Imagery

- **`Landscape`** — a fragment shader, not an image file. Four ridges, a sky
  wash, a sun, dry-brushed water, with pigment pooling at wet edges,
  granulation and paper grain. It paints itself in (pencil underdrawing first,
  then the washes bloom), the sun sets as the hero scrolls away, and it returns
  above the footer as the same view by moonlight.
- **`Swatch`** — a single brushstroke built from SVG filters; one pigment per
  pursuit.
- **Fig. 1 (`OddsSim`)** — the feature project explained as something you can
  operate: four simulated books, two dials, arbitrage windows in red.
- Project plates are labelled empty frames until real images exist.

## Motion principles

1. **Scroll plays the width axis.** Archivo's `wdth` is the site's one signature
   move: the hero name condenses and its letters drift apart as you leave;
   section titles open from condensed to expanded as they arrive; rows stretch
   on hover. Nothing else about type animates.
2. **The picture has a clock.** Paint-in on arrival, sunset on scroll, night at
   the end. Pointer movement only nudges parallax.
3. **Reveal once, quietly.** Content rises 28px and fades in a single time,
   `expo.out`, staggered by siblings. Rules draw left to right. No bounces, no
   loops except the interests ticker, which leans on scroll velocity and
   settles.
4. **Interaction should explain something.** The sim's dials, the footnote
   tooltips, the accordion — each shows more of the content, not more effect.

## Accessibility & performance

- `prefers-reduced-motion`: no loader, no scroll-driven type, no reveals; the
  painting renders one finished frame; the sim starts paused; the ticker
  becomes a scrollable row. Everything is visible without animation.
- Semantic landmarks, a skip link, real buttons for disclosures, `inert` on
  closed panels, footnotes that link both ways, visible focus rings in `pen`.
- Text colours meet WCAG AA on their grounds.
- Three.js loads lazily after first paint; both canvases pause off-screen and
  cap DPR at 1.5. The loader hides itself with CSS if JS never runs.

## Content

All copy lives in `src/content/site.ts`. Anything marked `placeholder: true`
(or an empty `ERRATA` list, or a pursuit with no blurb) renders with a dashed
red **PLACEHOLDER** tag so it can't be mistaken for real content.
