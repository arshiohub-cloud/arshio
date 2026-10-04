import { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { useInView } from "@/components/site/product/anim";

const target = [
  { axis: "Reasoning", v: 95 },
  { axis: "Vision", v: 90 },
  { axis: "Speech", v: 85 },
  { axis: "Agents", v: 98 },
  { axis: "RAG", v: 92 },
  { axis: "Automation", v: 96 },
  { axis: "Security", v: 88 },
  { axis: "Strategy", v: 94 },
];

export function CapabilityRadarChart() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [data, setData] = useState(target.map((d) => ({ ...d, v: 0 })));

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setData(target.map((d) => ({ ...d, v: d.v * eased })));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <div ref={ref} className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold rainbow-text">Full-Stack AI Capability Surface</h3>
      </div>
      <div className="glass-card p-6" style={{ height: 460 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
            <defs>
              <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#00D4FF" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <PolarGrid stroke="rgba(255,255,255,0.15)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              dataKey="v"
              stroke="#67e8f9"
              strokeWidth={2}
              fill="url(#radarFill)"
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
