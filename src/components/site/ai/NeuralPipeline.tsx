import { useEffect, useState } from "react";

const stages = ["Discover", "Design", "Engineer", "Launch", "Learn"];
const colors = ["#67e8f9", "#a78bfa", "#f472b6", "#facc15", "#a3e635"];

export function NeuralPipeline() {
  const [tokens, setTokens] = useState<{ id: number; stage: number }[]>([]);

  useEffect(() => {
    let id = 0;
    const spawn = setInterval(() => {
      setTokens((prev) => [...prev, { id: id++, stage: 0 }].slice(-10));
    }, 700);
    const advance = setInterval(() => {
      setTokens((prev) =>
        prev
          .map((t) => ({ ...t, stage: t.stage + 1 }))
          .filter((t) => t.stage <= stages.length)
      );
    }, 600);
    return () => { clearInterval(spawn); clearInterval(advance); };
  }, []);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold">Neural Build Pipeline</h3>
        <span className="text-[11px] text-[#888]">tokens flowing → continuous learning loop</span>
      </div>

      <div className="relative">
        {/* track */}
        <div className="grid grid-cols-5 gap-2 relative z-10">
          {stages.map((s, i) => (
            <div key={s} className="text-center">
              <div
                className="mx-auto w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ background: `${colors[i]}22`, border: `2px solid ${colors[i]}`, color: colors[i] }}
              >
                {i + 1}
              </div>
              <div className="text-[11px] text-white mt-2 font-medium">{s}</div>
            </div>
          ))}
        </div>

        {/* connecting line */}
        <div className="absolute top-6 left-[10%] right-[10%] h-px bg-gradient-to-r from-[#67e8f9] via-[#f472b6] to-[#a3e635] opacity-40" />

        {/* tokens */}
        <div className="absolute top-4 left-0 right-0 h-8 pointer-events-none">
          {tokens.map((t) => {
            const pct = Math.min(100, (t.stage / (stages.length - 1)) * 100);
            const c = colors[Math.min(stages.length - 1, t.stage)];
            return (
              <div
                key={t.id}
                className="absolute w-2.5 h-2.5 rounded-full transition-all duration-600 ease-linear"
                style={{
                  left: `calc(${pct}% - 5px)`,
                  background: c,
                  boxShadow: `0 0 12px ${c}`,
                  top: `${(t.id % 3) * 6}px`,
                  opacity: t.stage >= stages.length ? 0 : 1,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* feedback loop arc */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-2 text-[11px] text-[#888]">
          <span className="w-8 h-px bg-[#a3e635]" />
          Feedback loop → retrain → ship → repeat
          <span className="w-8 h-px bg-[#a3e635]" />
        </span>
      </div>
    </div>
  );
}
