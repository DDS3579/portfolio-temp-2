import { clamp, easeOutCubic } from "./ease";
import type { NodeId } from "@/content/constellation";

// Shared, mutable, non-reactive scene state. Read by the constellation, the hero shader and lit surfaces.
export const scene = {
  /** Light position in viewport px (already includes the hero pointer drift). */
  lightX: 0,
  lightY: 0,
  /** 0..1, how strongly the light is on the page right now. */
  lightStrength: 0,
  /** performance.now() timestamp at which the period ignites. 0 = not yet. */
  igniteAt: 0,
  /** true while the persistent constellation layer is mounted and drawing. */
  live: false,
  /** Node a venture row / card asked to light on hover. */
  hoverNode: null as NodeId | null,
  /** Journey scrub progress 0..1, written by the engine. */
  journeyProgress: 0,
};

export function ignite(at = performance.now()) {
  scene.igniteAt = at;
}

/** 0..1 ramp of the ignition, ~1s ease-out. */
export function igniteRamp(now = performance.now()) {
  if (!scene.igniteAt) return 0;
  return easeOutCubic(clamp((now - scene.igniteAt) / 1100));
}
/** 0..1..0 bell over the first 1.1s after ignition: the overexposed instant the light comes on. */
export function igniteFlash(now = performance.now()) {
  if (!scene.igniteAt) return 0;
  const t = clamp((now - scene.igniteAt) / 1100);
  return Math.pow(Math.sin(Math.pow(t, 0.6) * Math.PI), 2);
}
