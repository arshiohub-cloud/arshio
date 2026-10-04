import { useEffect, useState } from "react";

const AXES = [
  { label: "Reasoning", v: 0.92 },
  { label: "Vision", v: 0.85 },
  { label: "Speech", v: 0.78 },
  { label: "Agents", v: 0.95 },
  { label: "RAG", v: 0.9 },
  { label: "Automation", v: 0.88 },
];

export function CapabilityRadar({ size = 320 }: { size?: number }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 0.02), 60);
    return () => clearInterval(id);
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 30;
  const n = AXES.length;

  const pts = AXES.map((a, i) => {
    const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
    const pulse = 0.04 * Math.sin(t * 2 + i);
    const r = (a.v + pulse) * R;
    return { x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r, ang, label: a.label };
  });

  const poly = pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      <defs>
        <radialGradient id="rad-fill" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#a3e635" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <circle key={s} cx={cx} cy={cy} r={R * s} fill="none" stroke="rgba(255,255,255,0.06)" />
      ))}
      {AXES.map((a, i) => {
        const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x2 = cx + Math.cos(ang) * R;
        const y2 = cy + Math.sin(ang) * R;
        const lx = cx + Math.cos(ang) * (R + 16);
        const ly = cy + Math.sin(ang) * (R + 16);
        return (
          <g key={a.label}>
            <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="rgba(255,255,255,0.06)" />
            <text x={lx} y={ly} fill="#9ca3af" fontSize="10" textAnchor="middle" dominantBaseline="middle">
              {a.label}
            </text>
          </g>
        );
      })}
      <polygon points={poly} fill="url(#rad-fill)" stroke="#67e8f9" strokeWidth={1.5} />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#a3e635">
          <animate attributeName="r" values="2.5;4;2.5" dur="1.6s" repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}
