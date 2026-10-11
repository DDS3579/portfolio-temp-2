import { NODE_IDS, NODE_LABELS, STATES, type StateName } from "@/content/constellation";
import { cn } from "@/lib/cn";

/** Static fallback: the same three primitives (node, edge, label), no motion, no persistent layer.
 *  Auto-fits the state's visible nodes into its box. */
export default function ConstellationStatic({
  state,
  className,
  labels,
}: {
  state: StateName;
  className?: string;
  labels?: boolean;
}) {
  const spec = STATES[state];
  const ids = NODE_IDS.filter((id) => spec.nodes[id] && (spec.nodes[id]!.a ?? 1) > 0);
  const pts = ids.map((id) => spec.nodes[id]!);
  const edgeEnds = spec.edges.flatMap((e) => [spec.nodes[e.a], spec.nodes[e.b]]).filter(Boolean) as typeof pts;
  const all = [...pts, ...edgeEnds];
  if (!all.length) return null;

  const minX = Math.min(...all.map((p) => p.x));
  const maxX = Math.max(...all.map((p) => p.x));
  const minY = Math.min(...all.map((p) => p.y));
  const maxY = Math.max(...all.map((p) => p.y));
  const W = 300;
  const pad = 46;
  const span = Math.max(maxX - minX, 0.001);
  const spanY = Math.max(maxY - minY, 0.001);
  const scale = Math.min(span > 0.01 ? (W - pad * 2) / span : 1, spanY > 0.01 ? (W - pad * 2) / spanY : 1);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const P = (p: { x: number; y: number }) => ({
    x: W / 2 + (p.x - cx) * (span > 0.01 ? scale : 0),
    y: W / 2 + (p.y - cy) * (spanY > 0.01 ? scale : 0),
  });
  const showLabels = labels ?? !!spec.labelAll;
  const uid = `cs-${state}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${W}`}
      aria-hidden="true"
      focusable="false"
      className={cn("h-auto w-full max-w-[320px]", className)}
    >
      <defs>
        <radialGradient id={`${uid}-bloom`}>
          <stop offset="0" stopColor="#FFD9A0" stopOpacity="0.9" />
          <stop offset="0.2" stopColor="#E8B04B" stopOpacity="0.5" />
          <stop offset="0.55" stopColor="#C9652B" stopOpacity="0.14" />
          <stop offset="1" stopColor="#C9652B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-fade`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {spec.edges.map((e) => {
        const a = spec.nodes[e.a];
        const b = spec.nodes[e.b];
        if (!a || !b) return null;
        const pa = P(a);
        const pb = P(b);
        return (
          <line
            key={`${e.a}-${e.b}`}
            x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
            stroke={e.free ? `url(#${uid}-fade)` : "rgba(255,255,255,0.28)"}
            strokeWidth="1"
          />
        );
      })}
      {ids.map((id) => {
        const n = spec.nodes[id]!;
        const p = P(n);
        const lit = n.lit ?? 0.6;
        const r = 3 * (n.r ?? 1);
        const label = NODE_LABELS[id];
        return (
          <g key={id}>
            {lit > 0.5 && <circle cx={p.x} cy={p.y} r={30 * (n.r ?? 1)} fill={`url(#${uid}-bloom)`} opacity={lit} />}
            <circle cx={p.x} cy={p.y} r={r} fill={lit > 0.5 ? "#FFD9A0" : "#9AA1AC"} />
            {showLabels && label && (
              <text
                x={p.x + (p.x > W * 0.7 ? -(r + 8) : r + 8)}
                y={p.y + 4}
                textAnchor={p.x > W * 0.7 ? "end" : "start"}
                fill="rgba(236,237,239,0.8)"
                fontSize="9"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
