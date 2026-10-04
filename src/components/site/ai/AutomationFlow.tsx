import { useEffect, useState } from "react";
import { FileText, Brain, Database, Mail, CheckCircle2, Cog } from "lucide-react";

const nodes = [
  { Icon: FileText, label: "Document In", sub: "PDF · email · form", color: "#67e8f9" },
  { Icon: Brain, label: "LLM Extract", sub: "fields + intent", color: "#a78bfa" },
  { Icon: Database, label: "Enrich + RAG", sub: "lookup context", color: "#f472b6" },
  { Icon: Cog, label: "Decision", sub: "rules + policy", color: "#facc15" },
  { Icon: Mail, label: "Action", sub: "route · reply · log", color: "#a3e635" },
  { Icon: CheckCircle2, label: "Audit", sub: "trace + metrics", color: "#34d399" },
];

export function AutomationFlow() {
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(12489);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % nodes.length);
      setCount((c) => c + Math.floor(Math.random() * 7) + 1);
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold">AI Automation Pipeline</h3>
          <p className="text-xs text-[#888] mt-1">Live workflow our customers ship in &lt; 2 weeks</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-[#888]">Docs processed today</div>
          <div className="text-xl font-bold text-white tabular-nums">{count.toLocaleString()}</div>
        </div>
      </div>

      <div className="relative grid grid-cols-2 md:grid-cols-6 gap-3">
        {nodes.map((n, i) => {
          const isActive = i === active;
          const isPassed = i < active;
          return (
            <div key={n.label} className="relative">
              <div
                className="rounded-xl p-3 transition-all duration-500"
                style={{
                  background: isActive ? `${n.color}1f` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? n.color : "rgba(255,255,255,0.08)"}`,
                  transform: isActive ? "translateY(-3px)" : "translateY(0)",
                  boxShadow: isActive ? `0 0 24px ${n.color}55` : "none",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition"
                  style={{
                    background: `${n.color}22`,
                    border: `1px solid ${n.color}55`,
                  }}
                >
                  <n.Icon className="w-4 h-4" style={{ color: n.color }} />
                </div>
                <div className="text-[12px] font-semibold text-white leading-tight">{n.label}</div>
                <div className="text-[10px] text-[#888] mt-0.5">{n.sub}</div>
                {(isActive || isPassed) && (
                  <div className="mt-2 h-0.5 rounded-full overflow-hidden bg-white/5">
                    <div
                      className="h-full transition-all duration-700"
                      style={{ width: isActive ? "70%" : "100%", background: n.color }}
                    />
                  </div>
                )}
              </div>
              {i < nodes.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-3 h-px" style={{ background: i < active ? nodes[i].color : "rgba(255,255,255,0.1)" }} />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        {[
          { k: "Avg latency", v: "1.4s" },
          { k: "Accuracy", v: "98.6%" },
          { k: "Human in loop", v: "2%" },
        ].map((s) => (
          <div key={s.k} className="rounded-lg border border-white/10 bg-white/[0.02] py-2">
            <div className="text-[10px] uppercase tracking-wider text-[#888]">{s.k}</div>
            <div className="text-sm font-semibold text-white mt-0.5">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
