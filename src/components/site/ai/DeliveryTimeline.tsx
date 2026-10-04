import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
} from "recharts";

const data = [
  { phase: "Audit", start: 0, duration: 1 },
  { phase: "Design", start: 1, duration: 2 },
  { phase: "Engineering", start: 2, duration: 3 },
  { phase: "Launch", start: 5, duration: 1 },
  { phase: "Optimize", start: 6, duration: 4 },
];

const milestones = [
  { x: 0.2, y: "Audit", label: "Free Audit (Day 1)" },
  { x: 2, y: "Design", label: "Architecture Sign-off (Wk 2)" },
  { x: 3, y: "Engineering", label: "First Demo (Wk 3)" },
  { x: 6, y: "Launch", label: "Production Launch (Wk 6)" },
  { x: 10, y: "Optimize", label: "First Retrain (Wk 10)" },
];

export function DeliveryTimeline() {
  return (
    <div
      className="rounded-2xl border p-4 sm:p-6"
      style={{
        background: "rgba(10,10,20,0.6)",
        borderColor: "rgba(108,99,255,0.25)",
        boxShadow: "0 0 40px rgba(108,99,255,0.08)",
      }}
    >
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 16, right: 24, left: 24, bottom: 16 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
            <XAxis
              type="number"
              domain={[0, 10]}
              ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              tick={{ fill: "#888", fontSize: 11 }}
              label={{ value: "Weeks", position: "insideBottom", offset: -4, fill: "#888", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              type="category"
              dataKey="phase"
              tick={{ fill: "#bbb", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              width={90}
            />
            <Tooltip
              contentStyle={{
                background: "#0a0a14",
                border: "1px solid rgba(108,99,255,0.4)",
                borderRadius: 8,
                fontSize: 12,
              }}
              cursor={{ fill: "rgba(108,99,255,0.05)" }}
              formatter={(value: number, name: string) =>
                name === "duration" ? [`${value} wk`, "Duration"] : [value, name]
              }
            />
            <Bar dataKey="start" stackId="a" fill="transparent" />
            <Bar
              dataKey="duration"
              stackId="a"
              fill="#6c63ff"
              radius={[4, 4, 4, 4]}
            />
            {milestones.map((m) => (
              <ReferenceDot
                key={m.label}
                x={m.x}
                y={m.y}
                r={6}
                fill="#67e8f9"
                stroke="#0a0a14"
                strokeWidth={2}
                ifOverflow="extendDomain"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[11px]">
        {milestones.map((m) => (
          <li key={m.label} className="flex items-center gap-2 text-[#bbb]">
            <span
              className="inline-block w-2.5 h-2.5 rotate-45"
              style={{ background: "#67e8f9", boxShadow: "0 0 8px #67e8f9" }}
            />
            {m.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
