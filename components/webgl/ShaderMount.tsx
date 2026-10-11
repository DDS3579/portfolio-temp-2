"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTier } from "@/lib/tier";
import { useReducedMotionPref } from "@/lib/tier";

const Shader = dynamic(() => import("./HeroShader"), { ssr: false });

/** Shader initialises after first paint (idle). Off below 1024px and on coarse pointers.
 *  Reduced motion on desktop still gets one static rendered frame. */
export default function ShaderMount() {
  const tier = useTier();
  const reduced = useReducedMotionPref();
  const [ready, setReady] = useState(false);
  const wideFine =
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
  const allowed = tier === "full" || (reduced && wideFine);

  useEffect(() => {
    if (!allowed) return;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 250));
    const id = ric(() => setReady(true));
    return () => {
      setReady(false);
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
    };
  }, [allowed]);

  return allowed && ready ? <Shader /> : null;
}
