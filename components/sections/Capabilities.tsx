"use client";
import { useState } from "react";
import Reveal from "@/components/motion/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { capabilitiesCopy, disciplines } from "@/content/capabilities";
import { cn } from "@/lib/cn";

export default function Capabilities() {
  const [active, setActive] = useState(0);
  return (
    <section
      id="capabilities"
      data-zone="capabilities"
      aria-labelledby="cap-title"
      className="relative mx-auto max-w-[1440px] px-[var(--gutter)] py-28 lg:py-40"
    >
      <Reveal>
        <SectionMarker className="mb-6">{capabilitiesCopy.marker}</SectionMarker>
        <h2 id="cap-title" className="font-display t-section">{capabilitiesCopy.title}</h2>
      </Reveal>

      {/* One DOM: accordion below lg; on lg the details share one grid area on the right (display: contents on li). */}
      <ul className="mt-16 lg:mt-24 lg:grid lg:grid-cols-12 lg:grid-rows-3 lg:gap-x-10">
        {disciplines.map((d, i) => {
          const on = active === i;
          return (
            <li key={d.id} className="border-t border-border last:border-b lg:contents">
              <div className="lg:col-span-7 lg:border-t lg:border-border lg:last:border-b" style={{ gridRow: i + 1 }}>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`cap-${d.id}`}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setActive(i)}
                  onFocus={() => setActive(i)}
                  className={cn(
                    "font-display flex min-h-20 w-full items-center py-6 text-left text-[clamp(2rem,1rem+3.6vw,4.25rem)] transition-opacity duration-300 lg:min-h-0 lg:py-8",
                    on ? "opacity-100" : "opacity-45 hover:opacity-80",
                  )}
                >
                  {d.name}
                </button>
                {/* mobile accordion body */}
                <div id={`cap-${d.id}-m`} hidden={!on} className="pb-8 lg:hidden">
                  <Details d={d} />
                </div>
              </div>
              {/* desktop details column: all stacked in one grid area, only the active one visible */}
              <div
                id={`cap-${d.id}`}
                aria-hidden={!on}
                className={cn(
                  "hidden pt-8 transition-opacity duration-500 ease-[var(--ease)] lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:block",
                  on ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                <Details d={d} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Details({ d }: { d: (typeof disciplines)[number] }) {
  return (
    <div>
      <p className="t-body max-w-[44ch]">{d.summary}</p>
      <p className="mono mt-8 text-muted">{d.stack.join(" / ")}</p>
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {d.topics.map((t) => (
          <li key={t} className="py-3.5 text-[0.98rem]">{t}</li>
        ))}
      </ul>
    </div>
  );
}
