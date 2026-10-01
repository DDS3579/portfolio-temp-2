"use client";
import { useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef } from "react";
import Reveal from "@/components/motion/Reveal";
import { philosophy } from "@/content/philosophy";
import { useReducedMotionPref } from "@/lib/tier";

function Word({
  w, i, n, p, animate, setRef,
}: {
  w: string; i: number; n: number; p: MotionValue<number>; animate: boolean; setRef: (el: HTMLElement | null) => void;
}) {
  const start = (i / n) * 0.8;
  const opacity = useTransform(p, [start, start + 0.2], [0.15, 1]);
  return (
    <m.span ref={setRef} style={animate ? { opacity } : undefined} className="mr-[0.25em] inline-block">
      {w}
    </m.span>
  );
}

export default function Philosophy() {
  const ref = useRef<HTMLParagraphElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const wordEls = useRef<(HTMLElement | null)[]>([]);
  const at = useRef(0);
  const reduced = useReducedMotionPref();  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const words = philosophy.statement.split(" ");

  // The single light reads the sentence: it parks at the trailing edge of the word being lit.
  // The anchor glides word to word with a CSS transition; the constellation layer follows it.
  const place = (k: number) => {
    const el = wordEls.current[k];
    if (!el || !cursor.current) return;
    at.current = k;
    cursor.current.style.transform = `translate(${el.offsetLeft + el.offsetWidth + 10}px, ${el.offsetTop + el.offsetHeight * 0.58}px)`;
  };
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    place(Math.min(words.length - 1, Math.max(0, Math.floor((v / 0.8) * words.length)))),
  );
  useEffect(() => {
    place(at.current);
    const ro = new ResizeObserver(() => place(at.current));
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      id="philosophy"
      data-zone="philosophy"
      aria-labelledby="philosophy-title"
      className="relative mx-auto max-w-[1440px] px-[var(--gutter)] py-32 lg:py-48"
    >
      <h2 id="philosophy-title" className="sr-only">Philosophy</h2>
      <p
        ref={ref}
        className="font-display relative max-w-[17ch] text-[clamp(2.5rem,1rem+6vw,7.5rem)]"
        aria-label={philosophy.statement}
      >
        <span
          ref={cursor}
          aria-hidden
          data-node-anchor="phil-cursor"
          className="pointer-events-none absolute top-0 left-0 size-px transition-transform duration-700 ease-[var(--ease)]"
        />
        {words.map((w, i) => (
          <Word
            key={i}
            w={w}
            i={i}
            n={words.length}
            p={p}
            animate={!reduced}            
            setRef={(el) => { wordEls.current[i] = el; }}
          />
        ))}
      </p>

      <ul className="mt-24 border-t border-border lg:mt-36">
        {philosophy.principles.map((pr, i) => (
          <Reveal as="li" key={pr.n} delay={i * 0.08} className="grid gap-3 border-b border-border py-8 md:grid-cols-12 md:items-baseline md:gap-8">
            <span className="mono text-muted md:col-span-1">{pr.n}</span>
            <h3 className="font-display text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] md:col-span-6">{pr.title}</h3>
            <p className="text-muted md:col-span-5">{pr.line}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}