/**
 * Generated compositions for the browser-frame slot, drawn with the site's own grammar (node, edge).
 * Strokes stay cool and warm with the parent's --lit (set by the lit surface), so warmth only appears
 * where the light reaches. Drop /public/work/<slug>.webp and set `image` in content to replace these.
 */
type Pt = [number, number];

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor="#FFD9A0" stopOpacity="0.9" />
        <stop offset="0.2" stopColor="#E8B04B" stopOpacity="0.5" />
        <stop offset="0.55" stopColor="#C9652B" stopOpacity="0.14" />
        <stop offset="1" stopColor="#C9652B" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

function Node({ at, r = 3, hot, bloom }: { at: Pt; r?: number; hot?: boolean; bloom?: string }) {
  return (
    <g>
      {hot && bloom && <circle cx={at[0]} cy={at[1]} r={r * 10} fill={`url(#${bloom})`} style={{ opacity: "var(--lit, 0)" }} />}
      <circle cx={at[0]} cy={at[1]} r={r} className="art-node" />
      {hot && <circle cx={at[0]} cy={at[1]} r={r} className="art-core" />}
    </g>
  );
}

const svgProps = {
  viewBox: "0 0 560 350",
  className: "h-full w-full",
  "aria-hidden": true,
  preserveAspectRatio: "xMidYMid slice",
} as const;

/** A page assembling itself: blocks, with a system node wired to each block corner. */
function Agency() {
  const root: Pt = [185, 152];
  const corners: Pt[] = [[40, 72], [330, 72], [330, 232], [40, 232]];
  const cards: Pt[] = [[350, 108], [350, 196]];
  return (
    <svg {...svgProps}>
      <Defs id="art-bloom-agency" />
      <rect x="40" y="32" width="480" height="20" rx="4" className="art-box" />
      <rect x="40" y="72" width="290" height="160" rx="6" className="art-box" />
      <rect x="350" y="72" width="170" height="72" rx="6" className="art-box" />
      <rect x="350" y="160" width="170" height="72" rx="6" className="art-box" />
      <rect x="40" y="254" width="120" height="9" rx="3" className="art-box" />
      <rect x="40" y="274" width="210" height="7" rx="3" className="art-box" />
      <rect x="40" y="290" width="170" height="7" rx="3" className="art-box" />
      {corners.map((c, i) => (
        <line key={i} x1={root[0]} y1={root[1]} x2={c[0]} y2={c[1]} className="art-line" />
      ))}
      <path d={`M330 152H${cards[0]![0]}`} className="art-line" />
      {cards.map((c, i) => (
        <g key={i}>
          <line x1="330" y1="152" x2={c[0]} y2={c[1]} className="art-line" />
          <Node at={c} r={2.5} />
        </g>
      ))}
      {corners.map((c, i) => (
        <Node key={i} at={c} r={2.5} />
      ))}
      <Node at={root} r={4} hot bloom="art-bloom-agency" />
    </svg>
  );
}

/** A 16-team single-elimination bracket. Every joint is a node; the winner's node is the lit one. */
function Bracket() {
  const xs = [26, 136, 246, 356, 466];
  const w = 68;
  const h = 11;
  let ys = Array.from({ length: 16 }, (_, i) => 20 + i * 19.6);
  const rects: React.ReactNode[] = [];
  const lines: string[] = [];
  const joints: Pt[] = [];
  for (let r = 0; r < 5; r++) {
    ys.forEach((y, i) => rects.push(<rect key={`${r}-${i}`} x={xs[r]} y={y} width={w} height={h} rx="2.5" className="art-box" />));
    if (r === 4) break;
    const next: number[] = [];
    for (let i = 0; i < ys.length; i += 2) {
      const y1 = ys[i]! + h / 2;
      const y2 = ys[i + 1]! + h / 2;
      const mid = (y1 + y2) / 2;
      const jx = xs[r]! + w + 20;
      lines.push(`M${xs[r]! + w} ${y1}H${jx}V${y2}H${xs[r]! + w}M${jx} ${mid}H${xs[r + 1]!}`);
      joints.push([jx, mid]);
      next.push(mid - h / 2);
    }
    ys = next;
  }
  const win: Pt = [xs[4]! + w + 18, ys[0]! + h / 2];
  return (
    <svg {...svgProps}>
      <Defs id="art-bloom-esports" />
      {rects}
      {lines.map((d, i) => (
        <path key={i} d={d} className="art-line" />
      ))}
      <path d={`M${xs[4]! + w} ${win[1]}H${win[0]}`} className="art-line" />
      {joints.map((p, i) => (
        <Node key={i} at={p} r={1.8} />
      ))}
      <Node at={win} r={4} hot bloom="art-bloom-esports" />
    </svg>
  );
}

/** Levels: a staircase of treads, one node per level, the top one lit. */
function Levels() {
  const treads: Pt[] = [[80, 300], [180, 250], [280, 205], [380, 160], [480, 112]];
  const stair = `M30 316H130V266H230V221H330V176H430V128H530`;
  return (
    <svg {...svgProps}>
      <Defs id="art-bloom-edu" />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M30 ${330 - i * 26} C 170 ${330 - i * 26 - 70}, 320 ${330 - i * 26 + 30}, 530 ${330 - i * 26 - 60}`}
          className="art-line"
          style={{ opacity: 0.5 - i * 0.1 }}
        />
      ))}
      <path d={stair} className="art-line" />
      {treads.slice(1).map((p, i) => (
        <line key={i} x1={treads[i]![0]} y1={treads[i]![1]} x2={p[0]} y2={p[1]} className="art-line" />
      ))}
      {treads.map((p, i) => (
        <Node key={i} at={p} r={i === treads.length - 1 ? 4 : 2.8} hot={i === treads.length - 1} bloom="art-bloom-edu" />
      ))}
    </svg>
  );
}

export function WorkArt({ slug }: { slug: string }) {
  if (slug === "digira-esports") return <Bracket />;
  if (slug === "digira-education") return <Levels />;
  return <Agency />;
}