"use client";
import { useScroll, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { Fragment, useEffect, useRef, useState } from "react";import { site } from "@/content/site";
import { clamp, easeOutCubic } from "@/lib/ease";
import { subscribe } from "@/lib/loop";
import { ignite, scene } from "@/lib/scene";
import { scrollToId } from "@/lib/scroll";
import { useReducedMotionPref, useTier } from "@/lib/tier";

const delay = (s: string) => ({ "--d": s }) as React.CSSProperties;

/** "Digira: 3 branches" renders as muted label + bright value. Copy stays verbatim in /content. */
/** Kathmandu local time, ticking on the minute. Client-only, so the server HTML never mismatches. */
function NepalTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kathmandu", hour: "2-digit", minute: "2-digit", hour12: false });
    let id = 0;
    const tick = () => {
      setT(fmt.format(new Date()));
      id = window.setTimeout(tick, 60000 - (Date.now() % 60000) + 50);
    };
    tick();
    return () => window.clearTimeout(id);
  }, []);
  return (
    <span className="inline-block min-w-[6ch] text-muted tabular-nums" title="Nepal Time (UTC+5:45)">
      {t && `· ${t}`}
    </span>
  );
}

/** "Digira: 3 branches" renders as muted label + bright value. Copy stays verbatim in /content. */
function Proof({ text }: { text: string }) {
  const at = text.indexOf(": ");
  const label = at > 0 ? text.slice(0, at) : null;
  const value = at > 0 ? text.slice(at + 2) : text;
  return (
    <li className="flex items-center gap-2">
      {/^open/i.test(text) && <span aria-hidden className="size-1.5 rounded-full bg-key" />}
      {label && <span className="text-muted">{label}</span>}
      <span>{value}</span>
      {text === site.location && <NepalTime />}
    </li>
  );
}
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const period = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotionPref();
  const full = useTier() === "full";
  const h = site.hero;

  // Exit choreography (desktop): the copy drifts up (max 12%) and dims as the light lifts off toward the origin state.
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const y = useTransform(p, [0, 1], ["0%", "-12%"]);
  const opacity = useTransform(p, [0, 0.6], [1, 0]);

  useEffect(() => {
    // Ignite the period at t = 1.3s on the same clock as the CSS timeline (first contentful paint).
    let igniteTimer = 0;
    if (reduced) {
      ignite(-10000);
    } else {
      const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 150;
      igniteTimer = window.setTimeout(() => ignite(), Math.max(0, fcp + 1300 - performance.now()));
    }

    // With no live constellation layer drawing, keep the light on the period so shader and CSS fallback agree.
    const place = () => {
      const el = period.current;
      if (!el || scene.live) return;
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const yy = r.top + r.height / 2;
      scene.lightX = x;
      scene.lightY = yy;
      document.documentElement.style.setProperty("--light-x", `${x.toFixed(0)}px`);
      document.documentElement.style.setProperty("--light-y", `${yy.toFixed(0)}px`);
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    const ro = new ResizeObserver(place); // font swap or layout change resizes the headline
    if (title.current) ro.observe(title.current);

    return () => {
      window.removeEventListener("resize", place);
      ro.disconnect();
      window.clearTimeout(igniteTimer);
    };
  }, [reduced]);


  // After the room lights up, the light-weight qualifiers fall off with distance from the light.
  // The heavy role words stay at full strength so the hierarchy never inverts. Opacity only, desktop only.
  useEffect(() => {
    if (!full) return;
    const FLOOR = 0.58; // dimmest a qualifier gets
    const REACH = 900; // px; falloff length from the light
    const words = Array.from(title.current?.querySelectorAll<HTMLElement>(".hw.by") ?? []);    const cur = words.map(() => 1);
    const shown = words.map(() => 1);
    const off = subscribe((dt, t) => {
      if (!scene.igniteAt || window.scrollY > window.innerHeight * 0.9) return;
      const settle = easeOutCubic(clamp((t - scene.igniteAt - 900) / 1800));
      const rects = words.map((w) => w.getBoundingClientRect());
      rects.forEach((r, i) => {
        const dx = Math.max(r.left - scene.lightX, 0, scene.lightX - r.right);
        const dy = Math.max(r.top - scene.lightY, 0, scene.lightY - r.bottom);
        const fall = FLOOR + (1 - FLOOR) * Math.exp(-Math.hypot(dx, dy) / REACH);
        cur[i] = cur[i]! + (1 - (1 - fall) * settle - cur[i]!) * (1 - Math.exp(-dt * 6));
        if (Math.abs(cur[i]! - shown[i]!) > 0.004) {
          shown[i] = cur[i]!;
          words[i]!.style.opacity = cur[i]!.toFixed(3);
        }
      });
    }, 20);
    return () => {
      off();
      words.forEach((w) => w.style.removeProperty("opacity"));
    };
  }, [full]);

  return (
    <section
      ref={section}
      id="top"
      data-zone="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100dvh] flex-col pt-[calc(var(--nav-h)+1.5rem)] pb-8"
    >
      <div className="hero-fallback" aria-hidden />

      <m.div
        style={full ? { y, opacity } : undefined}
        className="relative z-20 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-[var(--gutter)]"
      >
        {/* headline group sits in the optical middle so the light has room to fill the room */}
        <div className="my-auto py-10">
          <p className="t-late mb-8 text-base text-muted lg:mb-10" style={delay("1.6s")}>
            {h.label}
          </p>
          <h1 id="hero-title" ref={title} className="font-display t-hero">
            {h.lines.map((line, i) => (
              <span key={line.text} className="line-mask">
                <span className="line-inner" style={{ "--i": i } as React.CSSProperties}>
                  <a
                    href={`#${line.to}`}
                    onClick={(e) => { e.preventDefault(); scrollToId(line.to); }}
                    className="line-text"
                  >
                    {line.text.split(" ").map((w, wi, all) => (
                      <Fragment key={wi}>
                        <span className={wi === 0 ? "hw" : "hw by"}>{w}</span>
                        {wi < all.length - 1 && " "}
                      </Fragment>
                    ))}
                    {i === h.lines.length - 1 && (
                      <span ref={period} className="period-dot" data-node-anchor="hero-period" aria-hidden="true" />
                    )}
                    <span className="hero-hint mono" aria-hidden="true">→ {line.hint}</span>
                  </a>
                </span>
              </span>
            ))}
          </h1>
        </div>

        {/* one bottom band: support, actions, proof */}
        <div
          className="t-late relative grid gap-x-8 gap-y-8 border-t border-border pt-6 lg:grid-cols-12 lg:items-start"
          style={delay("1.9s")}
        >
          <span aria-hidden className="absolute -top-px left-0 h-px w-24 overflow-hidden">
            <span className="scroll-cue-x absolute inset-0 bg-key" />
          </span>

          <p className="t-body text-muted lg:col-span-4">{h.support}</p>

          <div className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:col-start-5">
            <a
              href="#work"
              onClick={(e) => { e.preventDefault(); scrollToId("work"); }}
              className={buttonClass("solid", "min-h-12 px-7")}
            >
              {h.ctaPrimary}
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}
              className={buttonClass("ghost", "min-h-12 px-7")}
            >
              {h.ctaSecondary}
            </a>
          </div>

          <ul className="mono grid gap-y-2 text-text lg:col-span-3 lg:col-start-10">
            {h.proof.map((t) => (
              <Proof key={t} text={t} />
            ))}
          </ul>
        </div>
      </m.div>
    </section>
  );
}