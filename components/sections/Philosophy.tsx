"use client";
import { useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import Reveal from "@/components/motion/Reveal";
import { philosophy } from "@/content/philosophy";
import { useTier } from "@/lib/tier";

function Word({ w, i, n, p, animate }: { w: string; i: number; n: number; p: MotionValue<number>; animate: boolean }) {
  const start = (i / n) * 0.8;
  const opacity = useTransform(p, [start, start + 0.2], [0.15, 1]);
  return (
    <m.span style={animate ? { opacity } : undefined} className="mr-[0.25em] inline-block">
      {w}
    </m.span>
  );
}

export default function Philosophy() {
  const ref = useRef<HTMLParagraphElement>(null);
  const tier = useTier();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const words = philosophy.statement.split(" ");

  return (
    <section
      id="philosophy"
      data-zone="philosophy"
      aria-labelledby="philosophy-title"
      className="relative mx-auto max-w-[1440px] px-[var(--gutter)] py-32 lg:py-48"
    >
      <h2 id="philosophy-title" className="sr-only">Philosophy</h2>
      <p ref={ref} className="font-display t-section max-w-[20ch] lg:max-w-[22ch]" aria-label={philosophy.statement}>
        {words.map((w, i) => (
          <Word key={i} w={w} i={i} n={words.length} p={p} animate={tier === "full"} />
        ))}
      </p>

      <ul className="mt-24 border-t border-border lg:mt-36">
        {philosophy.principles.map((pr, i) => (
          <Reveal as="li" key={pr.n} delay={i * 0.08} className="grid gap-3 border-b border-border py-8 md:grid-cols-12 md:items-baseline md:gap-8">
            <span className="mono text-muted md:col-span-1">{pr.n}</span>
            <h3 className="font-display text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] md:col-span-6">{pr.title}</h3>
            <p className="text-muted md:col-span-5">{pr.line}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
