import { useEffect, useState } from "react";

const ROWS = [
  { icon: "⚡", color: "#67e8f9", text: "Nova · Qualifying lead from acme.com · Running" },
  { icon: "✅", color: "#a3e635", text: "Atlas · Resolved ticket #5,291 · Complete" },
  { icon: "⚡", color: "#67e8f9", text: "Lex · Analyzing 212-page market report · Running" },
  { icon: "✅", color: "#a3e635", text: "Echo · Drafted follow-up to Series B prospect · Complete" },
  { icon: "⚠️", color: "#fbbf24", text: "Sentinel · Flagged $92,400 anomaly · Alert" },
];

export function AgentCommandCenter() {
  const [tick, setTick] = useState(0);
  const [count, setCount] = useState(2847);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const n = setInterval(() => setNow(new Date()), 1000);
    const i = setInterval(() => setTick((t) => t + 1), 4000);
    const c = setInterval(() => setCount((n) => n + Math.floor(Math.random() * 3) + 1), 1800);
    return () => { clearInterval(n); clearInterval(i); clearInterval(c); };
  }, []);

  const stamp = now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--";

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "#07070a", boxShadow: "0 0 60px rgba(124,58,237,0.12) inset" }}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-black/60">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] uppercase tracking-[0.2em] text-[#888]">Live Agent Command Center</span>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] text-[#a3e635]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse" /> LIVE
        </span>
      </div>
      <div className="p-5 font-mono text-[13px] space-y-2 min-h-[220px]">
        {ROWS.map((r, i) => {
          const visible = (tick + i) % ROWS.length;
          const opacity = visible === 0 ? 1 : visible === 1 ? 0.7 : visible === 2 ? 0.45 : 0.2;
          return (
            <div
              key={i}
              className="flex items-center gap-3 transition-all duration-700"
              style={{ opacity, transform: `translateX(${visible === 0 ? 0 : -4}px)` }}
            >
              <span style={{ color: r.color }}>{r.icon}</span>
              <span className="text-[#888]">[{stamp}]</span>
              <span className="text-white/90">{r.text}</span>
            </div>
          );
        })}
      </div>
      <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between bg-black/40">
        <span className="text-[11px] uppercase tracking-wider text-[#888]">Tasks completed today</span>
        <span className="font-mono text-xl font-bold text-[#a3e635] tabular-nums">{count.toLocaleString()}</span>
      </div>
    </div>
  );
}
