"use client";
import { useEffect, useRef } from "react";
import { buttonClass } from "@/components/ui/button";
import { site } from "@/content/site";
import { ignite, scene } from "@/lib/scene";
import { scrollToId } from "@/lib/scroll";
import { useReducedMotionPref } from "@/lib/tier";

export default function Hero() {
  const period = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotionPref();
  const h = site.hero;

  useEffect(() => {
    // Ignite the period at t = 1.3s on the same clock as the CSS timeline (first contentful paint).
    let igniteTimer = 0;
    if (reduced) {
      ignite(-10000);
    } else {
      const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 150;
      igniteTimer = window.setTimeout(() => ignite(), Math.max(0, fcp + 1300 - performance.now()));
    }
    // When no live constellation layer is drawing, keep the light on the period so the shader and CSS fallback agree.
    const place = () => {
      const el = period.current;
      if (!el || scene.live) return;
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      scene.lightX = x;
      scene.lightY = y;
      document.documentElement.style.setProperty("--light-x", `${x.toFixed(0)}px`);
      document.documentElement.style.setProperty("--light-y", `${y.toFixed(0)}px`);
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    const poll = window.setInterval(place, 400); // re-measure while fonts and layout settle
    const stop = window.setTimeout(() => window.clearInterval(poll), 3000);
    return () => {
      window.removeEventListener("resize", place);
      window.clearInterval(poll);
      window.clearTimeout(stop);
      window.clearTimeout(igniteTimer);
    };
  }, [reduced]);

  return (
    <section
      id="top"
      data-zone="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100dvh] flex-col justify-end pt-[calc(var(--nav-h)+2rem)] pb-8"
    >
      <div className="hero-fallback" aria-hidden />
      <div className="relative z-20 mx-auto w-full max-w-[1440px] px-[var(--gutter)]">
        <p className="t-late mb-6 text-base text-muted" style={{ "--d": "1.6s" } as React.CSSProperties}>
          {h.label}
        </p>

        <h1 id="hero-title" className="font-display t-hero max-w-[16ch] sm:max-w-none">
          {h.lines.map((line, i) => (
            <span key={line} className="line-mask">
              <span className="line-inner" style={{ "--i": i } as React.CSSProperties}>
                {line}
                {i === h.lines.length - 1 && (
                  <span
                    ref={period}
                    className="period-dot"
                    data-node-anchor="hero-period"
                    aria-hidden="true"
                  />
                )}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-8 md:grid-cols-12">
          <p className="t-late t-body text-muted md:col-span-6 lg:col-span-5" style={{ "--d": "1.6s" } as React.CSSProperties}>
            {h.support}
          </p>
          <div
            className="t-late flex flex-wrap items-center gap-3 md:col-span-6 md:col-start-7 md:justify-end lg:col-start-8"
            style={{ "--d": "1.9s" } as React.CSSProperties}
          >
            <a
              href="#work"
              onClick={(e) => { e.preventDefault(); scrollToId("work"); }}
              className={buttonClass("solid")}
            >
              {h.ctaPrimary}
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}
              className={buttonClass("ghost")}
            >
              {h.ctaSecondary}
            </a>
          </div>
        </div>

        <div
          className="t-late mt-12 flex items-end justify-between gap-6 border-t border-border pt-5"
          style={{ "--d": "1.9s" } as React.CSSProperties}
        >
          <ul className="mono grid grid-cols-2 gap-x-8 gap-y-2 text-muted sm:flex sm:flex-wrap sm:gap-x-10">
            {h.proof.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <span
            aria-hidden
            className="t-late relative hidden h-12 w-px overflow-hidden bg-white/10 md:block"
            style={{ "--d": "2.4s" } as React.CSSProperties}
          >
            <span className="scroll-cue absolute inset-0 bg-key" />
          </span>
        </div>
      </div>
    </section>
  );
}
