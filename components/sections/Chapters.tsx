"use client";
import {
  easeInOut,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import * as m from "motion/react-m";
import { useRef, useState } from "react";
import ConstellationStatic from "@/components/constellation/ConstellationStatic";
import Rail from "@/components/Rail";
import Reveal from "@/components/motion/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { chapterRail, chapters, type Chapter } from "@/content/chapters";
import { has } from "@/content/fill";
import { useTier } from "@/lib/tier";

/** Heading words rise out of their own masks, scrubbed by `enter` (0..1), staggered left to right. */
function Word({ w, k, n, enter }: { w: string; k: number; n: number; enter: MotionValue<number> }) {
  const start = 0.05 + (k / n) * 0.5;
  const y = useTransform(enter, [start, start + 0.4], ["108%", "0%"]);
  return (
    <span className="inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em]">
      <m.span style={{ y }} className="inline-block">
        {w}
      </m.span>
    </span>
  );
}

/**
 * `idx` is the plateaued panel position 0..3 (each panel holds, then the track moves).
 * `entry` (panel 1 only) drives the reveal while the section scrolls in, before it pins.
 */
function Panel({
  c,
  i,
  idx,
  entry,
}: {
  c: Chapter;
  i: number;
  idx: MotionValue<number>;
  entry: MotionValue<number>;
}) {
  const q = useTransform(idx, (v) => v - i); // -1 = one panel ahead, 0 = here, +1 = one panel behind
  const own = useTransform(idx, [i - 0.8, i - 0.1], [0, 1]);
  const enter = i === 0 ? entry : own;

  // slow parallax layer for the outlined numeral (max +/-12% of its own width)
  const numeralX = useTransform(q, [-1, 1], ["12%", "-12%"]);
  const numeralO = useTransform(q, [-1, -0.5, 0, 0.5, 1], [0, 0.55, 1, 0.55, 0]);
  // copy leaves before it can slide across the constellation on the left
  const leave = useTransform(q, [0.02, 0.24], [1, 0]);
  const fade = useTransform(enter, [0.55, 0.95], [0, 1]);
  const lift = useTransform(enter, [0.55, 0.95], [16, 0]);

  const words = c.heading.split(" ");
  return (
    <div className="relative flex h-full w-full shrink-0 items-center overflow-hidden">
      <m.span
        aria-hidden
        className="outline-numeral pointer-events-none absolute right-[4vw] bottom-[4vh] select-none text-[clamp(12rem,24vw,24rem)]"
        style={{ x: numeralX, opacity: numeralO }}
      >
        {c.numeral}
      </m.span>
      <div className="relative z-20 mx-auto grid w-full max-w-[1440px] grid-cols-12 px-[var(--gutter)]">
        <m.div style={{ opacity: leave }} className="col-span-12 lg:col-span-6 lg:col-start-6">
          <m.div style={{ opacity: fade, y: lift }}>
            <SectionMarker className="mb-6">{c.region}</SectionMarker>
          </m.div>
          <h3 className="font-display t-section max-w-[14ch] lg:max-w-[16ch]">
            {words.map((w, k) => (
              <span key={k}>
                <Word w={w} k={k} n={words.length} enter={enter} />
                {k < words.length - 1 && " "}
              </span>
            ))}
          </h3>
          {has(c.body) && (
            <m.p style={{ opacity: fade, y: lift }} className="t-body mt-8 max-w-[44ch] text-muted">
              {c.body}
            </m.p>
          )}
        </m.div>
      </div>
    </div>
  );
}

function Pinned() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const { scrollYProgress: entry } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // Plateaus: each panel holds for reading, then the track eases to the next. Track 0..-75% is unchanged.
  const idx = useTransform(p, [0, 0.05, 0.283, 0.383, 0.617, 0.717, 0.95, 1], [0, 0, 1, 1, 2, 2, 3, 3], {
    ease: easeInOut,
  });
  const x = useTransform(idx, (v) => `${-25 * v}%`);
  const rail = useTransform(idx, (v) => v / 3);
  const [active, setActive] = useState(0);
  useMotionValueEvent(idx, "change", (v) => setActive(Math.min(3, Math.max(0, Math.round(v)))));

  return (
    <section
      ref={ref}
      id="chapters"
      data-zone="chapters"
      aria-labelledby="chapters-title"
      style={{ height: "400dvh" }}
      className="relative"
    >
      <h2 id="chapters-title" className="sr-only">Chapters</h2>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <m.div style={{ x }} className="flex h-full w-[400vw]">
          {chapters.map((c, i) => (
            <div key={c.id} className="h-full w-screen shrink-0">
              <Panel c={c} i={i} idx={idx} entry={entry} />
            </div>
          ))}
        </m.div>
        <div className="absolute inset-x-0 bottom-16 z-30 mx-auto w-full max-w-[1440px] px-[var(--gutter)]">
          <Rail labels={chapterRail} progress={rail} active={active} />
        </div>
      </div>
    </section>
  );
}

function Stacked() {
  return (
    <section id="chapters" data-zone="chapters" aria-labelledby="chapters-title" className="relative">
      <h2 id="chapters-title" className="sr-only">Chapters</h2>
      {chapters.map((c) => (
        <div key={c.id} className="relative flex min-h-[60svh] items-center overflow-hidden border-t border-border py-14">
          <span
            aria-hidden
            className="outline-numeral pointer-events-none absolute right-[5vw] bottom-4 text-[clamp(7rem,32vw,16rem)]"
          >
            {c.numeral}
          </span>
          <div className="relative z-20 mx-auto grid w-full max-w-[1440px] gap-10 px-[var(--gutter)] md:grid-cols-12">
            <Reveal className="md:col-span-5 md:col-start-1">
              <ConstellationStatic state={c.id} className="max-w-[170px] md:max-w-[300px]" />
            </Reveal>
            <Reveal className="md:col-span-7" delay={0.08}>
              <SectionMarker className="mb-5">{c.region}</SectionMarker>
              <h3 className="font-display t-section max-w-[16ch]">{c.heading}</h3>
              {has(c.body) && <p className="t-body mt-6 max-w-[44ch] text-muted">{c.body}</p>}
            </Reveal>
          </div>
        </div>
      ))}
    </section>
  );
}

export default function Chapters() {
  const tier = useTier();
  return tier === "full" ? <Pinned /> : <Stacked />;
}
