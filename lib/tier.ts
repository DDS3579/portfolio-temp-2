"use client";
import { useSyncExternalStore } from "react";

const Q = {
  wide: "(min-width: 1024px)",
  fine: "(pointer: fine) and (hover: hover)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

function subscribe(cb: () => void) {
  const mqs = Object.values(Q).map((q) => window.matchMedia(q));
  mqs.forEach((m) => m.addEventListener("change", cb));
  return () => mqs.forEach((m) => m.removeEventListener("change", cb));
}

export type Tier = "full" | "lite";

export function getTier(): Tier {
  if (typeof window === "undefined") return "lite";
  const m = (q: string) => window.matchMedia(q).matches;
  return m(Q.wide) && m(Q.fine) && !m(Q.reduced) ? "full" : "lite";
}

/** "full" = desktop, fine pointer, motion allowed: Lenis, pinned sections, live constellation, shader. */
export function useTier(): Tier {
  return useSyncExternalStore(subscribe, getTier, () => "lite");
}

export function useReducedMotionPref(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(Q.reduced).matches,
    () => false,
  );
}
