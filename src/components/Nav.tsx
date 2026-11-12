"use client";

import { useEffect, useRef, useState } from "react";
import { NOW, PROFILE } from "@/content/site";
import { Paper } from "./Paper";

const LINKS = [
  { href: "#built", label: "Built", sheet: "var(--color-pink)" },
  { href: "#read", label: "Read", sheet: "var(--color-mustard)" },
  { href: "#off-the-clock", label: "Off the clock", sheet: "var(--color-paper)" },
  { href: "#contact", label: "Find me", sheet: "var(--color-paper)" },
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

/** Navigation as a handful of paper tags pinned along the top of the map. */
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
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-[var(--ease-expo)] focus-within:translate-y-0 ${
          tucked && !open ? "-translate-y-[120%]" : ""
        }`}
      >
        <nav
          aria-label="Primary"
          className="label flex h-[var(--nav-h)] items-center justify-between gap-3 px-[var(--pad)]"
        >
          <Paper as="a" flat tilt={-2} href="#top" className="tag pointer-events-auto">
            {PROFILE.firstName} {PROFILE.lastName}
          </Paper>

          <ul className="hidden items-center gap-2 md:flex">
            {LINKS.slice(0, 3).map((l, i) => (
              <li key={l.href}>
                <Paper as="a" flat tilt={i % 2 ? -1.5 : 1.5} sheet={l.sheet} href={l.href} className="tag pointer-events-auto">
                  {l.label}
                </Paper>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <Paper flat tilt={1} className="tag figure" aria-label={`Local time in ${city}`}>
              {city} <span suppressHydrationWarning>{time ?? "--:--"}</span>
            </Paper>
            <Paper as="a" flat tilt={-1.5} sheet="var(--color-ink)" href="#contact" className="tag pointer-events-auto text-cream">
              Find me
            </Paper>
          </div>

          <Paper
            as="button"
            flat
            tilt={2}
            sheet={open ? "var(--color-vermilion)" : "var(--color-ink)"}
            ref={toggleRef}
            type="button"
            className="tag pointer-events-auto text-cream md:hidden"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Index"}
          </Paper>
        </nav>
      </header>

      <div
        id="menu"
        hidden={!open}
        className="fixed inset-0 z-[45] flex flex-col justify-between bg-forest px-[var(--pad)] pb-8 pt-[calc(var(--nav-h)+2rem)] text-cream md:hidden"
      >
        <ul>
          {LINKS.map((l, i) => (
            <li key={l.href} className="border-b border-cream/25">
              <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between py-4">
                <span className="display text-[13vw]">{l.label}</span>
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
