"use client";

import { useState } from "react";

/**
 * Fig. 2 — ndtm's tailoring rules, small enough to play with.
 *
 * In the app a vision model only says *what* a screenshot shows (which place,
 * city or alpine). Everything after that — how to get there, what to book,
 * what to pack — comes from plain rules and the traveller's profile. This
 * figure is those rules, re-typed for this page: change the trip and watch
 * the plan rewrite itself.
 */

type Kind = "city" | "alpine";
type Region = "europe" | "americas";
type Sleep = "hut" | "tent";

const TRIPS: { kind: Kind; region: Region; place: string; label: string }[] = [
  { kind: "city", region: "europe", place: "Marseille", label: "City weekend" },
  { kind: "alpine", region: "europe", place: "the Vanoise", label: "Alps hike" },
  { kind: "alpine", region: "americas", place: "Garibaldi", label: "Coast Mountains hike" },
];

const OWNABLE = ["Stove", "Tent", "Water filter", "Headlamp"];

type Line = { text: string; kind: "transport" | "lodging" | "map" };

function plan(kind: Kind, region: Region, sleep: Sleep, place: string, origin: string): { lines: Line[]; why: string } {
  if (kind === "city") {
    return {
      why: "City trip: rail and hostels.",
      lines: [
        { text: `Trains from ${origin}`, kind: "transport" },
        { text: `Hostels in ${place}`, kind: "lodging" },
      ],
    };
  }
  const americas = region === "americas";
  if (sleep === "hut") {
    return {
      why: "Hut trip: transit rarely reaches hut trailheads, so drive or carpool.",
      lines: [
        { text: americas ? `Google Maps: drive from ${origin}` : `Drive from ${origin}`, kind: "transport" },
        { text: americas ? "Find a ride on Poparide" : "Find a carpool on BlaBlaCar", kind: "transport" },
        { text: americas ? "Book Alpine Club of Canada huts" : "Book mountain huts", kind: "lodging" },
        { text: "Trailhead on the map", kind: "map" },
      ],
    };
  }
  if (americas) {
    return {
      why: "Wild camping, North America: driving first. No lodging at all.",
      lines: [
        { text: `Google Maps: drive from ${origin}`, kind: "transport" },
        { text: "Find a ride on Poparide", kind: "transport" },
        { text: "Trailhead on the map", kind: "map" },
      ],
    };
  }
  return {
    why: "Wild camping, Europe: transit to the nearest trailhead first. No lodging at all.",
    lines: [
      { text: "Public transit to the nearest trailhead", kind: "transport" },
      { text: "Trailheads and bus stops nearby", kind: "map" },
      { text: `Fallback: drive from ${origin}`, kind: "transport" },
      { text: "Fallback: carpool on BlaBlaCar", kind: "transport" },
    ],
  };
}

function packing(sleep: Sleep): { title: string; items: string[] }[] {
  if (sleep === "hut") {
    return [
      { title: "Sleep", items: ["Hut sleeping-bag liner", "Earplugs", "Hut slippers"] },
      { title: "Safety", items: ["Offline map / GPX", "Headlamp + spare batteries", "First-aid + blister kit"] },
      { title: "Paperwork", items: ["Hut booking + ID", "Cash (many huts are cash only)"] },
    ];
  }
  return [
    { title: "Shelter", items: ["Tent or bivvy + pegs", "Groundsheet"] },
    { title: "Kitchen", items: ["Stove", "Gas canister (buy on arrival)", "Pot, spork, lighter"] },
    { title: "Water", items: ["Water filter", "Purification tablets"] },
    { title: "Safety", items: ["Offline map / GPX", "Headlamp + spare batteries", "First-aid + blister kit"] },
  ];
}

const ICON = { transport: "→", lodging: "⌂", map: "◎" } as const;

function Seg<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="label mb-2 text-muted">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.value)}
              className={`label border-2 border-ink px-3 py-2 transition-[background-color,color,transform] duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 ${
                on ? "bg-ink text-cream" : "bg-transparent text-ink"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function NdtmFig() {
  const [trip, setTrip] = useState(0);
  const [sleep, setSleep] = useState<Sleep>("hut");
  const [owned, setOwned] = useState<string[]>([]);

  const t = TRIPS[trip];
  const origin = t.region === "americas" ? "Vancouver" : "Lyon";
  const alpine = t.kind === "alpine";
  const p = plan(t.kind, t.region, sleep, t.place, origin);
  const pack = alpine ? packing(sleep) : null;
  const isOwned = (item: string) => owned.some((g) => new RegExp(`\\b${g}\\b`, "i").test(item));
  const skipped = pack ? pack.flatMap((g) => g.items).filter(isOwned).length : 0;

  return (
    <div className="figure text-[0.8125rem]">
      <div className="flex items-baseline justify-between border-b-2 border-ink pb-2">
        <p className="label">A screenshot of {t.place}</p>
        <p className="label text-vermilion">{alpine ? "Alpine" : "City"}</p>
      </div>

      <div className="grid gap-5 py-4 sm:grid-cols-2">
        <Seg
          label="The trip"
          value={String(trip)}
          options={TRIPS.map((x, i) => ({ value: String(i), label: x.label }))}
          onChange={(v) => setTrip(Number(v))}
        />
        <div className={alpine ? "" : "pointer-events-none opacity-35"} aria-hidden={!alpine}>
          <Seg
            label="How you sleep"
            value={sleep}
            options={[
              { value: "hut", label: "Hut" },
              { value: "tent", label: "Wild camping" },
            ]}
            onChange={setSleep}
          />
        </div>
      </div>

      <div className="border-y-2 border-ink py-4" aria-live="polite">
        <p className="label mb-3 text-muted">The plan · from {origin}</p>
        <ul className="space-y-2">
          {p.lines.map((l) => (
            <li key={l.text} className="flex items-baseline gap-3 text-[0.9375rem]">
              <span aria-hidden="true" className={`w-4 text-center ${l.kind === "lodging" ? "text-vermilion" : ""}`}>
                {ICON[l.kind]}
              </span>
              <span>{l.text}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-serif text-[0.9375rem] italic text-ink-2">{p.why}</p>
      </div>

      {pack && (
        <div className="pt-4">
          <fieldset>
            <legend className="label mb-2 text-muted">Gear you already own</legend>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {OWNABLE.map((g) => (
                <label key={g} className="label flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[var(--color-vermilion)]"
                    checked={owned.includes(g)}
                    onChange={(e) => setOwned((o) => (e.target.checked ? [...o, g] : o.filter((x) => x !== g)))}
                  />
                  {g}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-rule pt-4">
            {pack.map((g) => (
              <div key={g.title}>
                <p className="label text-muted">{g.title}</p>
                <ul className="mt-1.5 space-y-1">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className={`transition-opacity duration-300 ${isOwned(item) ? "text-muted line-through decoration-vermilion opacity-60" : ""}`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="label mt-4 text-muted">
            {skipped ? `Left off ${skipped} item${skipped === 1 ? "" : "s"} you already own` : "Nothing left off yet"}
          </p>
        </div>
      )}
    </div>
  );
}
