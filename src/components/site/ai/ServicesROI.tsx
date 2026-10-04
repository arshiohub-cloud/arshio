import { useMemo, useState } from "react";
import { Calculator, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function ServicesROI() {
  const [team, setTeam] = useState(75);
  const [hours, setHours] = useState(10);
  const [rate, setRate] = useState(45);
  const [automation, setAutomation] = useState(60);

  const data = useMemo(() => {
    const weeklyHoursSaved = team * hours * (automation / 100);
    const annualHoursSaved = weeklyHoursSaved * 50;
    const labor = annualHoursSaved * rate;
    const errors = labor * 0.18;
    const speed = labor * 0.25;
    const tools = team * 240;
    const total = labor + errors + speed + tools;
    return {
      weeklyHoursSaved,
      annualHoursSaved,
      total,
      chart: [
        { name: "Labor Savings", value: Math.round(labor), color: "#a78bfa" },
        { name: "Error Reduction", value: Math.round(errors), color: "#67e8f9" },
        { name: "Speed-to-Revenue", value: Math.round(speed), color: "#a3e635" },
        { name: "Tool Savings", value: Math.round(tools), color: "#f472b6" },
      ],
    };
  }, [team, hours, rate, automation]);

  const Field = ({
    label, value, min, max, step = 1, suffix, onChange,
  }: { label: string; value: number; min: number; max: number; step?: number; suffix: string; onChange: (n: number) => void }) => (
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
        className="w-full accent-[#a78bfa]"
      />
    </div>
  );

  return (
    <div className="glass-card p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-11 h-11 rounded-lg border border-[#a78bfa]/30 bg-[#a78bfa]/5 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-[#a78bfa]" />
        </span>
        <div>
          <h3 className="text-white font-semibold text-lg">Model Your AI ROI</h3>
          <p className="text-xs text-[#888]">Real-time estimate of annual savings from AI automation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <Field label="Team size" value={team} min={10} max={500} suffix="" onChange={setTeam} />
          <Field label="Hours / week on manual tasks" value={hours} min={2} max={40} suffix=" hrs" onChange={setHours} />
          <Field label="Avg hourly cost" value={rate} min={15} max={200} suffix=" /hr" onChange={setRate} />
          <Field label="Automation rate" value={automation} min={20} max={80} suffix="%" onChange={setAutomation} />
        </div>
        <div
          className="rounded-xl p-6 flex flex-col justify-center"
          style={{ background: "radial-gradient(circle at top right, rgba(167,139,250,0.18), transparent), #050505", border: "1px solid rgba(167,139,250,0.25)" }}
        >
          <div className="text-xs uppercase tracking-wider text-[#a78bfa] flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" /> Projected Annual Savings
          </div>
          <div className="mt-3 text-4xl font-bold text-white tabular-nums">
            ${Math.round(data.total).toLocaleString()}
          </div>
          <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[#888]">Hours saved / week</div>
              <div className="text-lg font-semibold text-[#a3e635]">{Math.round(data.weeklyHoursSaved).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-[#888]">Hours saved / year</div>
              <div className="text-lg font-semibold text-[#a3e635]">{Math.round(data.annualHoursSaved).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="text-xs uppercase tracking-wider text-[#888] mb-3">Savings breakdown</div>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={data.chart} margin={{ top: 10, right: 12, left: 0, bottom: 4 }}>
              <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 11 }} axisLine={{ stroke: "#222" }} tickLine={false} />
              <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={{ stroke: "#222" }} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{ background: "#0a0a0a", border: "1px solid #222", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "Annual"]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.chart.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
