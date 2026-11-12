"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Fig. 3 — Runway's forecast rule, small enough to play with.
 *
 * The app's forecast is deliberately not machine learning: for each future
 * day, subtract the selected city's average daily spending — or the trip's
 * budget once the exchange starts — and take flights and the deposit off on
 * the first day away. This figure is that rule on made-up numbers.
 */

const INK = "#221a17";
const PEN = "#c7401f";
const SEA = "#1c4e8a";
const MUSTARD = "#e2b043";
const RULE = "rgba(34,26,23,0.16)";
const MUTED = "#6b5d50";

const CITIES = {
  vancouver: { label: "Vancouver", daily: 36 },
  toronto: { label: "Toronto", daily: 47 },
} as const;
type City = keyof typeof CITIES;

const HISTORY_DAYS = 80;
const TO_DEPARTURE = 54;
const STAY_DAYS = 120;
const UPFRONT = 1900;
const TODAY_BALANCE = 15400;
const DAYS_PER_MONTH = 365 / 12;

/** Made-up history: a paid summer term, then a term with no paycheque. */
function history(): number[] {
  const out: number[] = [];
  let b = 11650;
  for (let d = 0; d < HISTORY_DAYS; d++) {
    const working = d < 44;
    if (working && d % 14 === 6) b += 2380;
    b -= working ? 47 : 36;
    out.push(b);
  }
  const shift = TODAY_BALANCE - out[out.length - 1];
  return out.map((v) => v + shift);
}

function forecast(city: City, monthly: number, trim: number) {
  const daily = Math.max(0, CITIES[city].daily - trim);
  const out: number[] = [];
  let b = TODAY_BALANCE;
  for (let d = 1; d <= TO_DEPARTURE + STAY_DAYS; d++) {
    if (d <= TO_DEPARTURE) b -= daily;
    else {
      if (d === TO_DEPARTURE + 1) b -= UPFRONT;
      b -= monthly / DAYS_PER_MONTH;
    }
    out.push(b);
  }
  return out;
}

const money = (n: number) => `${n < 0 ? "−" : ""}$${Math.abs(Math.round(n)).toLocaleString("en-CA")}`;

export function RunwayFig() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [city, setCity] = useState<City>("vancouver");
  const [monthly, setMonthly] = useState(1450);
  const [trim, setTrim] = useState(0);

  const past = useMemo(history, []);
  const future = useMemo(() => forecast(city, monthly, trim), [city, monthly, trim]);

  const goal = UPFRONT + (monthly / DAYS_PER_MONTH) * STAY_DAYS;
  const atDeparture = future[TO_DEPARTURE - 1];
  const atEnd = future[future.length - 1];
  const onTrack = atDeparture >= goal;
  const dryDay = future.findIndex((v, i) => i >= TO_DEPARTURE && v < 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const total = past.length + future.length;
      const hi = 19000;
      const lo = Math.min(-1500, Math.min(...future) - 500);
      const X = (i: number) => (i / (total - 1)) * w;
      const Y = (v: number) => h - ((v - lo) / (hi - lo)) * h;
      const iToday = past.length - 1;
      const iLeave = past.length + TO_DEPARTURE - 1;

      // The term away, shaded.
      ctx.fillStyle = "rgba(28,78,138,0.12)";
      ctx.fillRect(X(iLeave), 0, w - X(iLeave), h);

      // Zero and goal lines.
      ctx.lineWidth = 1;
      ctx.strokeStyle = RULE;
      ctx.beginPath();
      ctx.moveTo(0, Math.round(Y(0)) + 0.5);
      ctx.lineTo(w, Math.round(Y(0)) + 0.5);
      ctx.stroke();
      ctx.strokeStyle = MUSTARD;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(0, Y(goal));
      ctx.lineTo(X(iLeave), Y(goal));
      ctx.stroke();
      ctx.setLineDash([]);

      // History: solid ink.
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.beginPath();
      past.forEach((v, i) => (i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v))));
      ctx.stroke();

      // Projection: dashed, blue while it holds and red once it's below zero.
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = SEA;
      ctx.beginPath();
      ctx.moveTo(X(iToday), Y(past[iToday]));
      future.forEach((v, i) => ctx.lineTo(X(past.length + i), Y(Math.max(v, 0))));
      ctx.stroke();
      if (dryDay >= 0) {
        ctx.strokeStyle = PEN;
        ctx.beginPath();
        ctx.moveTo(X(past.length + dryDay), Y(0));
        future.slice(dryDay).forEach((v, i) => ctx.lineTo(X(past.length + dryDay + i), Y(v)));
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Markers.
      const dot = (i: number, v: number, c: string) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(X(i), Y(v), 4, 0, Math.PI * 2);
        ctx.fill();
      };
      dot(iToday, past[iToday], INK);
      dot(iLeave, atDeparture, onTrack ? SEA : PEN);

      ctx.font = "10px var(--font-dm-mono), monospace";
      ctx.fillStyle = MUTED;
      ctx.textAlign = "left";
      ctx.fillText("GOAL", 4, Y(goal) - 6);
      ctx.fillText("AWAY", X(iLeave) + 6, 14);
      ctx.textAlign = "right";
      ctx.fillText("TODAY", X(iToday) - 6, Y(past[iToday]) - 8);
    };
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [past, future, goal, atDeparture, onTrack, dryDay]);

  return (
    <div className="figure text-[0.8125rem]">
      <div className="flex items-baseline justify-between border-b-2 border-ink pb-2">
        <p className="label">Will it last?</p>
        <p className={`label ${onTrack && dryDay < 0 ? "text-forest" : "text-vermilion"}`} aria-live="polite">
          {!onTrack ? "Short of the goal" : dryDay >= 0 ? "Runs out while away" : "On track"}
        </p>
      </div>

      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Line chart of a savings balance: solid history up to today, then a dashed projection to departure day and through a shaded term away, against a dashed goal line."
        className="mt-4 block h-[clamp(11rem,24vw,16rem)] w-full border-b-2 border-ink"
      />

      <dl className="grid grid-cols-3 gap-x-4 border-b border-rule py-3">
        <div>
          <dt className="label text-muted">On departure</dt>
          <dd className={`mt-1 text-lg ${onTrack ? "" : "text-vermilion"}`}>{money(atDeparture)}</dd>
        </div>
        <div>
          <dt className="label text-muted">Goal</dt>
          <dd className="mt-1 text-lg">{money(goal)}</dd>
        </div>
        <div>
          <dt className="label text-muted">Left after</dt>
          <dd className={`mt-1 text-lg ${atEnd < 0 ? "text-vermilion" : ""}`}>{money(atEnd)}</dd>
        </div>
      </dl>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4">
        <fieldset className="col-span-2">
          <legend className="label mb-2 text-muted">Cost of living until I leave</legend>
          <div className="flex gap-2">
            {(Object.keys(CITIES) as City[]).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={city === c}
                onClick={() => setCity(c)}
                className={`label border-2 border-ink px-3 py-2 transition-[background-color,color,transform] duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 ${
                  city === c ? "bg-ink text-cream" : "text-ink"
                }`}
              >
                {CITIES[c].label}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="block">
          <span className="label flex justify-between">
            <span>Budget away</span>
            <span className="text-muted">{money(monthly)}/mo</span>
          </span>
          <input
            className="dial"
            type="range"
            min={1000}
            max={3600}
            step={50}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
          />
        </label>
        <label className="block">
          <span className="label flex justify-between">
            <span>Trim dining &amp; fun</span>
            <span className="text-muted">−{money(trim)}/day</span>
          </span>
          <input
            className="dial"
            type="range"
            min={0}
            max={20}
            step={1}
            value={trim}
            onChange={(e) => setTrim(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
