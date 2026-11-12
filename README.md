# Chloe Dacey — portfolio

Next.js (App Router) · TypeScript · Tailwind CSS v4 · GSAP · Three.js

```bash
npm install
npm run dev
```

## Editing

Everything the site says is in [`src/content/site.ts`](src/content/site.ts).
Search it for `TODO` to find what's still waiting on real content; placeholder
entries show on the page with a red **PLACEHOLDER** tag until replaced.

- Projects: add an entry to `PROJECTS`. Give it a `figure` to pair it with an
  interactive demo (`OddsSim`, `NdtmFig`, `RunwayFig` are the existing ones);
  without one it is listed in a plain index under the others.
- Photos: create `public/soccer/`, `public/running/`, `public/travel/`, and `public/hiking/` as needed. Add items to each pursuit’s `photos` array as `{ src: "/soccer/01.jpg", alt: "Description", caption: "Optional note" }`. Click a tree-ring disc to reveal its inline slideshow; empty galleries display a quiet coming-soon state.
- Exchange: edit `EXCHANGE_PLACES` in `src/content/site.ts`; each place has an illustrated map label, a short introduction and optional links to actual dispatches. The archive stays empty until real posts exist.

## Structure

```
src/app            layout, page, global styles and tokens
src/components     one file per section, plus RiverMap (the painted map),
                   Boats, Paper (cut-paper scraps), the project figures
                   (OddsSim, NdtmFig, RunwayFig), CutTitle,
                   MotionRoot (scroll behaviour)
src/lib/river.ts   the river's course, shared by the map and the boats
src/content        site.ts — all copy
```

The visual system and interaction principles are documented in
[`DESIGN.md`](DESIGN.md).

Earlier versions are kept on local branches: `design/watercolour` (the
watercolour-landscape direction) and `archive/vite-v1` (the original Vite site).

## Development notes

The smaller, calmer type and spacing are intentional: preserve the illustrated river as the dominant feature. Boats are decorative and fan out when they reach the sea. Do not turn the four Off the Clock discs into route links; they expand an inline scrapbook gallery.
