import * as React from "react";
import { cn } from "@/lib/cn";

const field =
  "w-full min-h-11 rounded-md border border-white/12 bg-transparent px-4 py-3 text-base text-text placeholder:text-muted/70 transition-colors duration-300 focus:border-key focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-key/70 aria-[invalid=true]:border-[#e5786d]";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...p }, ref) => <input ref={ref} className={cn(field, className)} {...p} />,
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...p }, ref) => <textarea ref={ref} className={cn(field, "min-h-36 resize-y", className)} {...p} />,
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...p }, ref) => (
    <select ref={ref} className={cn(field, "pr-3", className)} {...p}>
      {children}
    </select>
  ),
);
Select.displayName = "Select";
