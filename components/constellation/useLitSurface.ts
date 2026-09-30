"use client";
import { useCallback } from "react";
import { registerLitSurface } from "@/lib/lit";

/** Ref callback: the element gets a subtle warm radial highlight and brighter border near the light.
 *  Pair with the `lit-surface` class. Capped at 12 surfaces site-wide. */
export function useLitSurface<T extends HTMLElement = HTMLElement>() {
  return useCallback((el: T | null) => {
    if (!el) return;
    return registerLitSurface(el);
  }, []);
}
