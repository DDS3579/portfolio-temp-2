"use client";
import { useEffect, useRef } from "react";
import { subscribe } from "@/lib/loop";
import { scene } from "@/lib/scene";
import { ConstellationEngine } from "./engine";

/** The one persistent layer: fixed, full-viewport, pointer-events none, above the background, below content. */
export default function ConstellationLayer() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let engine: ConstellationEngine;
    try {
      engine = new ConstellationEngine(canvas);
    } catch {
      return; // 2D unavailable: sections keep their <ConstellationStatic>
    }
    const root = document.documentElement;
    root.dataset.constellation = "live";
    scene.live = true;

    const remeasure = () => engine.measure();
    const onResize = () => engine.resize();
    const onMove = (e: PointerEvent) => engine.setPointer(e.clientX, e.clientY, true);
    const onLeave = () => engine.setPointer(-9999, -9999, false);

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("load", remeasure);
    document.fonts?.ready.then(remeasure);
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);

    const off = subscribe((dt, t) => engine.tick(dt, t), 10);

    return () => {
      off();
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("load", remeasure);
      delete root.dataset.constellation;
      scene.live = false;
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 h-dvh w-full"
    />
  );
}
