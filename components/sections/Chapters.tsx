"use client";
import { useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { useRef, useState } from "react";
import ConstellationStatic from "@/components/constellation/ConstellationStatic";
import Rail from "@/components/Rail";
import Reveal from "@/components/motion/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { chapterRail, chapters, type Chapter } from "@/content/chapters";
import { has } from "@/content/fill";
import { useTier } from "@/lib/tier";

function Panel({ c, i, progress }: { c: Chapter; i: number; progress?: MotionValue<number> }) {
  // slow parallax layer for the outlined numeral (max +/-12% of its own width)
  const fallback = useTransform(useSpring(0), (v) => v);
  const p = progress ?? fallback;
  const x = useTransform(p, [(i - 1) / 3, (i + 1) / 3], ["12%", "-12%"]);
  return (
    <div className="relative flex h-full w-full shrink-0 items-center overflow-hidden">
      <m.span
        aria-hidden
        className="outline-numeral pointer-events-none absolute right-[4vw] bottom-[4vh] select-none text-[clamp(12rem,24vw,24rem)]"
        style={progress ? { x } : undefined}
      >
        {c.numeral}
      </m.span>
      <div className="relative z-20 mx-auto grid w-full max-w-[1440px] grid-cols-12 px-[var(--gutter)]">
        <div className="col-span-12 lg:col-span-6 lg:col-start-6">
          <SectionMarker className="mb-6">{c.region}</SectionMarker>
          <h3 className="font-display t-section max-w-[14ch] lg:max-w-[16ch]">{c.heading}</h3>
          {has(c.body) && <p className="t-body mt-8 max-w-[44ch] text-muted">{c.body}</p>}
        </div>
      </div>
    </div>
  );
}

function Pinned() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const x = useTransform(p, [0, 1], ["0%", "-75%"]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(3, Math.round(v * 3))));

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
              <Panel c={c} i={i} progress={p} />
            </div>
          ))}
        </m.div>
        <div className="absolute inset-x-0 bottom-8 z-30 mx-auto w-full max-w-[1440px] px-[var(--gutter)]">
          <Rail labels={chapterRail} progress={p} active={active} />
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
        <div key={c.id} className="relative flex min-h-[80svh] items-center overflow-hidden border-t border-border py-16">
          <span
            aria-hidden
            className="outline-numeral pointer-events-none absolute right-[-2vw] bottom-0 text-[clamp(10rem,42vw,20rem)]"
          >
            {c.numeral}
          </span>
          <div className="relative z-20 mx-auto grid w-full max-w-[1440px] gap-10 px-[var(--gutter)] md:grid-cols-12">
            <Reveal className="md:col-span-5 md:col-start-1">
              <ConstellationStatic state={c.id} className="max-w-[240px] md:max-w-[300px]" />
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
