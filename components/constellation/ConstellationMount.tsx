"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTier } from "@/lib/tier";

const Layer = dynamic(() => import("./ConstellationLayer"), { ssr: false });

/** Lazy-loads the persistent layer after first paint, desktop + fine pointer + motion allowed only. */
export default function ConstellationMount() {
  const tier = useTier();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (tier !== "full") return;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const id = ric(() => setReady(true));
    return () => {
      setReady(false);
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
    };
  }, [tier]);
  return tier === "full" && ready ? <Layer /> : null;
}
