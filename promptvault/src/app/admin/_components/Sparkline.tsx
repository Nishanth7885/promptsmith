'use client';

interface Props {
  data: number[];
  labels?: string[];
  color?: string;
}

export function Sparkline({ data, labels, color = '#e11d48' }: Props) {
  if (data.length === 0) return <p className="text-sm text-slate-500">No data.</p>;
  const max = Math.max(1, ...data);
  const W = 320;
  const H = 80;
  const stepX = W / Math.max(1, data.length - 1);
  const points = data
    .map((v, i) => `${i * stepX},${H - (v / max) * (H - 4) - 2}`)
    .join(' ');

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[80px]">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((v, i) => (
          <circle
            key={i}
            cx={i * stepX}
            cy={H - (v / max) * (H - 4) - 2}
            r={2.5}
            fill={color}
          />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-slate-400">
        {labels && (
          <>
            <span>{labels[0]}</span>
            <span>{labels[labels.length - 1]}</span>
          </>
        )}
        <span className="ml-auto font-medium text-slate-700">
          total {data.reduce((a, b) => a + b, 0)}
        </span>
      </div>
    </div>
  );
}
