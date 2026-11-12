"use client";

import { useEffect, useRef, useState } from "react";
import { NOW, PROFILE } from "@/content/site";

const LINKS = [
  { href: "#built", label: "Built" },
  { href: "#read", label: "Read" },
  { href: "#exchange", label: "Exchange" },
  { href: "#off-the-clock", label: "Off the clock" },
  { href: "#contact", label: "Find me" },
];

function useClock(timeZone: string) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-CA", { timeZone, hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return time;
}

/** Quiet text navigation: the landscape and masthead are the focal points. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [tucked, setTucked] = useState(false);
  const time = useClock(NOW.timeZone);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const city = NOW.basedIn.split(",")[0];

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) > 6) {
        setTucked(y > last && y > 320);
        last = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-md transition-transform duration-700 ease-[var(--ease-expo)] focus-within:translate-y-0 ${
          tucked && !open ? "-translate-y-[120%]" : ""
        }`}
      >
        <nav
          aria-label="Primary"
          className="label flex h-[var(--nav-h)] items-center justify-between gap-3 px-[var(--pad)]"
        >
          <a href="#top" className="pointer-events-auto font-display text-[1.2rem] font-extrabold tracking-[-.055em] text-ink no-underline md:text-[1.35rem]">
            {PROFILE.firstName} {PROFILE.lastName}
          </a>

          <ul className="hidden items-center gap-[clamp(.9rem,2vw,2.4rem)] md:flex">
            {LINKS.slice(0, 4).map((l) => (
              <li key={l.href}>
                <a className="site-nav-link pointer-events-auto text-ink-2" href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-5 md:flex">
            <span className="font-mono text-[.65rem] text-ink-2" aria-label={`Local time in ${city}`}>
              {city} <span suppressHydrationWarning>{time ?? "--:--"}</span>
            </span>
            <a href="#contact" className="site-nav-link pointer-events-auto border-b border-ink/30 font-medium text-ink">Find me</a>
          </div>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((v) => !v)}
            className="pointer-events-auto cursor-pointer border-b border-ink/50 px-1 py-2 font-mono text-sm text-ink md:hidden"
          >{open ? "Close ×" : "Menu +"}</button>
        </nav>
      </header>

      <div
        id="menu"
        hidden={!open}
        className="fixed inset-0 z-[45] flex flex-col justify-between overflow-y-auto bg-forest px-[var(--pad)] pb-8 pt-[calc(var(--nav-h)+2rem)] text-cream md:hidden"
      >
        <ul>
          {LINKS.map((l, i) => (
            <li key={l.href} className="border-b border-cream/25">
              <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between py-3 sm:py-4">
                <span className="display text-[clamp(2.7rem,11vw,6rem)]">{l.label}</span>
                <span className="label opacity-70">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="label figure opacity-70">
          {city} {time ?? ""}
        </p>
      </div>
    </>
  );
}
