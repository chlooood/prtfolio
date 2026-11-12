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
src/components     one file per section, plus Landscape (the painting),
                   OddsSim (Fig. 1), Swatch, MotionRoot (scroll behaviour)
src/content        site.ts — all copy
```

The visual system and interaction principles are documented in
[`DESIGN.md`](DESIGN.md).

The previous Vite version of this site is kept on the local branch
`archive/vite-v1`.
