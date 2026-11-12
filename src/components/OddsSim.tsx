"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Fig. 1 — a toy version of the odds engine's premise, written for this page.
 *
 * A "true" probability takes a random walk. Four books quote it, each a
 * little late and a little wrong, each with a margin built in. When the best
 * price on each side implies less than 100% between them, that's an arbitrage
 * — and the two dials show where those come from: latency and noise.
 *
 * Seeded, so the same seed and dials always replay the same market.
 */

const BOOKS = ["Book A", "Book B", "Book C", "Book D"];
const LAG = [0, 0.5, 1, 1.6]; // × latency dial, in ticks
const NOISE = [0.7, 1, 1.2, 1.5]; // × noise dial
const MARGIN = 0.05;
const WINDOW = 150;
const TICK_MS = 150;

const INK = "#191c12";
const PEN = "#c4320f";
const RULE = "rgba(25,28,18,0.16)";
const MUTED = "#5f6150";

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Quote = { home: number; away: number };
type Snapshot = {
  quotes: Quote[];
  bestHome: number;
  bestAway: number;
  sum: number;
  ticks: number;
  arbs: number;
  bestEdge: number;
};

type Sim = {
  rng: () => number;
  x: number;
  path: number[];
  sums: number[];
  ticks: number;
  arbs: number;
  bestEdge: number;
};

function newSim(seed: number): Sim {
  return { rng: mulberry32(seed), x: 0, path: [], sums: [], ticks: 0, arbs: 0, bestEdge: 0 };
}

function gauss(rng: () => number) {
  const u = Math.max(rng(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}

function step(sim: Sim, latency: number, noise: number): Snapshot {
  sim.x = sim.x * 0.992 + gauss(sim.rng) * 0.035;
  const p = 1 / (1 + Math.exp(-sim.x));
  sim.path.push(p);
  if (sim.path.length > 64) sim.path.shift();

  const quotes = BOOKS.map((_, i) => {
    const lag = Math.round(LAG[i] * latency);
    const stale = sim.path[Math.max(0, sim.path.length - 1 - lag)];
    const q = Math.min(0.94, Math.max(0.06, stale + gauss(sim.rng) * noise * NOISE[i]));
    return { home: 1 / (q * (1 + MARGIN)), away: 1 / ((1 - q) * (1 + MARGIN)) };
  });

  let bestHome = 0;
  let bestAway = 0;
  quotes.forEach((q, i) => {
    if (q.home > quotes[bestHome].home) bestHome = i;
    if (q.away > quotes[bestAway].away) bestAway = i;
  });
  const sum = 1 / quotes[bestHome].home + 1 / quotes[bestAway].away;

  sim.ticks++;
  if (sum < 1) {
    sim.arbs++;
    sim.bestEdge = Math.max(sim.bestEdge, (1 / sum - 1) * 100);
  }
  sim.sums.push(sum);
  if (sim.sums.length > WINDOW) sim.sums.shift();

  return { quotes, bestHome, bestAway, sum, ticks: sim.ticks, arbs: sim.arbs, bestEdge: sim.bestEdge };
}

function draw(canvas: HTMLCanvasElement, sums: number[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const lo = 0.93;
  const hi = 1.08;
  const padR = 44;
  const X = (i: number) => (i / (WINDOW - 1)) * (w - padR);
  const Y = (v: number) => h - ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * h;
  const y1 = Y(1);

  // Graph-paper ticks.
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let gx = 0; gx <= w - padR; gx += (w - padR) / 12) {
    ctx.moveTo(Math.round(gx) + 0.5, 0);
    ctx.lineTo(Math.round(gx) + 0.5, h);
  }
  ctx.stroke();

  // Below-the-line area: every red sliver is an arbitrage window.
  ctx.fillStyle = PEN;
  ctx.beginPath();
  ctx.moveTo(X(0), y1);
  sums.forEach((s, i) => ctx.lineTo(X(i), Math.max(y1, Y(s))));
  ctx.lineTo(X(sums.length - 1), y1);
  ctx.closePath();
  ctx.fill();

  // The 100% line.
  ctx.strokeStyle = INK;
  ctx.setLineDash([2, 4]);
  ctx.beginPath();
  ctx.moveTo(0, Math.round(y1) + 0.5);
  ctx.lineTo(w, Math.round(y1) + 0.5);
  ctx.stroke();
  ctx.setLineDash([]);

  // The trace.
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.25;
  ctx.lineJoin = "round";
  ctx.beginPath();
  sums.forEach((s, i) => (i ? ctx.lineTo(X(i), Y(s)) : ctx.moveTo(X(i), Y(s))));
  ctx.stroke();

  const last = sums[sums.length - 1];
  if (last !== undefined) {
    ctx.fillStyle = last < 1 ? PEN : INK;
    ctx.beginPath();
    ctx.arc(X(sums.length - 1), Y(last), 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.font = '10px var(--font-dm-mono), monospace';
  ctx.fillStyle = MUTED;
  ctx.textAlign = "right";
  ctx.fillText("100%", w, y1 - 6);
}

export function OddsSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<Sim>(newSim(2029));
  const dials = useRef({ latency: 4, noise: 0.006 });

  const [latency, setLatency] = useState(4);
  const [noise, setNoise] = useState(6);
  const [seed, setSeed] = useState(2029);
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(false);
  const [snap, setSnap] = useState<Snapshot | null>(null);

  dials.current = { latency, noise: noise / 1000 };

  const prime = useCallback((s: number) => {
    const sim = newSim(s);
    simRef.current = sim;
    let last: Snapshot | null = null;
    for (let i = 0; i < WINDOW; i++) last = step(sim, dials.current.latency, dials.current.noise);
    setSnap(last);
    if (canvasRef.current) draw(canvasRef.current, sim.sums);
  }, []);

  // Fill the window once so the figure is never empty, then autoplay unless
  // the visitor prefers reduced motion.
  useEffect(() => {
    prime(seed);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(true);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.1 });
    if (wrapRef.current) io.observe(wrapRef.current);
    const onResize = () => canvasRef.current && draw(canvasRef.current, simRef.current.sums);
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!playing || !inView) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      const s = step(simRef.current, dials.current.latency, dials.current.noise);
      setSnap(s);
      if (canvasRef.current) draw(canvasRef.current, simRef.current.sums);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [playing, inView]);

  const reseed = () => {
    const next = ((seed * 48271) % 9973) + 1000;
    setSeed(next);
    prime(next);
  };

  const arb = snap ? snap.sum < 1 : false;
  const edge = snap && arb ? (1 / snap.sum - 1) * 100 : 0;

  return (
    <div ref={wrapRef} className="figure text-[0.8125rem]">
      <div className="flex items-baseline justify-between border-b border-ink pb-2">
        <p className="label">Home v. Away — four books</p>
        <p className={`label ${arb ? "text-pen" : "text-muted"}`} aria-hidden="true">
          {arb ? `Arbitrage +${edge.toFixed(2)}%` : "No arbitrage"}
        </p>
      </div>

      <table className="w-full border-collapse">
        <caption className="sr-only">
          Simulated decimal odds from four bookmakers for a two-outcome market
        </caption>
        <thead>
          <tr className="label text-muted">
            <th scope="col" className="py-2 text-left font-normal">Book</th>
            <th scope="col" className="py-2 text-right font-normal">Lag</th>
            <th scope="col" className="py-2 text-right font-normal">Home</th>
            <th scope="col" className="py-2 text-right font-normal">Away</th>
          </tr>
        </thead>
        <tbody>
          {BOOKS.map((b, i) => {
            const q = snap?.quotes[i];
            const bh = snap?.bestHome === i;
            const ba = snap?.bestAway === i;
            return (
              <tr key={b} className="border-t border-rule">
                <th scope="row" className="py-2 text-left font-normal">{b}</th>
                <td className="py-2 text-right text-muted">{Math.round(LAG[i] * latency)}t</td>
                <td className={`py-2 text-right ${bh ? (arb ? "text-pen" : "underline underline-offset-4") : ""}`}>
                  {q ? q.home.toFixed(3) : "—"}
                </td>
                <td className={`py-2 text-right ${ba ? (arb ? "text-pen" : "underline underline-offset-4") : ""}`}>
                  {q ? q.away.toFixed(3) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 border-y border-ink">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Line chart of the combined implied probability of the best available prices over time. Red areas mark moments it dips below 100 percent, which are arbitrage opportunities."
          className="block h-[clamp(9rem,22vw,15rem)] w-full"
        />
      </div>

      <dl className="grid grid-cols-3 gap-x-4 border-b border-rule py-3">
        <div>
          <dt className="label text-muted">Σ implied</dt>
          <dd className={`mt-1 text-lg ${arb ? "text-pen" : ""}`}>
            {snap ? (snap.sum * 100).toFixed(2) : "—"}%
          </dd>
        </div>
        <div>
          <dt className="label text-muted">Arb ticks</dt>
          <dd className="mt-1 text-lg">
            {snap ? snap.arbs.toLocaleString("en-CA") : "—"}
            <span className="text-muted"> / {snap ? snap.ticks.toLocaleString("en-CA") : "—"}</span>
          </dd>
        </div>
        <div>
          <dt className="label text-muted">Best edge</dt>
          <dd className="mt-1 text-lg">{snap ? snap.bestEdge.toFixed(2) : "—"}%</dd>
        </div>
      </dl>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-4">
        <label className="block">
          <span className="label flex justify-between">
            <span>Latency</span>
            <span className="text-muted">{latency} ticks</span>
          </span>
          <input
            className="dial"
            type="range"
            min={0}
            max={8}
            step={1}
            value={latency}
            onChange={(e) => setLatency(Number(e.target.value))}
          />
        </label>
        <label className="block">
          <span className="label flex justify-between">
            <span>Pricing noise</span>
            <span className="text-muted">±{(noise / 10).toFixed(1)} pts</span>
          </span>
          <input
            className="dial"
            type="range"
            min={0}
            max={15}
            step={1}
            value={noise}
            onChange={(e) => setNoise(Number(e.target.value))}
          />
        </label>
        <div className="col-span-2 flex items-center gap-6">
          <button type="button" className="label link py-2" onClick={() => setPlaying((p) => !p)}>
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" className="label link py-2" onClick={reseed}>
            Reseed
          </button>
          <span className="label ml-auto text-muted">Seed {seed}</span>
        </div>
      </div>
    </div>
  );
}
