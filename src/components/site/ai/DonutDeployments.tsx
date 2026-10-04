import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";

const data = [
  { name: "EdTech", value: 30, color: "#ef4444" },
  { name: "Agents", value: 25, color: "#f97316" },
  { name: "Real Estate", value: 15, color: "#facc15" },
  { name: "FinTech", value: 15, color: "#22c55e" },
  { name: "Healthcare", value: 10, color: "#3b82f6" },
  { name: "Other", value: 5, color: "#a855f7" },
];

const total = data.reduce((s, d) => s + d.value, 0);

function ActiveShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#050505"
        strokeWidth={2}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 14}
        outerRadius={outerRadius + 17}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.45}
      />
    </g>
  );
}

export function DonutDeployments() {
  const [active, setActive] = useState<number | null>(null);

  const center = useMemo(() => {
    if (active === null) {
      return { label: "Total", value: `${total}%`, sub: `${data.length} verticals`, color: "#67e8f9" };
    }
    const d = data[active];
    return { label: d.name, value: `${d.value}%`, sub: `of portfolio`, color: d.color };
  }, [active]);

  return (
    <div className="grid md:grid-cols-[1.1fr_1fr] gap-6 items-center">
      <div className="relative" style={{ width: "100%", height: 340 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={78}
              outerRadius={118}
              paddingAngle={3}
              stroke="#050505"
              strokeWidth={2}
              activeIndex={active ?? undefined}
              activeShape={ActiveShape}
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {data.map((d, i) => (
                <Cell
                  key={d.name}
                  fill={d.color}
                  opacity={active === null || active === i ? 1 : 0.32}
                  style={{ transition: "opacity 200ms ease, filter 200ms ease" }}
                />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
              contentStyle={{
                background: "rgba(10,10,10,0.95)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                fontSize: 12,
                color: "#fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                padding: "8px 12px",
              }}
              itemStyle={{ color: "#fff" }}
              formatter={(v: number, n: string) => [
                `${v}% (${Math.round((v / total) * data.length * 10) / 10} platforms)`,
                n,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-[10px] uppercase tracking-[0.18em] transition-colors"
            style={{ color: center.color }}
          >
            {center.label}
          </div>
          <div className="text-3xl font-bold text-white tabular-nums mt-1 transition-all">
            {center.value}
          </div>
          <div className="text-[10px] text-[#888] mt-1">{center.sub}</div>
        </div>
      </div>

      {/* Interactive legend */}
      <ul className="space-y-1.5">
        {data.map((d, i) => {
          const isActive = active === i;
          const dim = active !== null && !isActive;
          return (
            <li key={d.name}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="w-full flex items-center justify-between gap-4 text-sm rounded-lg px-3 py-2 transition-all"
                style={{
                  background: isActive ? `${d.color}1f` : "transparent",
                  border: `1px solid ${isActive ? d.color : "rgba(255,255,255,0.06)"}`,
                  opacity: dim ? 0.4 : 1,
                }}
              >
                <span className="flex items-center gap-3 text-white">
                  <span
                    className="w-3 h-3 rounded-full transition-transform"
                    style={{
                      background: d.color,
                      transform: isActive ? "scale(1.4)" : "scale(1)",
                      boxShadow: isActive ? `0 0 12px ${d.color}` : "none",
                    }}
                  />
                  <span className="font-medium">{d.name}</span>
                </span>
                <span
                  className="tabular-nums font-semibold"
                  style={{ color: isActive ? d.color : "#aaa" }}
                >
                  {d.value}%
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default DonutDeployments;
