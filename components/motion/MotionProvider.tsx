"use client";
import type Lenis from "lenis";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { useEffect } from "react";
import { subscribe } from "@/lib/loop";
import { setLenis } from "@/lib/scroll";
import { useTier } from "@/lib/tier";

/** MotionConfig (reducedMotion="user") + Lenis on desktop with a fine pointer only. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const tier = useTier();

  useEffect(() => {
    if (tier !== "full") return;
    let cancelled = false;
    let lenis: Lenis | null = null;
    let off = () => {};
    // Lenis is a lazy chunk: it never counts against route JS.
    import("lenis").then(({ default: L }) => {
      if (cancelled) return;
      lenis = new L({ autoRaf: false, lerp: 0.09, smoothWheel: true });
      setLenis(lenis);
      document.documentElement.classList.add("lenis", "lenis-smooth");
      const l = lenis;
      off = subscribe((_dt, t) => l.raf(t), -10); // first in the shared loop
    });
    return () => {
      cancelled = true;
      off();
      lenis?.destroy();
      setLenis(null);
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, [tier]);

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
