/** Generated abstract compositions for the browser-frame slot. Cool neutrals only: warmth comes from the node's light. */
const S = "rgba(255,255,255,0.16)";
const F = "rgba(154,161,172,0.10)";
const A = "rgba(64,104,160,0.28)";

function Agency() {
  // layered UI blocks: a page assembling itself
  return (
    <svg viewBox="0 0 560 350" className="h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
      <rect x="40" y="36" width="480" height="24" rx="4" fill={F} stroke={S} />
      <rect x="40" y="86" width="270" height="150" rx="6" fill={A} stroke={S} />
      <rect x="330" y="86" width="190" height="66" rx="6" fill={F} stroke={S} />
      <rect x="330" y="170" width="190" height="66" rx="6" fill="none" stroke={S} strokeDasharray="4 5" />
      <rect x="40" y="258" width="150" height="14" rx="3" fill={S} />
      <rect x="40" y="284" width="230" height="8" rx="3" fill={F} />
      <rect x="40" y="302" width="190" height="8" rx="3" fill={F} />
      <path d="M330 300 L372 276 L414 288 L456 250 L520 262" fill="none" stroke={S} strokeWidth="1.5" />
    </svg>
  );
}

function Bracket() {
  // a tournament bracket: 16 -> 8 -> 4 -> 2 -> 1
  const rounds = [8, 4, 2, 1];
  const xs = [40, 170, 300, 430];
  const els: React.ReactNode[] = [];
  rounds.forEach((n, r) => {
    const gap = 300 / n;
    for (let i = 0; i < n; i++) {
      const y = 25 + gap * i + gap / 2 - 9 + (r ? gap * 0.0 : 0);
      els.push(<rect key={`${r}-${i}`} x={xs[r]} y={y} width="86" height="18" rx="3" fill={r === 3 ? A : F} stroke={S} />);
      if (r < 3 && i % 2 === 0) {
        const y2 = 25 + gap * (i + 1) + gap / 2 - 9;
        const ny = 25 + (gap * 2) * (i / 2) + gap + 0 - 9 + 0;
        els.push(
          <path key={`l-${r}-${i}`} d={`M${xs[r]! + 86} ${y + 9} H${xs[r]! + 108} V${(y + y2) / 2 + 9} H${xs[r + 1]!} M${xs[r]! + 86} ${y2 + 9} H${xs[r]! + 108} V${(y + y2) / 2 + 9}`} fill="none" stroke={S} />,
        );
        void ny;
      }
    }
  });
  return (
    <svg viewBox="0 0 560 350" className="h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
      {els}
    </svg>
  );
}

function Rings() {
  // stacked curves: levels of a curriculum
  return (
    <svg viewBox="0 0 560 350" className="h-full w-full" aria-hidden preserveAspectRatio="xMidYMid slice">
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M40 ${300 - i * 44} C 160 ${300 - i * 44 - 90}, 300 ${300 - i * 44 + 40}, 520 ${300 - i * 44 - 60}`} fill="none" stroke={S} strokeWidth="1.25" opacity={1 - i * 0.14} />
      ))}
      <circle cx="420" cy="120" r="52" fill={A} stroke={S} />
      <circle cx="420" cy="120" r="88" fill="none" stroke={S} strokeDasharray="3 6" />
    </svg>
  );
}

export function WorkArt({ slug }: { slug: string }) {
  if (slug === "digira-esports") return <Bracket />;
  if (slug === "digira-education") return <Rings />;
  return <Agency />;
}
