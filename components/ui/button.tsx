import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "ghost";
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-[0.9375rem] font-medium whitespace-nowrap transition-[transform,opacity] duration-300 ease-[var(--ease)] will-change-auto hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50";
const variants: Record<Variant, string> = {
  solid: "bg-text text-bg hover:opacity-90",
  ghost: "border border-white/20 text-text hover:border-white/40 hover:opacity-100",
};

export function buttonClass(variant: Variant = "solid", className?: string) {
  return cn(base, variants[variant], className);
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(({ className, variant = "solid", type = "button", ...props }, ref) => (
  <button ref={ref} type={type} className={buttonClass(variant, className)} {...props} />
));
Button.displayName = "Button";
