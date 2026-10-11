"use client";
import { useRef } from "react";
import Reveal from "@/components/motion/Reveal";
import ConstellationStatic from "@/components/constellation/ConstellationStatic";
import { useLitSurface } from "@/components/constellation/useLitSurface";
import SectionMarker from "@/components/SectionMarker";
import { has } from "@/content/fill";
import {
  branches, lab, secondary, umbrella, workCopy,
  type Branch, type LabItem, type Links, type Secondary,
} from "@/content/ventures";
import { scene } from "@/lib/scene";
import { cn } from "@/lib/cn";
import { useTier } from "@/lib/tier";
import { WorkArt } from "./WorkArt";

function StackLine({ items }: { items: readonly string[] | "[FILL]" | undefined }) {
  if (!items || !Array.isArray(items) || !items.length) return null;
  return <p className="mono text-muted">{items.join(" / ")}</p>;
}

function LinkRow({ links, name }: { links: Links; name: string }) {
  const items = [
    ["Live", links.live],
    ["GitHub", links.github],
    ["Case Study", links.caseStudy],
  ] as const;
  const shown = items.filter(([, u]) => has(u));
  if (!shown.length) return null;
  return (
    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
      {shown.map(([label, url]) => (
        <li key={label}>
          <a
            href={url as string}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label}: ${name}`}
            className="inline-flex min-h-11 items-center border-b border-white/25 text-text transition-colors duration-300 hover:border-key"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Visual({ b }: { b: Branch }) {
  const lit = useLitSurface<HTMLDivElement>();
  const inner = useRef<HTMLDivElement>(null);
  const img = has(b.image) ? b.image : null;
  return (
    <div
      ref={lit}
      className="lit-surface group overflow-hidden rounded-xl border border-border bg-surface transition-transform duration-300 ease-[var(--ease)] hover:scale-[1.03]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        if (inner.current) inner.current.style.transform = `translate3d(${(x * -8).toFixed(1)}px, ${(y * -6).toFixed(1)}px, 0)`;
      }}
      onPointerLeave={() => { if (inner.current) inner.current.style.transform = ""; }}
    >
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3" aria-hidden>
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="mono ml-3 truncate text-[10px] text-muted">{b.slug}</span>
      </div>
      <div className="aspect-[16/10] overflow-hidden">
        <div ref={inner} className="h-full w-full scale-[1.06] transition-transform duration-300 ease-[var(--ease)]">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img.src} width={img.width} height={img.height} alt={img.alt} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <WorkArt slug={b.slug} />
          )}
        </div>
      </div>
    </div>
  );
}

function Figures({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="mt-3 grid grid-cols-3 gap-4">
      {items.map((f) => (
        <div key={f.label} className="flex flex-col-reverse gap-2">
          <dt className="text-sm leading-snug text-muted">{f.label}</dt>
          <dd className="font-display text-[clamp(1.75rem,1.1rem+1.8vw,2.75rem)] leading-none tabular-nums">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A branch with nothing to say yet renders as one quiet line instead of a giant empty visual. */
const isThin = (b: Branch) => !has(b.context) && !has(b.challenge) && !has(b.outcome);

function ThinRow({ b }: { b: Branch }) {
  return (
    <article
      className="relative grid gap-2 py-9 md:grid-cols-12 md:items-baseline md:gap-8"
      onPointerEnter={() => { scene.hoverNode = b.node; }}
      onPointerLeave={() => { scene.hoverNode = null; }}
      aria-labelledby={`branch-${b.slug}`}
    >
      <span aria-hidden data-node-anchor={`row-${b.node}`} className="absolute top-[3.3rem] left-[calc(var(--gutter)*-0.5)] size-px" />
      <h4 id={`branch-${b.slug}`} className="font-display text-[clamp(2rem,1.2rem+2.6vw,3.5rem)] md:col-span-7">
        {b.name}
      </h4>
      <p className="text-muted md:col-span-5">{b.category}</p>
    </article>
  );
}

function BranchRow({ b, flip }: { b: Branch; flip: boolean }) {
  const rest = [
    ["Context", b.context],
    ["Challenge", b.challenge],
  ] as const;
  const figures = b.figures?.length ? b.figures : null;
  return (
    <article
      className="relative grid items-center gap-8 py-14 lg:grid-cols-12 lg:gap-12 lg:py-20"
      onPointerEnter={() => { scene.hoverNode = b.node; }}
      onPointerLeave={() => { scene.hoverNode = null; }}
      aria-labelledby={`branch-${b.slug}`}
    >
      <span
        aria-hidden
        data-node-anchor={`row-${b.node}`}
        className="absolute top-[3.6rem] left-[calc(var(--gutter)*-0.5)] size-px lg:top-[6rem]"
      />
      <Reveal className={cn("lg:col-span-7", flip && "lg:order-2")}>
        <Visual b={b} />
      </Reveal>
      <Reveal delay={0.08} className={cn("lg:col-span-5", flip && "lg:order-1")}>
        <p className="text-sm text-muted">{b.category}</p>
        <h4 id={`branch-${b.slug}`} className="font-display mt-2 text-[clamp(2rem,1.2rem+2.6vw,3.5rem)]">
          {b.name}
        </h4>
        {has(b.role) && <p className="mt-3 text-muted">My role: {b.role}</p>}

        {/* proof first: what happened leads, how it got there follows */}
        {has(b.outcome) && (
          <div className="mt-7">
            <p className="text-sm text-muted">Outcome</p>
            {figures ? (
              <>
                <p className="sr-only">{b.outcome}</p>
                <Figures items={figures} />
              </>
            ) : (
              <p className="mt-2 text-[clamp(1.15rem,1rem+0.5vw,1.4rem)] leading-snug">{b.outcome}</p>
            )}
          </div>
        )}
        <dl className="mt-7 space-y-3 border-t border-border pt-5">
          {rest.filter(([, v]) => has(v)).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-x-4">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="text-[0.95rem] leading-relaxed text-muted">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6">
          <StackLine items={b.stack} />
        </div>
        <LinkRow links={b.links} name={b.name} />
      </Reveal>
    </article>
  );
}

function SecondaryRow({ s }: { s: Secondary }) {
  const lit = useLitSurface<HTMLLIElement>();
  return (
    <li
      ref={lit}
      className="lit-surface relative grid gap-2 border-b border-border py-6 md:grid-cols-12 md:items-baseline md:gap-8"
      onPointerEnter={() => { if (s.node) scene.hoverNode = s.node; }}
      onPointerLeave={() => { scene.hoverNode = null; }}
    >
      {s.node && (
        <span aria-hidden data-node-anchor={`row-${s.node}`} className="absolute top-9 left-[calc(var(--gutter)*-0.5)] size-px" />
      )}
      <h4 className="font-display text-3xl md:col-span-4">{s.name}</h4>
      <p className="text-muted md:col-span-3">{s.role}</p>
      <div className="md:col-span-5">
        {has(s.line) && <p className="text-[0.98rem]">{s.line}</p>}
        <LinkRow links={s.links} name={s.name} />
      </div>
    </li>
  );
}

function LabCard({ l, offset }: { l: LabItem; offset: string }) {
  const lit = useLitSurface<HTMLDivElement>();
  return (
    <div className={offset}>
      <div
        ref={lit}
        className="lit-surface relative rounded-xl border border-border bg-raised p-6"
        onPointerEnter={() => { scene.hoverNode = l.node; }}
        onPointerLeave={() => { scene.hoverNode = null; }}
      >
        <span aria-hidden data-node-anchor={l.node} className="absolute -top-3 left-0 size-px" />
        <h4 className="font-display text-2xl">{l.name}</h4>
        <p className="mt-3 text-[0.98rem] text-muted">{l.line}</p>
        <div className="mt-5">
          <StackLine items={l.stack} />
        </div>
        <LinkRow links={l.links} name={l.name} />
      </div>
    </div>
  );
}

export default function Work() {
  const tier = useTier();
  return (
    <section
      id="work"
      data-zone="work"
      aria-labelledby="work-title"
      className="relative mx-auto max-w-[1440px] px-[var(--gutter)] pt-32 pb-24 lg:pt-44"
    >
      <header className="relative grid gap-8 lg:grid-cols-12">
        <span aria-hidden data-node-anchor="work-title" className="absolute top-[2.4rem] left-[calc(var(--gutter)*-0.5)] size-px" />
        <Reveal className="lg:col-span-8">
          <SectionMarker className="mb-6">{workCopy.marker}</SectionMarker>
          <h2 id="work-title" className="font-display t-section">{workCopy.title}</h2>
          <p className="t-body mt-6 text-muted">{workCopy.subtitle}</p>
        </Reveal>
        {tier === "lite" && (
          <div className="hidden md:col-span-4 md:col-start-9 md:block">
            <ConstellationStatic state="conglomerate" labels className="ml-auto max-w-[260px]" />
          </div>
        )}
      </header>

      <div className="mt-20 border-t border-border pt-10">
        <Reveal>
          <h3 className="font-display text-[clamp(1.5rem,1rem+1.6vw,2.25rem)]">{umbrella.name}</h3>
          <p className="t-body mt-3 text-muted">{umbrella.line}</p>
        </Reveal>
        <div className="divide-y divide-border">
          {branches.map((b) =>
            isThin(b) ? (
              <ThinRow key={b.slug} b={b} />
            ) : (
              <BranchRow key={b.slug} b={b} flip={branches.filter((x) => !isThin(x)).indexOf(b) % 2 === 1} />
            ),
          )}
        </div>
      </div>

      <ul className="mt-12 border-t border-border" aria-label="More work">
        {secondary.map((s) => (
          <SecondaryRow key={s.slug} s={s} />
        ))}
      </ul>

      <div className="mt-28">
        <Reveal>
          <h3 className="font-display text-[clamp(1.75rem,1.1rem+2vw,3rem)]">{workCopy.labTitle}</h3>
        </Reveal>
        <div className="mt-14 grid gap-8 pb-12 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          <LabCard l={lab[0]!} offset="" />
          <LabCard l={lab[1]!} offset="lg:mt-12" />
          <LabCard l={lab[2]!} offset="lg:mt-24" />
        </div>
      </div>
    </section>
  );
}
