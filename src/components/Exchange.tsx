"use client";

import { useState } from "react";
import { CutTitle } from "./CutTitle";
import { Paper } from "./Paper";
import { EXCHANGE_PLACES } from "@/content/site";
import { ExchangeLandscape } from "./ExchangeLandscape";

/** Place-based editorial cover: each map label opens its own dispatch shelf. */
export function Exchange() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = EXCHANGE_PLACES.find((place) => place.id === selected);

  return (
    <section id="exchange" className="px-[var(--pad)] pt-[clamp(10rem,40vh,24rem)]">
      <CutTitle lines={["Exchange"]} label="Mile 03 · letters from elsewhere" />
      <div className="mt-[clamp(2rem,5vw,4rem)] grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:items-start">
        <div data-sheet className="relative isolate min-w-0 overflow-hidden border-[9px] border-paper bg-[#092c25] shadow-[0_1px_0_#221a17,0_18px_35px_#221a1740] sm:border-[18px] lg:sticky lg:top-24">
          <div className="aspect-[780/870] w-full"><ExchangeLandscape /></div>

          <div className="pointer-events-none absolute inset-x-[5%] top-[5%]">
            <p className="label text-cream drop-shadow-[0_2px_2px_#221a17]">A living collection · postcards & dispatches</p>
            <p className="display cutout mt-3 max-w-[8ch] text-[clamp(3rem,8.2vw,7rem)] leading-[.83]">Elsewhere, in colour.</p>
          </div>
          <div className="absolute inset-0" role="group" aria-label="Choose a place on the illustrated cover">
            {EXCHANGE_PLACES.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => setSelected((old) => old === place.id ? null : place.id)}
                aria-pressed={selected === place.id}
                aria-controls="exchange-place-panel"
                style={{ left: place.x, top: place.y }}
                className={`group absolute z-10 -translate-x-1/2 -translate-y-1/2 touch-manipulation focus-visible:outline-cream ${selected === place.id ? "scale-110" : ""}`}
              >
                <span className="flex items-center gap-1.5 bg-paper px-2.5 py-2 font-mono text-[clamp(.625rem,1.1vw,.75rem)] font-medium uppercase tracking-wider text-ink shadow-[3px_4px_0_#221a17] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-2deg] sm:px-3">
                  <span aria-hidden="true" className="text-vermilion">✳</span>{place.name}
                </span>
              </button>
            ))}
          </div>
          <p className="pointer-events-none absolute bottom-[3%] left-[4%] bg-paper px-3 py-2 font-mono text-[.6rem] uppercase tracking-[.15em] text-ink sm:text-xs">
            Pick a place to unfold a letter ↗
          </p>
        </div>
        <Paper id="exchange-place-panel" data-sheet tilt={1.2} className="relative min-w-0 overflow-hidden px-[clamp(1.25rem,3vw,2.75rem)] py-[clamp(1.5rem,3vw,3rem)]" aria-live="polite">
          <div className="flex items-center justify-between gap-3 border-b border-rule pb-4">
            <span className="label text-vermilion">The Exchange · Field notes</span>
            <span className="label text-muted">{active ? "01 / Open chapter" : "Issue 001 / In progress"}</span>
          </div>
          <div aria-hidden="true" className="mt-7 flex items-center justify-between">
            <span className="label text-muted">Postcards, places, people</span>
            <span className="font-serif text-4xl italic text-vermilion">{active ? "✳" : "↗"}</span>
          </div>
          <h3 className="statement mt-3 text-[clamp(2.6rem,4.5vw,4.5rem)]">{active?.name ?? "The world, in letters."}</h3>
          <p className="mt-5 max-w-[36ch] text-lg leading-relaxed text-ink-2">
            {active?.description ?? "A place to collect the stories that don’t fit on a résumé: the places, people, ideas, and small discoveries worth writing home about."}
          </p>
          <div aria-hidden="true" className="my-9 flex gap-1.5 overflow-hidden">
            {Array.from({length:12}, (_, i) => (
              <span key={i} className="h-[3px] shrink-0 bg-forest" style={{width: `${i%3===0?30:15}px`, transform: `rotate(${i%2?3:-3}deg)`}} />
            ))}
          </div>
          <div className="border-t-2 border-ink pt-5">
            <p className="label text-muted">{active ? "From the archive" : "How to explore"}</p>
            {active ? (
              active.posts.length ? (
                <ul className="mt-4 space-y-3">
                  {active.posts.map((post) => (
                    <li key={post.href}>
                      <a href={post.href} className="statement link text-2xl">{post.title} ↗</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 font-serif text-xl italic">An empty chapter for now. The first letter will be added here when it is written.</p>
              )
            ) : (
              <p className="mt-3 font-serif text-xl italic">Touch any place on the cover to open its chapter.</p>
            )}
          </div>
          {active && (
            <button type="button" onClick={() => setSelected(null)} className="label link mt-8 cursor-pointer text-vermilion">
              ← Return to the whole map
            </button>
          )}
        </Paper>
      </div>
    </section>
  );
}
