import { clamp } from "./ease";

const MAX = 12;
const surfaces = new Map<HTMLElement, { lit: number; lx: number; ly: number }>();

export function registerLitSurface(el: HTMLElement) {
  if (surfaces.size >= MAX) return () => {};
  surfaces.set(el, { lit: -1, lx: 0, ly: 0 });
  return () => {
    surfaces.delete(el);
    el.style.removeProperty("--lit");
  };
}

/** Called from the shared loop. Reads all rects first, then writes. */
export function updateLitSurfaces(lightX: number, lightY: number, strength: number, vh: number) {
  if (!surfaces.size) return;
  const reads: [HTMLElement, DOMRect][] = [];
  surfaces.forEach((_, el) => reads.push([el, el.getBoundingClientRect()]));
  for (const [el, r] of reads) {
    const st = surfaces.get(el);
    if (!st) continue;
    let lit = 0;
    if (r.bottom > -200 && r.top < vh + 200) {
      const dx = Math.max(r.left - lightX, 0, lightX - r.right);
      const dy = Math.max(r.top - lightY, 0, lightY - r.bottom);
      const d = Math.hypot(dx, dy);
      lit = Math.pow(clamp(1 - d / 460), 1.6) * strength;
    }
    const lx = lightX - r.left;
    const ly = lightY - r.top;
    if (Math.abs(lit - st.lit) < 0.02 && Math.abs(lx - st.lx) < 2 && Math.abs(ly - st.ly) < 2) continue;
    st.lit = lit;
    st.lx = lx;
    st.ly = ly;
    el.style.setProperty("--lit", lit.toFixed(3));
    el.style.setProperty("--lx", `${lx.toFixed(0)}px`);
    el.style.setProperty("--ly", `${ly.toFixed(0)}px`);
  }
}
