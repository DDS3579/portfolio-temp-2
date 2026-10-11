import { site } from "@/content/site";

export default function Coordinates({ className }: { className?: string }) {
  const c = site.coordinates;
  return (
    <p className={`mono text-muted ${className ?? ""}`}>
      {c.label} {c.lat}, {c.lng}
    </p>
  );
}
