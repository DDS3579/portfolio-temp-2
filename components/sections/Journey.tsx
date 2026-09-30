"use client";
import { useMotionValueEvent, useScroll, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useRef, useState } from "react";
import Reveal from "@/components/motion/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { has } from "@/content/fill";
import { entries, journeyCopy, type Entry } from "@/content/journey";
import { cn } from "@/lib/cn";
import { useTier } from "@/lib/tier";

const pad = (n: number) => String(n).padStart(2, "0");
const total = entries.length;

function EntryBody({ e, i }: { e: Entry; i: number }) {
  return (
    <>
      <p className="mono text-muted">
        log {pad(i + 1)}/{pad(total)}
        {has(e.duration) && <> · {e.duration}</>}
      </p>
      <h3 className="font-display mt-4 text-[clamp(1.9rem,1.1rem+2.6vw,3.5rem)]">{e.role}</h3>
      <p className="mt-3 text-lg text-muted">{e.org}</p>
      {has(e.description) && <p className="t-body mt-6 max-w-[46ch]">{e.description}</p>}
    </>
  );
}

const bigLabel = (e: Entry, i: number) => (has(e.dates) ? e.dates : pad(i + 1));

function Pinned() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setActive(Math.min(total - 1, Math.max(0, Math.round(v * (total - 1))))),
  );

  return (
    <section
      ref={ref}
      id="journey"
      data-zone="journey"
      aria-labelledby="journey-title"
      style={{ height: `${total * 60}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-[100dvh] items-center">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-12 items-center gap-x-6 px-[var(--gutter)]">
          <div className="col-span-4">
            <SectionMarker className="mb-4">{journeyCopy.marker}</SectionMarker>
            <h2 id="journey-title" className="sr-only">{journeyCopy.title}</h2>
            <div className="relative h-[clamp(5rem,12vw,11rem)]" aria-hidden>
              {entries.map((e, i) => (
                <span
                  key={i}
                  className={cn(
                    "font-display absolute inset-x-0 top-0 text-[clamp(3.5rem,8vw,8.5rem)] tabular-nums transition-opacity duration-500 ease-[var(--ease)]",
                    i === active ? "opacity-100" : "opacity-0",
                  )}
                >
                  {bigLabel(e, i)}
                </span>
              ))}
            </div>
          </div>

          {/* rail: the canvas nodes dock onto these anchors */}
          <div className="relative col-span-2 h-[60dvh]" aria-hidden>
            <span className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
            <m.span className="absolute inset-y-0 left-1/2 w-px origin-top bg-key/70" style={{ scaleY: p }} />
            {entries.map((_, i) => (
              <span
                key={i}
                data-node-anchor={`journey-${i}`}
                className="absolute left-1/2 size-px"
                style={{ top: `${(i / (total - 1)) * 100}%` }}
              />
            ))}
          </div>

          <ol className="relative col-span-6 h-[52dvh]">
            {entries.map((e, i) => (
              <li
                key={i}
                aria-current={i === active ? "step" : undefined}
                className={cn(
                  "absolute inset-x-0 top-1/2 -translate-y-1/2 transition-opacity duration-500 ease-[var(--ease)]",
                  i === active ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                <EntryBody e={e} i={i} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section
      id="journey"
      data-zone="journey"
      aria-labelledby="journey-title"
      className="mx-auto max-w-[1440px] px-[var(--gutter)] py-24 lg:py-32"
    >
      <Reveal>
        <SectionMarker className="mb-6">{journeyCopy.marker}</SectionMarker>
        <h2 id="journey-title" className="font-display t-section">{journeyCopy.title}</h2>
      </Reveal>
      <ol className="relative mt-14 ml-2 border-l border-white/10 pl-8">
        {entries.map((e, i) => (
          <Reveal as="li" key={i} className="relative pb-14 last:pb-0">
            <span aria-hidden className="absolute top-2 -left-[2.2rem] size-[7px] rounded-full bg-muted" />
            {has(e.dates) && <p className="mono mb-2 text-muted">{e.dates}</p>}
            <EntryBody e={e} i={i} />
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

export default function Journey() {
  return useTier() === "full" ? <Pinned /> : <Timeline />;
}
