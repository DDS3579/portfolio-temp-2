"use client";
import { useInView, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRef, useState } from "react";
import { useLitSurface } from "@/components/constellation/useLitSurface";
import Reveal from "@/components/motion/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { has } from "@/content/fill";
import { entries, journeyCopy, type Entry } from "@/content/journey";
import { cn } from "@/lib/cn";
import { useTier } from "@/lib/tier";

const pad = (n: number) => String(n).padStart(2, "0");
const total = entries.length;

/** "log 04/09 · 2024 to present" */
const meta = (e: Entry, i: number) =>
  [`log ${pad(i + 1)}/${pad(total)}`, has(e.dates) && e.dates, has(e.duration) && e.duration]
    .filter(Boolean)
    .join(" · ");

function Figures({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
      {items.map((f) => (
        <div key={f.label} className="flex flex-col-reverse gap-1.5">
          <dt className="text-sm leading-snug text-muted">{f.label}</dt>
          <dd className="font-display text-[clamp(1.9rem,1.3rem+1.6vw,2.75rem)] leading-none tabular-nums">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Everything an entry says. Shared by the pinned log card and the phone timeline. */
function EntryContent({ e }: { e: Entry }) {
  return (
    <>
      <p className="mono text-muted">{e.kind}</p>
      <h3 className="font-display mt-3 text-[clamp(1.75rem,1rem+2.2vw,3rem)]">{e.role}</h3>
      {has(e.org) && <p className="mt-2 text-lg text-muted">{e.org}</p>}
      {has(e.description) && <p className="t-body mt-4 max-w-[46ch]">{e.description}</p>}
      {e.figures?.length ? <Figures items={e.figures} /> : null}
      {e.stack?.length ? <p className="mono mt-5 text-muted">{e.stack.join(" / ")}</p> : null}
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

function Pinned() {
  const ref = useRef<HTMLElement>(null);
  const lit = useLitSurface<HTMLDivElement>();
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
      style={{ height: `${total * 58}vh` }}
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
            <span
              aria-hidden
              className="outline-numeral flex text-[clamp(5rem,14vw,13rem)] [--stroke:rgb(255_255_255/0.4)]"
            >
              {pad(active + 1).split("").map((ch, k) => (
                <Digit key={k} d={Number(ch)} />
              ))}
            </span>
            <p className="mono mt-3 text-muted" aria-hidden>of {pad(total)} entries</p>
          </div>

          {/* rail: a route with named stops. The constellation docks nodes on the anchors and draws the progress. */}
          <div className="relative col-span-2 h-[60dvh]" aria-hidden>
            <span className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
            {entries.map((e, i) => (
              <span key={i}>
                <span
                  data-node-anchor={`journey-${i}`}
                  className="absolute left-1/2 size-px"
                  style={{ top: `${(i / (total - 1)) * 100}%` }}
                />
                <span
                  className={cn(
                    "mono absolute right-[calc(50%+16px)] -translate-y-1/2 text-right text-[11px] whitespace-nowrap transition-colors duration-500",
                    i === active ? "text-text" : i < active ? "text-muted" : "text-muted/45",
                  )}
                  style={{ top: `${(i / (total - 1)) * 100}%` }}
                >
                  {e.short}
                </span>
              </span>
            ))}
          </div>

          {/* the build log: one card, entries swap inside it */}
          <div className="col-span-6">
            <div ref={lit} className="lit-surface overflow-hidden rounded-xl border border-border bg-surface/80">
              <div className="mono flex items-center justify-between gap-4 border-b border-border px-5 py-3.5 text-muted">
                <span className="flex items-center gap-1.5" aria-hidden>
                  <span className="size-2 rounded-full bg-white/15" />
                  <span className="size-2 rounded-full bg-white/15" />
                  <span className="size-2 rounded-full bg-white/15" />
                  <span className="ml-3">build-log</span>
                </span>
                <span>{meta(entries[active]!, active)}</span>
              </div>

              {/* all entries share one grid cell, so the card is always as tall as the tallest entry */}
              <ol className="grid">
                {entries.map((e, i) => (
                  <li
                    key={i}
                    aria-current={i === active ? "step" : undefined}
                    className={cn(
                      "col-start-1 row-start-1 px-6 py-7 transition-opacity duration-500 ease-[var(--ease)] md:px-8",
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
                      <EntryContent e={e} />
                    </div>
                  </li>
                ))}
              </ol>

              <div className="flex items-center gap-1.5 border-t border-border px-5 py-3.5" aria-hidden>
                {entries.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors duration-500",
                      i === active ? "bg-key" : i < active ? "bg-white/30" : "bg-white/10",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}

function TimelineItem({ e, i }: { e: Entry; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { margin: "-35% 0px -35% 0px" });
  return (
    <Reveal as="li" className="relative">
      <span
        aria-hidden
        className={cn(
          "absolute top-7 -left-[1.8rem] size-[9px] rounded-full transition-[background-color,box-shadow] duration-500 sm:-left-[2.3rem]",
          on ? "bg-key shadow-[0_0_14px_3px_rgb(232_176_75/0.55)]" : "bg-muted",
        )}
      />
      <div
        ref={ref}
        className={cn(
          "rounded-xl border bg-raised/50 p-5 transition-colors duration-500 sm:p-6",
          on ? "border-key/35" : "border-border",
        )}
      >
        <p className="mono mb-4 text-muted">{meta(e, i)}</p>
        <EntryContent e={e} />
      </div>
    </Reveal>
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
      <ol className="relative mt-12 ml-1 max-w-[44rem] space-y-5 border-l border-white/10 pl-6 sm:pl-8">
        {entries.map((e, i) => (
          <TimelineItem key={i} e={e} i={i} />
        ))}
      </ol>
    </section>
  );
}

export default function Journey() {
  return useTier() === "full" ? <Pinned /> : <Timeline />;
}