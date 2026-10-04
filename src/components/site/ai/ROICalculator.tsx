import { useMemo, useState } from "react";
import { Calculator, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ROICalculator() {
  const [employees, setEmployees] = useState(50);
  const [hours, setHours] = useState(8);
  const [rate, setRate] = useState(45);
  const [automation, setAutomation] = useState(35);

  const result = useMemo(() => {
    const weeklyHoursSaved = employees * hours * (automation / 100);
    const annualHoursSaved = weeklyHoursSaved * 50;
    const annualSavings = annualHoursSaved * rate;
    return { annualHoursSaved, annualSavings, weeklyHoursSaved };
  }, [employees, hours, rate, automation]);

  // Breakdown: derived shares of total annual savings.
  const breakdown = useMemo(() => {
    const total = result.annualSavings;
    return [
      { name: "Labor Savings", value: Math.round(total * 0.52), color: "#67e8f9" },
      { name: "Error Reduction", value: Math.round(total * 0.18), color: "#a3e635" },
      { name: "Speed Gains", value: Math.round(total * 0.22), color: "#f472b6" },
      { name: "Tool Consolidation", value: Math.round(total * 0.08), color: "#fbbf24" },
    ];
  }, [result.annualSavings]);

  const Field = ({ label, value, min, max, step = 1, suffix, onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix: string; onChange: (n: number) => void }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs uppercase tracking-wider text-[#888]">{label}</label>
        <span className="text-sm text-white font-semibold tabular-nums">
          {value.toLocaleString()}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#67e8f9]"
      />
    </div>
  );

  return (
    <div className="glass-card p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-11 h-11 rounded-lg border border-[#a3e635]/30 bg-[#a3e635]/5 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-[#a3e635]" />
        </span>
        <div>
          <h3 className="text-white font-semibold text-lg">AI ROI Calculator</h3>
          <p className="text-xs text-[#888]">Estimate your annual savings from AI automation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <Field label="Team size" value={employees} min={5} max={1000} suffix="" onChange={setEmployees} />
          <Field label="Hours / week on manual work" value={hours} min={1} max={40} suffix=" hrs" onChange={setHours} />
          <Field label="Average hourly cost" value={rate} min={15} max={200} suffix=" /hr" onChange={setRate} />
          <Field label="AI automation rate" value={automation} min={10} max={80} suffix="%" onChange={setAutomation} />
        </div>
        <div className="rounded-xl p-6 flex flex-col justify-center" style={{ background: "radial-gradient(circle at top right, rgba(103,232,249,0.15), transparent), #050505", border: "1px solid rgba(103,232,249,0.2)" }}>
          <div className="text-xs uppercase tracking-wider text-[#67e8f9] flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" /> Projected Annual Impact
          </div>
          <div className="mt-4 text-4xl font-bold text-white tabular-nums">
            ${Math.round(result.annualSavings).toLocaleString()}
          </div>
          <div className="text-xs text-[#888] mt-1">in operational savings</div>
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[#888]">Hours saved / wk</div>
              <div className="text-lg font-semibold text-[#a3e635]">{Math.round(result.weeklyHoursSaved).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-[#888]">Hours saved / yr</div>
              <div className="text-lg font-semibold text-[#a3e635]">{Math.round(result.annualHoursSaved).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Savings breakdown chart — updates live as sliders move */}
      <div
        className="mt-8 rounded-xl p-6"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(163,230,53,0.08), transparent), #050505",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#a3e635]">Savings Breakdown</div>
            <div className="text-sm text-white/85 mt-1">Where the annual impact comes from</div>
          </div>
          <div className="text-xs text-[#888] tabular-nums">
            Total: <span className="text-white font-semibold">${Math.round(result.annualSavings).toLocaleString()}</span>
          </div>
        </div>
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={breakdown} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="name"
                stroke="#888"
                tick={{ fill: "#aaa", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <YAxis
                stroke="#888"
                tick={{ fill: "#aaa", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                }
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  background: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#fff" }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "Annual"]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive>
                {breakdown.map((b) => (
                  <Cell key={b.name} fill={b.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-white/5">
          <p className="text-sm text-[#aaa]">
            Book a call to validate this estimate for your team.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition"
            style={{
              border: "1px solid rgba(103,232,249,0.5)",
              color: "#67e8f9",
              background: "rgba(103,232,249,0.05)",
            }}
          >
            Get My AI ROI Report <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
