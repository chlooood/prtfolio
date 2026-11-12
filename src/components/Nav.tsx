"use client";

import { useEffect, useRef, useState } from "react";
import { NOW, PROFILE } from "@/content/site";

const LINKS = [
  { href: "#built", label: "Built" },
  { href: "#worked", label: "Worked" },
  { href: "#read", label: "Read" },
  { href: "#off-the-clock", label: "Off the clock" },
  { href: "#errata", label: "Errata" },
  { href: "#contact", label: "Contact" },
];

function useClock(timeZone: string) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return time;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const time = useClock(NOW.timeZone);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [away, setAway] = useState(false); // scrolled past the top
  const [tucked, setTucked] = useState(false); // hidden while reading down

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setAway(y > 24);
      if (Math.abs(y - last) > 6) {
        setTucked(y > last && y > 320);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const city = NOW.basedIn.split(",")[0];

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
      {/* Clear over the hero, a ruled paper strip after it; steps aside while
          you read down and returns the moment you scroll up. */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-expo)] focus-within:translate-y-0 ${
          open
            ? "border-transparent bg-transparent text-paper"
            : away
              ? "border-rule bg-paper text-ink"
              : "border-transparent bg-transparent text-ink"
        } ${tucked && !open ? "-translate-y-full" : ""}`}
      >
        <nav
          aria-label="Primary"
          className="label flex h-[var(--nav-h)] items-center justify-between px-[var(--pad)]"
        >
          <a href="#top" className="py-3">
            {PROFILE.firstName} {PROFILE.lastName}
          </a>

          <ul className="hidden gap-[clamp(1rem,2.2vw,2.25rem)] md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative py-3">
                  {l.label}
                  <span className="absolute inset-x-0 bottom-1.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <p className="figure hidden md:block" aria-label={`Local time in ${city}`}>
            {city} <span suppressHydrationWarning>{time ?? "--:--"}</span>
          </p>

          <button
            ref={toggleRef}
            type="button"
            className="label -mr-2 px-2 py-3 md:hidden"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Index"}
          </button>
        </nav>
      </header>

      <div
        id="menu"
        hidden={!open}
        className="fixed inset-0 z-[45] flex flex-col justify-between bg-ink px-[var(--pad)] pb-8 pt-[calc(var(--nav-h)+2rem)] text-paper md:hidden"
      >
        <ul>
          {LINKS.map((l, i) => (
            <li key={l.href} className="border-b border-paper/20">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-4"
              >
                <span className="display text-[11vw]" style={{ ["--wdth" as string]: 100 }}>
                  {l.label}
                </span>
                <span className="label text-paper/60">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="label figure text-paper/60">
          {city} {time ?? ""}
        </p>
      </div>
    </>
  );
}
