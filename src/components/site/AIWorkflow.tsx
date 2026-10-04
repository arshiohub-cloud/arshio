import { Database, Brain, Workflow, Mail, BarChart3, Zap, ArrowRight, Sparkles } from "lucide-react";
import { Section } from "./Section";

type Node = {
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
};

const inputs: Node[] = [
  { label: "Data Sources", sub: "APIs · DBs · Docs", icon: Database, color: "#60a5fa" },
  { label: "User Trigger", sub: "Chat · Webhook · Cron", icon: Zap, color: "#f59e0b" },
];

const tools: Node[] = [
  { label: "Workflow Engine", sub: "Multi-step orchestration", icon: Workflow, color: "#34d399" },
  { label: "Comms & Email", sub: "Send · Notify · Respond", icon: Mail, color: "#f472b6" },
  { label: "Analytics Out", sub: "Insights · Dashboards", icon: BarChart3, color: "#a78bfa" },
];

export function AIWorkflow() {
  return (
    <Section
      id="ai-workflow"
      bg="#050505"
      title="AI Automation Workflow"
      subtitle="From raw data and triggers to autonomous decisions and business outcomes — a glimpse of the AI-integrated pipelines we build for our clients."
    >
      <style>{`
        @keyframes wf-dash { to { stroke-dashoffset: -40; } }
        @keyframes wf-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes wf-glow {
          0%, 100% { box-shadow: 0 0 40px 0 rgba(167,139,250,0.45), inset 0 0 30px rgba(167,139,250,0.15); }
          50% { box-shadow: 0 0 70px 10px rgba(167,139,250,0.75), inset 0 0 40px rgba(167,139,250,0.25); }
        }
        @keyframes wf-spin { to { transform: rotate(360deg); } }
        @keyframes wf-float-particle {
          0% { transform: translate(0,0); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: var(--end-translate); opacity: 0; }
        }
        .wf-flow-line { stroke-dasharray: 6 8; animation: wf-dash 1.4s linear infinite; }
        .wf-brain-ring {
          position: absolute; inset: -14px; border-radius: 9999px;
          border: 1px dashed rgba(167,139,250,0.45);
          animation: wf-spin 18s linear infinite;
        }
        .wf-brain-ring-2 {
          position: absolute; inset: -28px; border-radius: 9999px;
          border: 1px dashed rgba(99,102,241,0.3);
          animation: wf-spin 28s linear infinite reverse;
        }
        .wf-node { transition: transform .3s ease, border-color .3s ease; }
        .wf-node:hover { transform: translateY(-3px); }
      `}</style>

      <div className="relative">
        {/* Background grid glow */}
        <div
          className="absolute inset-0 -z-10 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.18), transparent 60%)",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-2 items-center">
          {/* LEFT — Inputs */}
          <div className="flex flex-col gap-4">
            {inputs.map((n) => (
              <NodeCard key={n.label} node={n} align="left" />
            ))}
          </div>

          {/* CENTER — AI Brain + connectors */}
          <div className="relative flex items-center justify-center py-12 lg:py-0">
            {/* Connector SVG — only on lg+ */}
            <svg
              className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 400 400"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="wfg" x1="0" x2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {/* Incoming lines */}
              <path d="M0,110 C120,110 140,200 200,200" fill="none" stroke="url(#wfg)" strokeWidth="1.5" className="wf-flow-line" />
              <path d="M0,290 C120,290 140,200 200,200" fill="none" stroke="url(#wfg)" strokeWidth="1.5" className="wf-flow-line" />
              {/* Outgoing lines */}
              <path d="M200,200 C260,200 280,70 400,70" fill="none" stroke="url(#wfg)" strokeWidth="1.5" className="wf-flow-line" />
              <path d="M200,200 C260,200 280,200 400,200" fill="none" stroke="url(#wfg)" strokeWidth="1.5" className="wf-flow-line" />
              <path d="M200,200 C260,200 280,330 400,330" fill="none" stroke="url(#wfg)" strokeWidth="1.5" className="wf-flow-line" />
            </svg>

            {/* Brain */}
            <div className="relative">
              <div className="wf-brain-ring" />
              <div className="wf-brain-ring-2" />
              <div
                className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center text-center"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #2a0a5e 0%, #0d0020 70%)",
                  border: "1px solid rgba(167,139,250,0.5)",
                  animation: "wf-glow 3.4s ease-in-out infinite",
                }}
              >
                <Brain className="w-10 h-10 text-white mb-2" />
                <div className="text-white font-semibold text-sm">AI Core</div>
                <div className="text-[10px] uppercase tracking-wider text-white/60 mt-1">
                  LLM · RAG · Agents
                </div>
                <div
                  className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1"
                  style={{
                    background: "rgba(34,197,94,0.15)",
                    color: "#4ade80",
                    border: "1px solid rgba(34,197,94,0.4)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" style={{ animation: "wf-pulse 1.6s ease-in-out infinite" }} />
                  LIVE
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Outputs / Tools */}
          <div className="flex flex-col gap-4">
            {tools.map((n) => (
              <NodeCard key={n.label} node={n} align="right" />
            ))}
          </div>
        </div>

        {/* Live metrics strip */}
        <div
          className="mt-10 rounded-xl border border-white/10 px-5 py-3 font-mono text-[12px] flex flex-wrap items-center justify-center gap-x-6 gap-y-1"
          style={{ background: "rgba(0,0,0,0.6)", color: "rgba(74,222,128,0.85)" }}
        >
          <span>Docs processed today: <span className="text-white">12,489</span></span>
          <span className="text-white/20">·</span>
          <span>Avg latency: <span className="text-white">1.4s</span></span>
          <span className="text-white/20">·</span>
          <span>Accuracy: <span className="text-white">98.6%</span></span>
          <span className="text-white/20">·</span>
          <span>Human review rate: <span className="text-white">2%</span></span>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/contact" className="btn-primary inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Automate Your Workflow
          </a>
          <a href="#services" className="btn-secondary inline-flex items-center gap-2">
            Explore AI Services <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </Section>
  );
}

function NodeCard({ node, align }: { node: Node; align: "left" | "right" }) {
  const Icon = node.icon;
  return (
    <div
      className={`wf-node glass-card p-4 flex items-center gap-3 ${
        align === "right" ? "flex-row" : "flex-row"
      }`}
      style={{ borderColor: `${node.color}33` }}
    >
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 relative"
        style={{
          background: `linear-gradient(135deg, ${node.color}22, ${node.color}08)`,
          border: `1px solid ${node.color}55`,
        }}
      >
        <Icon className="w-5 h-5" style={{ color: node.color }} />
        <span
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
          style={{ background: node.color, animation: "wf-pulse 2s ease-in-out infinite" }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-semibold leading-tight">{node.label}</div>
        <div className="text-[11px] text-white/55 mt-0.5">{node.sub}</div>
      </div>
    </div>
  );
}
