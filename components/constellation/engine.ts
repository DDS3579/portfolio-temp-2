import {
  JOURNEY_NODES,
  NODE_IDS,
  NODE_LABELS,
  STATES,
  STATE_ORDER,
  type EdgeSpec,
  type NodeId,
  type NodeSpec,
  type StateSpec,
} from "@/content/constellation";
import { clamp, easeInOutCubic, lerp } from "@/lib/ease";
import { updateLitSurfaces } from "@/lib/lit";
import { igniteFlash, igniteRamp, scene } from "@/lib/scene";

type Pt = { x: number; y: number };
interface Resolved { pos: Pt; spec: NodeSpec | undefined; lit: number; r: number }

const COOL = [154, 161, 172] as const; // muted
const CORE = [255, 217, 160] as const; // core
const mix = (a: readonly number[], b: readonly number[], t: number) =>
  `${Math.round(lerp(a[0]!, b[0]!, t))},${Math.round(lerp(a[1]!, b[1]!, t))},${Math.round(lerp(a[2]!, b[2]!, t))}`;

const LIGHT_MAX_DRIFT = 80;
const PULL_RADIUS = 140;
const PULL_MAX = 6;

export class ConstellationEngine {
  private ctx: CanvasRenderingContext2D;
  private dpr = 1;
  private w = 0;
  private h = 0;
  private glow: HTMLCanvasElement;
  private font = "11px monospace";

  private zones: Record<string, { top: number; h: number } | null> = {};
  private stops: [number, number][] = [[0, 0]];
  private anchors = new Map<string, HTMLElement>();

  private s = 0;
  private sv = 0;
  private drift: Pt = { x: 0, y: 0 };
  private pointer: Pt & { on: boolean } = { x: -9999, y: -9999, on: false };
  private light: Pt = { x: 0, y: 0 };
  private cssLight: Pt = { x: -999, y: -999 };
  private pulseStart = 0;
  private first = true;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("2d context unavailable");
    this.ctx = ctx;
    this.glow = this.makeGlow();
    const fam = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim();
    if (fam) this.font = `11px ${fam}`;
    this.resize();
  }

  private makeGlow() {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,217,160,0.95)");
    grad.addColorStop(0.18, "rgba(232,176,75,0.55)");
    grad.addColorStop(0.5, "rgba(201,101,43,0.16)");
    grad.addColorStop(1, "rgba(201,101,43,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return c;
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.measure();
  }

  /** Cache zone geometry and anchor elements. Cheap; call on resize / layout / font load. */
  measure() {
    const sy = window.scrollY;
    const z = (name: string) => {
      const el = document.querySelector<HTMLElement>(`[data-zone="${name}"]`);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top + sy, h: r.height };
    };
    const zones = {
      hero: z("hero"), chapters: z("chapters"), work: z("work"), journey: z("journey"),
      philosophy: z("philosophy"), contact: z("contact"),
    };
    this.zones = zones;
    const vh = this.h;
    const st: [number, number][] = [];
    const push = (y: number, s: number) => {
      const prev = st[st.length - 1];
      st.push([prev ? Math.max(prev[0], y) : y, s]);
    };
    push(0, 0);
    push(Math.min(vh * 0.8, zones.chapters?.top ?? vh * 0.8), 1);
    if (zones.chapters) {
      push(zones.chapters.top, 1);
      push(zones.chapters.top + zones.chapters.h - vh, 4);
    }
    if (zones.work) {
      push(zones.work.top, 5);
      push(zones.work.top + zones.work.h - vh, 5);
    }
    if (zones.journey) {
      push(zones.journey.top, 6);
      push(zones.journey.top + zones.journey.h - vh, 6);
    }
    if (zones.philosophy) push(zones.philosophy.top, 7);
    if (zones.contact) {
      push(zones.contact.top - vh * 0.9, 7);
      push(zones.contact.top - vh * 0.3, 8);
    }
    push(Number.MAX_SAFE_INTEGER, 8);
    this.stops = st;

    this.anchors.clear();
    document.querySelectorAll<HTMLElement>("[data-node-anchor]").forEach((el) => {
      this.anchors.set(el.dataset.nodeAnchor!, el);
    });
  }

  setPointer(x: number, y: number, on: boolean) {
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.on = on;
  }

  private target(scrollY: number) {
    const st = this.stops;
    for (let i = 1; i < st.length; i++) {
      const [y1, s1] = st[i]!;
      if (scrollY <= y1) {
        const [y0, s0] = st[i - 1]!;
        return y1 === y0 ? s1 : lerp(s0, s1, clamp((scrollY - y0) / (y1 - y0)));
      }
    }
    return 8;
  }

  private resolve(spec: NodeSpec | undefined, rootPos: Pt): Pt {
    if (!spec) return rootPos;
    if (spec.anchor) {
      const el = this.anchors.get(spec.anchor);
      if (el) {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
    }
    return { x: spec.x * this.w, y: spec.y * this.h };
  }


  /** For `fit` nodes: radius in px of the DOM anchor (the headline's period), so the node IS the period. */
  private fitRadius(spec: NodeSpec | undefined): number {
    if (!spec?.fit || !spec.anchor) return 0;
    const el = this.anchors.get(spec.anchor);
    return el ? el.offsetWidth / 2 : 0; // offsetWidth ignores the DOM dot's own scale transform
  }

  private stateNodes(state: StateSpec, jp: number): Record<NodeId, Resolved> {
    const rootSpec = state.nodes.root;
    const rootPos = this.resolve(rootSpec, { x: this.w * 0.5, y: this.h * 0.5 });
    const out = {} as Record<NodeId, Resolved>;
    for (const id of NODE_IDS) {
      const spec = state.nodes[id];
      const fit = this.fitRadius(spec);
      out[id] = {
        spec,
        pos: id === "root" ? rootPos : this.resolve(spec, rootPos),
        lit: spec?.lit ?? 0.6,
        r: fit ? fit / 3 : (spec?.r ?? 1), // 3px is the base node radius
      };
    }
    if (state.dynamicLit === "nearest") {
      let best: NodeId | null = null;
      let bestD = Infinity;
      for (const id of NODE_IDS) {
        const r = out[id];
        if (!r.spec || id === "root") continue;
        const d = Math.abs(r.pos.y - this.h * 0.5);
        if (d < bestD) { bestD = d; best = id; }
      }
      for (const id of NODE_IDS) {
        if (!out[id].spec || id === "root") continue;
        out[id].lit = id === best ? 1 : 0.28;
      }
    } else if (state.dynamicLit === "journey") {
      const n = JOURNEY_NODES.length;
      const active = Math.round(jp * (n - 1));
      JOURNEY_NODES.forEach((id, i) => {
        out[id].lit = i === active ? 1 : i < active ? 0.55 : 0.22;
      });
    }
    return out;
  }

  tick(dt: number, now: number) {
    const sy = window.scrollY;
    const N = STATE_ORDER.length;

    // 1. scroll -> scalar, spring-smoothed (stiffness 120, damping 30)
    const target = this.target(sy);
    if (this.first) { this.s = target; this.first = false; }
    this.sv += (120 * (target - this.s) - 30 * this.sv) * dt;
    this.s = clamp(this.s + this.sv * dt, 0, N - 1);
    const i = Math.min(Math.floor(this.s), N - 2);
    const f = this.s - i;
    const e = easeInOutCubic(f);
    const A = STATES[STATE_ORDER[i]!];
    const B = STATES[STATE_ORDER[i + 1]!];

    const jz = this.zones.journey;
    const jp = jz ? clamp((sy - jz.top) / Math.max(1, jz.h - this.h)) : 0;
    scene.journeyProgress = jp;

    // 2. resolve both states (all DOM reads happen here, before any writes)
    const ra = this.stateNodes(A, jp);
    const rb = this.stateNodes(B, jp);

    const ramp = igniteRamp(now);
    const flash = igniteFlash(now);
    const heroW = 1 - clamp(this.s);
    const dimK = lerp(A.dim ?? 1, B.dim ?? 1, e);

    // 3. blend nodes
    const pos = {} as Record<NodeId, { x: number; y: number; a: number; lit: number; r: number; prox: number }>;
    for (const id of NODE_IDS) {
      const a = ra[id];
      const b = rb[id];
      const alphaA = a.spec ? (a.spec.a ?? 1) : 0;
      const alphaB = b.spec ? (b.spec.a ?? 1) : 0;
      const litA = a.spec ? a.lit : 0;
      const litB = b.spec ? b.lit : 0;
      let alpha = lerp(alphaA, alphaB, e) * dimK;
      if (id === "root") alpha *= lerp(1, ramp, heroW);
      let lit = lerp(litA, litB, e);
      if (scene.hoverNode === id && alpha > 0.5) lit = Math.max(lit, 1);
      let r = lerp(a.spec ? a.r : 1, b.spec ? b.r : 1, e);
      if (id === "root") r *= lerp(1, 0.3 + 0.7 * ramp, heroW); // the period scales in with the ignition
      let x = lerp(a.pos.x, b.pos.x, e);
      let y = lerp(a.pos.y, b.pos.y, e);
      // pointer magnetism: pull up to 6px within 140px
      let prox = 0;
      if (this.pointer.on && alpha > 0.1) {
        const dx = this.pointer.x - x;
        const dy = this.pointer.y - y;
        const d = Math.hypot(dx, dy);
        if (d < PULL_RADIUS) {
          prox = 1 - d / PULL_RADIUS;
          const wgt = id === "root" ? 1 - heroW : 1; // root sits exactly on the period in the hero
          if (d > 0.5) {
            x += (dx / d) * PULL_MAX * prox * wgt;
            y += (dy / d) * PULL_MAX * prox * wgt;
          }
        }
      }
      pos[id] = { x, y, a: alpha, lit, r, prox };
    }

    // 4. the light: brightest node + hero pointer drift (inertia, max 80px)
    let bright: NodeId = "root";
    let bv = -1;
    for (const id of NODE_IDS) {
      const v = pos[id].a * pos[id].lit;
      if (v > bv) { bv = v; bright = id; }
    }
    const dTarget: Pt = { x: 0, y: 0 };
    if (this.pointer.on && heroW > 0.01) {
      const dx = this.pointer.x - pos.root.x;
      const dy = this.pointer.y - pos.root.y;
      const d = Math.hypot(dx, dy) || 1;
      const m = Math.min(LIGHT_MAX_DRIFT, d * 0.25);
      dTarget.x = (dx / d) * m;
      dTarget.y = (dy / d) * m;
    }
    const k = 1 - Math.exp(-dt * 2.6);
    this.drift.x += (dTarget.x - this.drift.x) * k;
    this.drift.y += (dTarget.y - this.drift.y) * k;
    const lt: Pt = {
      x: pos[bright].x + this.drift.x * heroW,
      y: pos[bright].y + this.drift.y * heroW,
    };
    const kl = 1 - Math.exp(-dt * 9);
    this.light.x += (lt.x - this.light.x) * kl;
    this.light.y += (lt.y - this.light.y) * kl;
    scene.lightX = this.light.x;
    scene.lightY = this.light.y;
    scene.lightStrength = clamp(Math.max(pos[bright].a, 0)) * clamp(ramp + (1 - heroW));

    const root = document.documentElement;
    if (Math.abs(this.light.x - this.cssLight.x) > 2 || Math.abs(this.light.y - this.cssLight.y) > 2) {
      this.cssLight = { x: this.light.x, y: this.light.y };
      root.style.setProperty("--light-x", `${this.light.x.toFixed(0)}px`);
      root.style.setProperty("--light-y", `${this.light.y.toFixed(0)}px`);
    }
    updateLitSurfaces(this.light.x, this.light.y, scene.lightStrength, this.h);

    // 5. contact pulse: one slow swell on arrival
    let bump = 0;
    if (this.s > 7.92) {
      if (!this.pulseStart) this.pulseStart = now;
      const p = clamp((now - this.pulseStart) / 2600);
      bump = Math.sin(p * Math.PI);
    } else if (this.s < 7.4) {
      this.pulseStart = 0;
    }

    // 6. draw
    const c = this.ctx;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.clearRect(0, 0, this.w, this.h);

    // edges
    const keyOf = (ed: EdgeSpec) => `${ed.a}>${ed.b}`;
    const edges = new Map<string, { a: EdgeSpec | null; b: EdgeSpec | null }>();
    A.edges.forEach((ed) => edges.set(keyOf(ed), { a: ed, b: null }));
    B.edges.forEach((ed) => {
      const cur = edges.get(keyOf(ed));
      if (cur) cur.b = ed;
      else edges.set(keyOf(ed), { a: null, b: ed });
    });
    const chain = Math.max(1, JOURNEY_NODES.length - 1);
    const frac = (ed: EdgeSpec | null) =>
      ed && ed.draw !== undefined ? clamp(jp * chain - ed.draw) : 1;
    c.lineWidth = 1;
    edges.forEach(({ a, b }) => {
      const ref = a ?? b!;
      const kA = a ? (a.k ?? 1) : 0;
      const kB = b ? (b.k ?? 1) : 0;
      const strength = lerp(kA, kB, e);
      const fr = lerp(a ? frac(a) : 1, b ? frac(b) : 1, e);
      const free = !!(a?.free || b?.free);
      const na = pos[ref.a];
      const nb = pos[ref.b];
      const al = strength * (free ? 1 : Math.min(na.a, nb.a)) * dimK * fr;
      if (al < 0.01) return;
      const x2 = lerp(na.x, nb.x, fr);
      const y2 = lerp(na.y, nb.y, fr);
      const g = c.createLinearGradient(na.x, na.y, x2, y2);
      const base = 0.2 + 0.2 * ((na.lit + nb.lit) / 2);
      g.addColorStop(0, `rgba(${mix(COOL, CORE, na.lit * 0.85)},${(base * al).toFixed(3)})`);
      g.addColorStop(1, free ? "rgba(255,255,255,0)" : `rgba(${mix(COOL, CORE, nb.lit * 0.85)},${(base * al).toFixed(3)})`);
      c.strokeStyle = g;
      c.beginPath();
      c.moveTo(na.x, na.y);
      c.lineTo(x2, y2);
      c.stroke();
    });

    // nodes
    const labelAll = lerp(A.labelAll ? 1 : 0, B.labelAll ? 1 : 0, e);
    c.font = this.font;
    c.textBaseline = "middle";
    for (const id of NODE_IDS) {
      const n = pos[id];
      if (n.a < 0.01) continue;
      const isRoot = id === "root";
      const fl = isRoot ? flash * heroW : 0; // ignition overexposure, root only
      const rr = 3 * n.r * (1 + 0.12 * bump * (isRoot ? 1 : 0) + 0.6 * fl);
      const bloomR = 34 * n.r * (1 + 0.5 * bump * (isRoot ? 1 : 0) + 1.6 * fl) * (0.55 + 0.45 * n.lit);
      const ga = Math.min(1, n.a * n.lit * 0.95 * (1 + 0.5 * fl));
      if (ga > 0.02) {
        c.globalAlpha = clamp(ga);
        c.drawImage(this.glow, n.x - bloomR, n.y - bloomR, bloomR * 2, bloomR * 2);
      }
      c.globalAlpha = clamp(n.a);
      c.fillStyle = `rgb(${mix(COOL, CORE, n.lit)})`;
      c.beginPath();
      c.arc(n.x, n.y, rr, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;

      const label = NODE_LABELS[id];
      if (label) {
        const vis = clamp(Math.max(n.prox * 1.4, labelAll * 0.85)) * n.a;
        if (vis > 0.03) {
          const left = n.x > this.w - 180;
          c.textAlign = left ? "right" : "left";
          c.fillStyle = `rgba(236,237,239,${(0.82 * vis).toFixed(3)})`;
          c.fillText(label, n.x + (left ? -1 : 1) * (rr + 9), n.y + 0.5);
        }
      }
    }
  }
}
