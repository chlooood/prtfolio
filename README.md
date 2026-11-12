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

- Project images: drop files in `public/work/` and set `image` on the project.
- Hiking photos: drop files in `public/hiking/` and list them in `photos`.

## Structure

```
src/app            layout, page, global styles and tokens
src/components     one file per section, plus RiverMap (the painted map),
                   Birds, Paper (cut-paper scraps), OddsSim (Fig. 1),
                   MotionRoot (scroll behaviour)
src/lib/river.ts   the river's course, shared by the map and the birds
src/content        site.ts — all copy
```

The visual system and interaction principles are documented in
[`DESIGN.md`](DESIGN.md).

Earlier versions are kept on local branches: `design/watercolour` (the
watercolour-landscape direction) and `archive/vite-v1` (the original Vite site).
