import { useEffect, useRef, useState } from "react";

const LINES = [
  "[agent] ingesting context window… 4,096 tokens",
  "[rag] vector search hit · cosine 0.91",
  "[tool] crm.lookup(id=A-2391) → ok",
  "[planner] step 3/7 → draft response",
  "[guardrail] pii scrub pass · 0 leaks",
  "[vision] yolo-v9 detect · 4 objects · 12ms",
  "[llm] gemini-3-flash · 842 tokens · 1.2s",
  "[mlops] drift score 0.04 · stable",
  "[router] intent=billing · confidence 0.97",
  "[agent] tool=stripe.refund · approve?",
  "[embed] 512-d vector upserted → pgvector",
  "[copilot] response shipped · csat 4.8",
  "[audit] trace#9f3a logged · immutable",
  "[fleet] 18 agents online · 2.1k tasks/min",
];

export function DataStream({ height = 220, title = "Live AI Telemetry" }: { height?: number; title?: string }) {
  const [rows, setRows] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setRows((prev) => {
        const next = [...prev, `${new Date().toLocaleTimeString()}  ${LINES[i % LINES.length]}`];
        return next.slice(-40);
      });
      i++;
    }, 700);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [rows]);

  return (
    <div className="glass-card p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-white/70">{title}</span>
        </div>
        <span className="text-[10px] text-[#67e8f9] font-mono">● streaming</span>
      </div>
      <div
        ref={ref}
        className="font-mono text-[11px] leading-relaxed p-4 overflow-hidden"
        style={{ height, background: "linear-gradient(180deg,#000 0%,#050505 100%)" }}
      >
        {rows.map((r, i) => (
          <div
            key={i}
            className="text-[#8de8c8]"
            style={{ opacity: Math.max(0.3, 1 - (rows.length - i) * 0.06) }}
          >
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}
