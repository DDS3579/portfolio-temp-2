"use client";
import { useLitSurface } from "@/components/constellation/useLitSurface";
import Coordinates from "@/components/Coordinates";
import Reveal from "@/components/motion/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { about } from "@/content/about";
import { has } from "@/content/fill";
import { scrollToId } from "@/lib/scroll";

/** Until a portrait is supplied: a framed monogram that is meant to look intentional. */
function Monogram() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <span
        aria-hidden
        className="font-display text-[clamp(5.5rem,16vw,9rem)] font-extrabold text-white/[0.07]"
      >
        DDS
      </span>
      <Coordinates className="absolute bottom-5 left-5" />
    </div>
  );
}

export default function About() {
  const lit = useLitSurface<HTMLDivElement>();
  const portrait = has(about.portrait) ? about.portrait : null;
  return (
    <section
      id="about"
      data-zone="about"
      aria-labelledby="about-title"
      className="relative mx-auto max-w-[1440px] px-[var(--gutter)] py-24 lg:py-36"
    >
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="relative mx-auto w-full max-w-[22rem] lg:col-span-5 lg:max-w-none">
          {/* the light parks on the frame's top-left corner and warms it */}
          <span aria-hidden data-node-anchor="about-node" className="absolute -top-px -left-px size-px" />
          <div ref={lit} className="lit-surface relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-surface">
            {portrait ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={portrait.src}
                width={portrait.width}
                height={portrait.height}
                alt={portrait.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <Monogram />
            )}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-6 lg:col-start-7">
          <SectionMarker className="mb-6">{about.marker}</SectionMarker>
          <h2 id="about-title" className="sr-only">{about.title}</h2>
          <p className="font-display text-[clamp(1.9rem,1rem+2.8vw,3.5rem)] leading-[1.05]">{about.lead}</p>
          <p className="t-body mt-6 text-muted">{about.body}</p>
          <p className="mono mt-8 text-muted">{about.roles.join(" / ")}</p>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}
            className="mt-8 inline-flex min-h-11 items-center border-b border-white/25 text-text transition-colors duration-300 hover:border-key"
          >
            Let&apos;s talk
          </a>
        </Reveal>
      </div>
    </section>
  );
}
