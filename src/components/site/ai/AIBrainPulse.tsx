import { useEffect, useState } from "react";

const thoughts = [
  "Should I escalate this support ticket?",
  "Which 3 leads match the ICP best?",
  "Summarize 184 PDFs into 1 brief.",
  "Detect anomalies in 24h of transactions.",
  "Draft a follow-up to last week's prospect.",
  "Translate this contract to 4 languages.",
  "What changed in the codebase overnight?",
  "Cluster today's news into 5 themes.",
];

export function AIBrainPulse() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setIdx((x) => (x + 1) % thoughts.length), 2200);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="glass-card p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(600px circle at 50% 50%, rgba(167,139,250,0.35), transparent 70%)" }} />

      <div className="relative grid lg:grid-cols-[260px_1fr] gap-8 items-center">
        {/* Brain */}
        <div className="flex justify-center">
          <svg viewBox="0 0 200 200" className="w-56 h-56">
            <defs>
              <radialGradient id="bp" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="60" fill="url(#bp)">
              <animate attributeName="r" values="58;66;58" dur="2.4s" repeatCount="indefinite" />
            </circle>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const x = 100 + Math.cos(a) * 80;
              const y = 100 + Math.sin(a) * 80;
              return (
                <g key={i}>
                  <line x1="100" y1="100" x2={x} y2={y} stroke="#67e8f9" strokeWidth="0.5" opacity="0.4" />
                  <circle cx={x} cy={y} r="3" fill="#67e8f9">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.5 + (i % 4) * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}
            <text x="100" y="106" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">AI</text>
          </svg>
        </div>

        {/* Thought bubbles */}
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#888] mb-3">What our AI is thinking right now</div>
          <div className="relative h-32">
            {thoughts.map((t, i) => (
              <div
                key={t}
                className="absolute inset-0 transition-all duration-700"
                style={{
                  opacity: i === idx ? 1 : 0,
                  transform: i === idx ? "translateY(0)" : "translateY(8px)",
                }}
              >
                <div className="text-2xl md:text-3xl font-bold text-white leading-tight">"{t}"</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-1.5">
            {thoughts.map((_, i) => (
              <span
                key={i}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: i === idx ? 28 : 8,
                  background: i === idx ? "#a78bfa" : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
