# AGENTS.md

## Project
Downstream is a single-page interactive portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS v4, GSAP/ScrollTrigger/Draggable and a Three.js WebGL map.

## Read first
- `DESIGN.md` is the art-direction and interaction contract.
- `src/content/site.ts` owns site copy, projects, books, pursuits and future exchange dispatches.
- `src/app/page.tsx` composes sections; `src/app/globals.css` defines colors, typography and paper styles.
- `src/components/RiverMap.tsx` is the one shader-backed map; `src/lib/river.ts` mirrors its course for `Boats`.
- `MotionRoot.tsx` owns shared GSAP scroll entrances and draggable scraps; project figures own their interactions.

## Design constraints
Preserve the Downstream concept: a continuous gouache river, bare paper reading zones, cut-paper surfaces, Bricolage display type, Fraunces reading type and DM Mono captions, tactile and sometimes unconventional interactions. Do not redesign into generic cards, glass UI, gradients or a template. This experimental branch emphasizes soft rose/mauve/apricot/blue washes, restrained text navigation, and case-study evidence without invented claims. Add new content as intentional destinations along the river. Prioritize legibility and delight equally.

## Commands
- `npm install`
- `npm run dev`
- `npm run typecheck`
- `npm run build`

No automated browser or unit test scripts are currently configured. Run desktop/mobile browser checks when available; check reduced motion, keyboard navigation, WebGL failure and interactions.

## Working agreement
Use a dedicated working branch. GitHub Contents API file edits create commits automatically; never merge, deploy, or update `main` without explicit user approval. Keep changes focused and describe committed files and verification accurately. Never invent personal writing or substitute generated photos for real travel/soccer/hiking photographs without user approval.

## Content
Reading lists distinguish currently reading from finished. `PURSUITS` photo arrays intentionally remain empty until real user photos arrive. Exchange should accept genuine dispatches over time; an empty state is preferable to fictional posts.
