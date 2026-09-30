"use client";
import { useScroll, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";

/** Vertical parallax, clamped to +/-12% of the element's own height, spring-smoothed. */
export default function Parallax({
  children,
  amount = 12,
  className,
}: {
  children: React.ReactNode;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const a = Math.min(12, amount);
  const y = useTransform(p, [0, 1], [`${a}%`, `${-a}%`]);
  return (
    <div ref={ref} className={className}>
      <m.div style={{ y }} className="h-full w-full">
        {children}
      </m.div>
    </div>
  );
}
