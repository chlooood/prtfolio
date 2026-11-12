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
        <div data-sheet className="relative isolate min-w-0 overflow-hidden border-[9px] border-paper bg-[#485875] shadow-[0_1px_0_#5f5062,0_18px_35px_#5f506233] sm:border-[18px] lg:sticky lg:top-24">
          <div className="aspect-[780/870] w-full"><ExchangeLandscape /></div>

          <div className="pointer-events-none absolute inset-x-[5%] top-[5%]">
            <p className="font-serif text-[clamp(.8rem,1.4vw,1.05rem)] italic text-cream drop-shadow-[0_2px_2px_#2a1f27]">Postcards & dispatches</p>
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
                <span className="flex items-center gap-1.5 border border-cream/70 bg-paper/95 px-2.5 py-2 font-serif text-[clamp(.75rem,1.3vw,1rem)] font-semibold text-ink shadow-[2px_3px_0_#594e6a] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-2deg] sm:px-3">
                  <span aria-hidden="true" style={{ color: place.accent }}>✳</span>{place.name}
                </span>
              </button>
            ))}
          </div>
          <p className="pointer-events-none absolute bottom-[3%] left-[4%] bg-paper/95 px-3 py-2 font-serif text-sm italic text-ink sm:text-base">
            Pick a place to unfold a letter ↗
          </p>
        </div>
        <Paper id="exchange-place-panel" data-sheet tilt={1.2} className="relative min-w-0 overflow-hidden px-[clamp(1.25rem,3vw,2.75rem)] py-[clamp(1.5rem,3vw,3rem)]" aria-live="polite">
          <div className="absolute right-[-3rem] top-[-3rem] -z-10 h-40 w-40 rounded-full opacity-20 transition-colors duration-500" style={{ backgroundColor: active?.accent ?? "var(--color-mustard)" }} aria-hidden="true" />
          <div className="flex items-center justify-between gap-3 border-b border-rule pb-4">
            <span className="font-serif text-sm italic text-maroon">The Exchange · Field notes</span>
            <span className="font-mono text-[.65rem] text-muted">{active ? active.motif : "An open notebook"}</span>
          </div>
          <div aria-hidden="true" className="mt-7 flex items-center justify-between">
            <span className="font-serif text-sm italic text-muted">Postcards, places, people</span>
            <span className="font-serif text-4xl italic text-vermilion">{active ? "✳" : "↗"}</span>
          </div>
          <h3 key={active?.id ?? "cover"} className="statement mt-3 text-[clamp(2.6rem,4.5vw,4.5rem)] motion-safe:animate-[exchange-unfold_.55s_cubic-bezier(.16,1,.3,1)_both]">{active?.name ?? "The world, in letters."}</h3>
          <p key={active?.id ?? "intro"} className="mt-5 max-w-[36ch] text-lg leading-relaxed text-ink-2 motion-safe:animate-[exchange-unfold_.7s_cubic-bezier(.16,1,.3,1)_both]">
            {active?.description ?? "A place to collect the stories that don’t fit on a résumé: the places, people, ideas, and small discoveries worth writing home about."}
          </p>
          <div aria-hidden="true" className="my-9 flex gap-1.5 overflow-hidden">
            {Array.from({length:12}, (_, i) => (
              <span key={i} className="h-[3px] shrink-0 bg-forest" style={{width: `${i%3===0?30:15}px`, transform: `rotate(${i%2?3:-3}deg)`}} />
            ))}
          </div>
          <div className="border-t-2 border-ink pt-5">
            <p className="font-serif text-base italic text-muted">{active ? "From the archive" : "How to explore"}</p>
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
          {active && active.photos && active.photos.length > 0 && (
            <div className="mt-9 space-y-6 border-t border-rule pt-6">
              {active.photos.map((photo) => (
                <figure key={photo.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.src} alt={photo.alt} loading="lazy" className="w-full object-cover" />
                  {photo.caption && <figcaption className="mt-3 font-serif text-sm italic text-muted">{photo.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}
          {active && active.notes && active.notes.length > 0 && (
            <div className="mt-8 space-y-8 border-t border-rule pt-7">
              {active.notes.map((note) => (
                <article key={note.heading}>
                  <h4 className="statement text-[clamp(1.55rem,3vw,2.75rem)]">{note.heading}</h4>
                  <p className="mt-3 whitespace-pre-line font-serif text-[1.06rem] leading-[1.8] text-ink-2">{note.body}</p>
                </article>
              ))}
            </div>
          )}
          {active && (
            <button type="button" onClick={() => setSelected(null)} className="editorial-link mt-8 cursor-pointer font-serif text-base text-maroon">
              ← Return to the whole map
            </button>
          )}
        </Paper>
      </div>
    </section>
  );
}
