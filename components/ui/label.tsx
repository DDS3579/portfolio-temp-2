import * as React from "react";
import { cn } from "@/lib/cn";

export function Label({ className, ...p }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-2 block text-sm text-muted", className)} {...p} />;
}
