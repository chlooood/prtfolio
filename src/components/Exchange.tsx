"use client";

import { useState } from "react";
import { CutTitle } from "./CutTitle";
import { Paper } from "./Paper";
import { EXCHANGE_PLACES } from "@/content/site";

/** Place-based editorial cover: each map label opens its own dispatch shelf. */
export function Exchange() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = EXCHANGE_PLACES.find((place) => place.id === selected);

  return (
    <section id="exchange" className="px-[var(--pad)] pt-[clamp(10rem,40vh,24rem)]">
      <CutTitle lines={["Exchange"]} label="Mile 03 · letters from elsewhere" />
      <div className="mt-[clamp(2rem,5vw,4rem)] grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:items-start">
        <div data-sheet className="relative isolate min-w-0 overflow-hidden border-[9px] border-paper bg-[#e2b043] shadow-[0_1px_0_#221a17,0_18px_35px_#221a1740] sm:border-[18px]">
          {/* The cover is an original coded illustration, not a stock map. */}
          <svg viewBox="0 0 780 720" aria-hidden="true" className="block h-auto w-full">
            <rect width="780" height="720" fill="#e9ddc3" />
            <path d="M0 0H780V720H0Z" fill="#e2b043" />
            <path d="M-90 140Q140 70 290 130T810 92M-80 230Q220 180 350 244T850 195M-90 365Q185 300 345 378T850 316M-50 540Q205 478 355 538T820 492M-50 657Q230 595 399 657T830 616" stroke="#c7401f" strokeWidth="72" fill="none" opacity=".86"/>
            <path d="M-40 80C150 190 210 40 360 180S520 410 790 270" stroke="#2f6b4f" strokeWidth="145" fill="none"/>
            <path d="M-40 80C150 190 210 40 360 180S520 410 790 270" stroke="#8aaf78" strokeWidth="7" fill="none" strokeDasharray="2 15" opacity=".8"/>
            <path d="M-65 685C120 565 60 410 220 382S550 486 800 38" stroke="#f4ecdb" strokeWidth="128" fill="none"/>
            <path d="M-65 685C120 565 60 410 220 382S550 486 800 38" stroke="#1c4e8a" strokeWidth="89" fill="none"/>
            <path d="M-65 685C120 565 60 410 220 382S550 486 800 38" stroke="#9ec6d3" strokeWidth="4" strokeDasharray="3 17" fill="none"/>
            <g fill="none" stroke="#221a17" strokeWidth="2" opacity=".45">
              <path d="M-30 600Q130 485 220 537T470 584T820 455" />
              <path d="M-40 617Q130 503 220 555T470 601T820 472" />
              <path d="M-30 630Q130 520 220 571T470 617T820 490" />
            </g>
            <circle cx="626" cy="530" r="96" fill="#f7eed8"/>
            <circle cx="626" cy="530" r="84" fill="none" stroke="#c7401f" strokeWidth="3" strokeDasharray="3 8"/>
            <path d="M588 520l20-21 20 21-20 21z M636 495l12-13 12 13-12 13z" fill="#c7401f"/>
            <g fill="#f7eed8"><path d="M80 78l17-15 17 15-17 15zM121 100l8-9 8 9-8 9z"/></g>
            <path d="M0 0H780V720H0Z" fill="none" stroke="#221a17" strokeWidth="8" strokeDasharray="2 13" />
          </svg>

          <div className="pointer-events-none absolute inset-x-[5%] top-[5%]">
            <p className="label text-cream drop-shadow-[0_2px_2px_#221a17]">A living collection · postcards & dispatches</p>
            <p className="display cutout mt-3 max-w-[8ch] text-[clamp(3.5rem,10vw,9rem)] leading-[.83]">Wish you were here.</p>
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
        <Paper id="exchange-place-panel" data-sheet tilt={1.2} className="min-w-0 px-[clamp(1.25rem,3vw,2.75rem)] py-[clamp(1.5rem,3vw,3rem)]" aria-live="polite">
          <p className="label text-vermilion">{active ? "Selected destination" : "Notes from the road"}</p>
          <h3 className="statement mt-5 text-[clamp(2.6rem,4.5vw,4.5rem)]">{active?.name ?? "The world, in letters."}</h3>
          <p className="mt-5 max-w-[36ch] text-lg leading-relaxed text-ink-2">
            {active?.description ?? "A place to collect the stories that don’t fit on a résumé: the places, people, ideas, and small discoveries worth writing home about."}
          </p>
          <div className="mt-8 border-t-2 border-ink pt-5">
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
                <p className="mt-3 font-serif text-xl italic">No letters posted yet. This chapter is still unfolding.</p>
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
