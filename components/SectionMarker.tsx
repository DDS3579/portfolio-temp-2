import { cn } from "@/lib/cn";

/** Map-language section marker, e.g. "Region: Selected Work". */
export default function SectionMarker({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("mono text-muted", className)}>{children}</p>;
}
