"use client";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { EASE } from "@/lib/ease";

/** In-view reveal: translateY 32px + opacity, 0.8s, viewport once, margin -10%. Reduced motion = opacity only. */
export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  y = 32,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "p" | "section" | "span";
  y?: number;
}) {
  const reduce = useReducedMotion();
  const M = m[as] as typeof m.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: reduce ? 0.4 : 0.8, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}
