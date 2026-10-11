"use client";
import { type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "@/lib/cn";

/** Progress rail with labeled ticks. `progress` is a spring-smoothed 0..1 motion value. */
export default function Rail({
  labels,
  progress,
  active,
  className,
}: {
  labels: readonly string[];
  progress: MotionValue<number>;
  active: number;
  className?: string;
}) {
  const n = labels.length;
  return (
    <div className={cn("relative", className)} role="progressbar" aria-label="Chapter progress" aria-valuemin={1} aria-valuemax={n} aria-valuenow={active + 1}>
      <div className="relative h-px w-full bg-white/10">
        <m.div className="absolute inset-y-0 left-0 w-full origin-left bg-key" style={{ scaleX: progress }} />
      </div>
      <ul className="absolute inset-x-0 top-0 flex justify-between">
        {labels.map((l, i) => (
          <li
            key={l}
            className={cn(
              "relative flex flex-col text-sm transition-colors duration-300",
              i === 0 ? "items-start" : i === n - 1 ? "items-end" : "items-center",
              i === active ? "text-text" : "text-muted",
            )}
            aria-current={i === active ? "step" : undefined}
          >
            <span
              className={cn(
                "-mt-[3px] h-[7px] w-px transition-colors duration-300",
                i <= active ? "bg-key" : "bg-white/25",
              )}
            />
            <span className="mt-3">{l}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
