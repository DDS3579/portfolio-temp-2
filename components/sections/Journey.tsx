"use client";
import { useMotionValueEvent, useScroll, useTransform } from "motion/react";
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

/** One digit that rolls like an odometer wheel. The strip is 10em tall; the window shows 1em. */
function Digit({ d }: { d: number }) {
  return (
    <span className="inline-block h-[1em] overflow-hidden px-[0.03em] align-top">
      <span
        className="block transition-transform duration-700 ease-[var(--ease)]"
        style={{ transform: `translateY(${-d * 10}%)` }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="block h-[1em] leading-none">{n}</span>
        ))}
      </span>
    </span>
  );
}

/** Without dates the counter is the entry number, rolling. With dates, each range crossfades in place. */
function Counter({ active }: { active: number }) {
  const useDates = entries.some((e) => has(e.dates));
  if (!useDates) {
    return (
      <span
        aria-hidden
                className="outline-numeral flex text-[clamp(5rem,14vw,13rem)] [--stroke:rgb(255_255_255/0.4)]"
      >
        {pad(active + 1).split("").map((ch, k) => (
          <Digit key={k} d={Number(ch)} />
        ))}
      </span>
    );
  }
  return (
    <div className="relative h-[clamp(5rem,12vw,11rem)]" aria-hidden>
      {entries.map((e, i) => (
        <span
          key={i}
          className={cn(
            "font-display absolute inset-x-0 top-0 text-[clamp(3.5rem,8vw,8.5rem)] tabular-nums transition-opacity duration-500 ease-[var(--ease)]",
            i === active ? "opacity-100" : "opacity-0",
          )}
        >
          {has(e.dates) ? e.dates : pad(i + 1)}
        </span>
      ))}
    </div>
  );
}

function Pinned() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const { scrollYProgress: entry } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const sceneO = useTransform(entry, [0.4, 0.9], [0, 1]);
  const sceneY = useTransform(entry, [0.4, 0.9], [24, 0]);
  const [active, setActive] = useState(0);
  // every entry owns an equal 1/total slice of the scroll (the constellation uses the same slicing)
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setActive(Math.min(total - 1, Math.max(0, Math.floor(v * total)))),
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
        <m.div
          style={{ opacity: sceneO, y: sceneY }}
          className="mx-auto grid w-full max-w-[1440px] grid-cols-12 items-center gap-x-6 px-[var(--gutter)]"
        >
          <div className="col-span-4">
            <SectionMarker className="mb-4">{journeyCopy.marker}</SectionMarker>
            <h2 id="journey-title" className="sr-only">{journeyCopy.title}</h2>
            <Counter active={active} />
          </div>

          {/* rail: a faint track; the constellation's nodes dock on the anchors and its edges draw the progress */}
          <div className="relative col-span-2 h-[60dvh]" aria-hidden>
            <span className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
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
                {/* entries travel: past ones leave upward, upcoming ones arrive from below */}
                <div
                  className={cn(
                    "transition-transform duration-700 ease-[var(--ease)]",
                    i === active ? "translate-y-0" : i < active ? "-translate-y-5" : "translate-y-5",
                  )}
                >
                  <EntryBody e={e} i={i} />
                </div>
              </li>
            ))}
          </ol>
        </m.div>
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
