// One shared rAF loop. Lenis, the constellation and lit surfaces all subscribe here.
type Tick = (dt: number, t: number) => void;
interface Sub { fn: Tick; priority: number }

const subs: Sub[] = [];
let raf = 0;
let last = 0;
let bound = false;

function frame(t: number) {
  const dt = Math.min(0.05, Math.max(0, (t - last) / 1000));
  last = t;
  for (const s of subs.slice()) s.fn(dt, t);
  raf = requestAnimationFrame(frame);
}

function start() {
  if (raf || typeof document === "undefined" || document.hidden || !subs.length) return;
  last = performance.now();
  raf = requestAnimationFrame(frame);
}

function stop() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
}

export function subscribe(fn: Tick, priority = 0) {
  if (!bound && typeof document !== "undefined") {
    bound = true;
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  }
  const sub = { fn, priority };
  subs.push(sub);
  subs.sort((a, b) => a.priority - b.priority);
  start();
  return () => {
    const i = subs.indexOf(sub);
    if (i >= 0) subs.splice(i, 1);
    if (!subs.length) stop();
  };
}
