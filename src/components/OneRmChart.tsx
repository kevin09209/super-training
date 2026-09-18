interface Point {
  date: string;
  value: number;
}

interface Props {
  points: Point[];
  unit?: string;
}

/** 純 SVG 折線圖，不依賴圖表套件 */
export function OneRmChart({ points, unit = 'kg' }: Props) {
  const W = 340;
  const H = 170;
  const padL = 40;
  const padR = 12;
  const padT = 14;
  const padB = 28;
  if (points.length === 0) return <div className="empty">還沒有紀錄</div>;

  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const values = sorted.map((p) => p.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const span = Math.max(5, maxV - minV);
  const lo = Math.floor((minV - span * 0.15) / 5) * 5;
  const hi = Math.ceil((maxV + span * 0.15) / 5) * 5;
  const t0 = new Date(sorted[0].date).getTime();
  const t1 = Math.max(t0 + 1, new Date(sorted[sorted.length - 1].date).getTime());

  const x = (d: string) => padL + ((new Date(d).getTime() - t0) / (t1 - t0)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);
  const path = sorted.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.date).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const ticks = [lo, (lo + hi) / 2, hi];
  const fmtDate = (d: string) => d.slice(5).replace('-', '/');

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#2a2f3a" strokeWidth={1} />
          <text x={padL - 6} y={y(t) + 4} fontSize={10} fill="#9aa3b2" textAnchor="end">
            {t}
          </text>
        </g>
      ))}
      <path d={path} fill="none" stroke="#ff7a1a" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {sorted.map((p, i) => (
        <g key={i}>
          <circle cx={x(p.date)} cy={y(p.value)} r={4} fill="#ff7a1a" stroke="#0f1115" strokeWidth={1.5} />
          {(i === 0 || i === sorted.length - 1 || p.value === maxV) && (
            <text x={x(p.date)} y={y(p.value) - 8} fontSize={10} fill="#e8eaf0" textAnchor="middle">
              {p.value}
              {unit}
            </text>
          )}
        </g>
      ))}
      <text x={padL} y={H - 8} fontSize={10} fill="#9aa3b2">
        {fmtDate(sorted[0].date)}
      </text>
      <text x={W - padR} y={H - 8} fontSize={10} fill="#9aa3b2" textAnchor="end">
        {fmtDate(sorted[sorted.length - 1].date)}
      </text>
    </svg>
  );
}
