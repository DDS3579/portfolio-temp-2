"use client";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/motion/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { capabilitiesCopy, disciplines } from "@/content/capabilities";
import { cn } from "@/lib/cn";

export default function Capabilities() {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLUListElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const intent = useRef(0);

  // The constellation collapses into ONE node that docks at the active discipline (state "capabilities").
  // The anchor glides between rows with a CSS transition; the layer reads its position every frame.
  useEffect(() => {
    const place = () => {
      const row = rows.current[active];
      if (row && marker.current) marker.current.style.transform = `translateY(${row.offsetTop + row.offsetHeight / 2}px)`;
    };
    place();
    const ro = new ResizeObserver(place);
    if (list.current) ro.observe(list.current);
    return () => ro.disconnect();
  }, [active]);

  useEffect(() => () => window.clearTimeout(intent.current), []);

  // Hover picks with a short intent delay so sweeping the mouse across rows doesn't flicker the panel.
  const hover = (i: number) => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    window.clearTimeout(intent.current);
    intent.current = window.setTimeout(() => setActive(i), 90);
  };

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
      <Reveal delay={0.1}>
        <ul ref={list} className="relative mt-16 lg:mt-24 lg:grid lg:grid-cols-12 lg:grid-rows-3 lg:gap-x-10">
          <span
            ref={marker}
            aria-hidden
            data-node-anchor="cap-marker"
            className="pointer-events-none absolute top-0 left-[calc(var(--gutter)*-0.5)] size-px transition-transform duration-700 ease-[var(--ease)]"
          />
          {disciplines.map((d, i) => {
            const on = active === i;
            return (
              <li key={d.id} className="border-t border-border last:border-b lg:contents">
                <div
                  ref={(el) => { rows.current[i] = el; }}
                  className="lg:col-span-7 lg:border-t lg:border-border lg:last:border-b"
                  style={{ gridRow: i + 1 }}
                >
                  <button
                    ref={(el) => { buttons.current[i] = el; }}
                    type="button"
                    aria-expanded={on}
                    aria-controls={`cap-${d.id}`}
                    onClick={() => { window.clearTimeout(intent.current); setActive(i); }}
                    onMouseEnter={() => hover(i)}
                    onFocus={() => setActive(i)}
                    onKeyDown={(e) => {
                      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                      e.preventDefault();
                      const n = disciplines.length;
                      buttons.current[(i + (e.key === "ArrowDown" ? 1 : n - 1)) % n]?.focus();
                    }}
                    className={cn(
                      "font-display flex min-h-20 w-full items-center py-6 text-left text-[clamp(2rem,1rem+3.6vw,4.25rem)] transition-[opacity,transform] duration-500 ease-[var(--ease)] lg:min-h-0 lg:py-8",
                      on ? "opacity-100 lg:translate-x-3" : "opacity-40 hover:opacity-80",
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
                  inert={!on}
                  className={cn(
                    "hidden pt-8 transition-[opacity,transform] duration-500 ease-[var(--ease)] lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:block",
                    on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
                  )}
                >
                  <Details d={d} />
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
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