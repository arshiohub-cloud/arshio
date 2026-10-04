import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Activity, Brain, CheckCircle2, Cpu, Database, Globe, Mail, Send, Sparkles, Zap } from "lucide-react";
import { runAgentChat } from "@/lib/agent-chat.functions";

type Step = {
  icon: typeof Brain;
  label: string;
  detail: string;
  tone: "think" | "tool" | "done";
};

type Scenario = {
  agent: string;
  task: string;
  steps: Step[];
  answer?: string;
};

const scenarios: Scenario[] = [
  {
    agent: "Nova · Sales SDR",
    task: "Qualify lead from acme.com and book a meeting",
    steps: [
      { icon: Brain, label: "Reasoning", detail: "Parsing inbound signal & intent score…", tone: "think" },
      { icon: Globe, label: "Tool · Web", detail: "Enriching acme.com → 1,240 employees, Series C", tone: "tool" },
      { icon: Database, label: "Tool · CRM", detail: "Matched account · 3 prior touches found", tone: "tool" },
      { icon: Sparkles, label: "Generating", detail: "Drafting personalized outreach (v3)…", tone: "think" },
      { icon: CheckCircle2, label: "Action", detail: "Meeting booked · Tue 4:30 PM · CRM updated", tone: "done" },
    ],
  },
  {
    agent: "Lex · Research Analyst",
    task: "Summarize Q3 earnings across 12 fintech filings",
    steps: [
      { icon: Brain, label: "Planning", detail: "Decomposing into 4 parallel sub-queries…", tone: "think" },
      { icon: Database, label: "Tool · RAG", detail: "Indexed 1,847 pages · 312 citations ready", tone: "tool" },
      { icon: Cpu, label: "Reasoning", detail: "Cross-referencing NIM/CAC trends…", tone: "think" },
      { icon: Sparkles, label: "Synthesis", detail: "Composing audit-ready brief with citations", tone: "think" },
      { icon: CheckCircle2, label: "Delivered", detail: "12-page report · 47 sources · 6.2s", tone: "done" },
    ],
  },
  {
    agent: "Sentinel · Risk Agent",
    task: "Monitor 24h transaction stream for fraud signals",
    steps: [
      { icon: Activity, label: "Streaming", detail: "Ingesting 184,302 transactions / min", tone: "tool" },
      { icon: Brain, label: "Inference", detail: "Anomaly model flagged 7 outliers…", tone: "think" },
      { icon: Database, label: "Tool · Graph", detail: "Tracing entity links across 3 accounts", tone: "tool" },
      { icon: Zap, label: "Action", detail: "Auto-frozen 2 high-risk · escalating 5", tone: "done" },
      { icon: CheckCircle2, label: "Report", detail: "Investigation packet sent to compliance", tone: "done" },
    ],
  },
];

const toneColor: Record<Step["tone"], string> = {
  think: "#a78bfa",
  tool: "#22d3ee",
  done: "#84cc16",
};
function buildScenarioFromPrompt(prompt: string): Scenario {
  const p = prompt.toLowerCase();
  const steps: Step[] = [
    { icon: Brain, label: "Reasoning", detail: `Parsing intent → "${prompt.length > 64 ? prompt.slice(0, 61) + "…" : prompt}"`, tone: "think" },
  ];
  let answer = "";

  if (/news|article|headline|summari[sz]e/.test(p)) {
    steps.push({ icon: Globe, label: "Tool · Web", detail: "Fetching 38 sources across 7 outlets…", tone: "tool" });
    steps.push({ icon: Cpu, label: "Synthesis", detail: "Clustering topics · ranking by relevance", tone: "think" });
    answer = "Top 3 themes today: (1) Fed signals rate hold into Q4, (2) NVIDIA unveils next-gen inference chip, (3) EU AI Act enforcement begins. Full digest with 38 cited sources ready.";
  } else if (/email|inbox|mail|calendar|schedule|meeting/.test(p)) {
    steps.push({ icon: Mail, label: "Tool · Inbox", detail: "Scanning 142 unread · 9 priority threads", tone: "tool" });
    steps.push({ icon: Sparkles, label: "Drafting", detail: "Composing replies · proposing time slots", tone: "think" });
    answer = "Triaged 142 emails → 9 priority, 23 drafted replies, 4 meetings auto-scheduled for this week. 106 archived. Your inbox is at zero.";
  } else if (/fraud|risk|anomal|transaction|compliance/.test(p)) {
    steps.push({ icon: Activity, label: "Streaming", detail: "Scoring 24,118 events in last 60s…", tone: "tool" });
    steps.push({ icon: Database, label: "Tool · Graph", detail: "Linking 4 suspicious entities across accounts", tone: "tool" });
    answer = "Flagged 6 high-risk events (likelihood > 0.92). Auto-froze 2 accounts; 4 escalated to compliance with full evidence packet and entity graph attached.";
  } else if (/lead|sales|prospect|crm|outreach/.test(p)) {
    steps.push({ icon: Globe, label: "Tool · Web", detail: "Enriching 217 accounts · filtering ICP fit", tone: "tool" });
    steps.push({ icon: Database, label: "Tool · CRM", detail: "Deduping · syncing 38 qualified leads", tone: "tool" });
    answer = "38 ICP-fit leads identified (avg score 87/100). Personalized outreach drafted for each, synced to CRM with recommended next-best-action.";
  } else if (/research|report|paper|document|pdf|analy[sz]e/.test(p)) {
    steps.push({ icon: Database, label: "Tool · RAG", detail: "Indexed 1,204 pages · 86 citations ready", tone: "tool" });
    steps.push({ icon: Cpu, label: "Reasoning", detail: "Cross-referencing claims & sources", tone: "think" });
    answer = "Synthesized findings across 1,204 pages: 5 core insights, 3 contradicting claims surfaced, 86 citations linked. Audit-ready brief delivered.";
  } else {
    steps.push({ icon: Globe, label: "Tool · Web", detail: "Searching the web for relevant context…", tone: "tool" });
    steps.push({ icon: Database, label: "Tool · Memory", detail: "Pulling 12 related items from knowledge base", tone: "tool" });
    steps.push({ icon: Cpu, label: "Planning", detail: "Decomposing task into 3 sub-actions", tone: "think" });
    answer = `Plan executed for "${prompt.length > 80 ? prompt.slice(0, 77) + "…" : prompt}". 3 sub-actions completed, results compiled with 12 supporting references. Ready for your review.`;
  }

  steps.push({ icon: Zap, label: "Action", detail: "Executing plan · invoking downstream tools", tone: "done" });
  steps.push({ icon: CheckCircle2, label: "Delivered", detail: "Task complete · results ready for review", tone: "done" });

  return { agent: "Custom Agent", task: prompt, steps, answer };
}



export function AgentDemo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [customScenario, setCustomScenario] = useState<Scenario | null>(null);
  const [prompt, setPrompt] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const callAgent = useServerFn(runAgentChat);

  const scenario = customScenario ?? scenarios[scenarioIdx];
  const totalSteps = scenario.steps.length;

  useEffect(() => {
    const t = setTimeout(() => {
      if (stepIdx < totalSteps - 1) {
        setStepIdx(stepIdx + 1);
      } else {
        // Hold custom scenarios until the user starts another one
        if (customScenario) return;
        setTimeout(() => {
          setStepIdx(0);
          setScenarioIdx((scenarioIdx + 1) % scenarios.length);
        }, 1800);
      }
    }, 1100);
    return () => clearTimeout(t);
  }, [stepIdx, scenarioIdx, totalSteps, customScenario]);

  const visibleSteps = scenario.steps.slice(0, stepIdx + 1);
  const isDone = stepIdx === totalSteps - 1;

  const runPrompt = async (text: string) => {
    setCustomScenario(buildScenarioFromPrompt(text));
    setStepIdx(0);
    setAiAnswer(null);
    setAiLoading(true);
    try {
      const res = await callAgent({ data: { prompt: text } });
      setAiAnswer(res.answer);
    } catch (err) {
      setAiAnswer(err instanceof Error ? `Agent error: ${err.message}` : "Agent error");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setPrompt("");
    void runPrompt(trimmed);
  };



  return (
    <div className="glass-card relative overflow-hidden p-0 mb-12">
      {/* glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(600px circle at 20% 20%, rgba(167,139,250,0.18), transparent 60%), radial-gradient(500px circle at 85% 80%, rgba(34,211,238,0.15), transparent 60%)",
        }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-0">
        {/* LEFT — Neural orb visualization */}
        <div className="relative flex flex-col items-center justify-center p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/10 min-h-[420px]">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/60">Live Agent Stream</span>
          </div>

          <NeuralOrb active={aiLoading || !isDone} />

          <div className="mt-6 text-center">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/50">Now running</div>
            <div className="mt-1 text-white font-semibold text-lg">{scenario.agent}</div>
            <div className="mt-1 text-sm text-white/60 max-w-sm">{scenario.task}</div>
          </div>

          {/* progress bar */}
          <div className="mt-6 w-full max-w-xs h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: `${((stepIdx + 1) / totalSteps) * 100}%`,
                background: "linear-gradient(90deg, #a78bfa, #22d3ee, #84cc16)",
              }}
            />
          </div>
        </div>

        {/* RIGHT — Reasoning trace */}
        <div className="p-6 lg:p-8 font-mono text-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-[11px] uppercase tracking-wide text-white/40">agent.trace</span>
            </div>
            <span className="text-[10px] text-white/40">step {stepIdx + 1}/{totalSteps}</span>
          </div>

          <div className="space-y-2.5 min-h-[300px]">
            {visibleSteps.map((s, i) => {
              const Icon = s.icon;
              const isLast = i === visibleSteps.length - 1;
              return (
                <div
                  key={`${scenarioIdx}-${i}`}
                  className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
                  style={{
                    animation: "agentRowIn 0.45s ease-out both",
                  }}
                >
                  <span
                    className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center"
                    style={{
                      background: `${toneColor[s.tone]}1a`,
                      border: `1px solid ${toneColor[s.tone]}55`,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: toneColor[s.tone] }} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wide" style={{ color: toneColor[s.tone] }}>
                        {s.label}
                      </span>
                      {isLast && !isDone && (
                        <span className="inline-flex gap-1">
                          <span className="w-1 h-1 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1 h-1 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1 h-1 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </span>
                      )}
                    </div>
                    <div className="text-white/85 text-[13px] mt-0.5 leading-snug truncate">{s.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {customScenario && (aiLoading || aiAnswer) && (
            <div
              className="mt-4 rounded-lg p-3.5 font-sans"
              style={{
                background: "linear-gradient(135deg, rgba(132,204,22,0.08), rgba(34,211,238,0.06))",
                border: "1px solid rgba(132,204,22,0.35)",
                animation: "agentRowIn 0.5s ease-out both",
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#84cc16" }} />
                <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#84cc16" }}>
                  Agent answer {aiLoading ? "· thinking…" : "· live"}
                </span>
              </div>
              {aiLoading && !aiAnswer ? (
                <div className="flex items-center gap-1.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              ) : (
                <p className="text-[13px] text-white/90 leading-relaxed whitespace-pre-wrap">{aiAnswer}</p>
              )}
            </div>
          )}



          {/* Chat input */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-2 font-sans">
              <Send className="w-3 h-3 text-white/50" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">Try it · type a prompt</span>
            </div>
          <form onSubmit={handleSubmit} className="flex items-center gap-2 font-sans">
            <div className="relative flex-1">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask the agent… e.g. 'Find top fintech leads in London'"
                className="w-full rounded-lg bg-white/[0.04] border border-white/15 focus:border-white/40 focus:outline-none text-white placeholder:text-white/35 text-sm px-3.5 py-2.5 pr-11 transition"
              />
              <button
                type="submit"
                disabled={!prompt.trim()}
                aria-label="Run agent"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition"
                style={{
                  background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
                  color: "#0a0a0a",
                }}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
          <div className="mt-3 font-sans">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 mb-1.5">Try a demo prompt</div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Summarize today's top AI news",
                "Triage my inbox and draft replies",
                "Detect fraud in recent transactions",
                "Find top fintech leads in London",
                "Research the EV market in India",
                "Analyze this quarter's sales pipeline",
                "Draft a follow-up to a Series B prospect",
                "Compare GPT-5 vs Gemini 3 for enterprise RAG",
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void runPrompt(s)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-white/15 bg-white/[0.03] text-white/65 hover:text-white hover:border-white/35 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>


      <style>{`
        @keyframes agentRowIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}


function AICharacter({ state }: { state: "idle" | "thinking" | "talking" }) {
  const eyeGlow = state === "thinking" ? "#a78bfa" : state === "talking" ? "#22d3ee" : "#84cc16";
  const mouthAnim =
    state === "thinking"
      ? "mouthThink 1.2s ease-in-out infinite"
      : state === "talking"
        ? "mouthTalk 0.45s ease-in-out infinite"
        : "mouthIdle 4s ease-in-out infinite";

  return (
    <div className="relative w-56 h-56 select-none" style={{ animation: "charFloat 4.5s ease-in-out infinite" }}>
      {/* aura */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 50% 55%, ${eyeGlow}33, transparent 65%)`,
          filter: "blur(10px)",
          animation: "auraPulse 3s ease-in-out infinite",
        }}
      />
      {/* orbiting particles */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" style={{ animation: "orbSpin 10s linear infinite" }}>
        {[0, 90, 180, 270].map((deg) => {
          const r = 92;
          const x = 100 + r * Math.cos((deg * Math.PI) / 180);
          const y = 100 + r * Math.sin((deg * Math.PI) / 180);
          return <circle key={deg} cx={x} cy={y} r="2.5" fill={eyeGlow} opacity="0.85" />;
        })}
      </svg>

      {/* character body */}
      <svg viewBox="0 0 200 200" className="relative w-full h-full drop-shadow-[0_10px_30px_rgba(167,139,250,0.35)]">
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <radialGradient id="cheekGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={eyeGlow} stopOpacity="0.55" />
            <stop offset="100%" stopColor={eyeGlow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="visorGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* antenna */}
        <line x1="100" y1="38" x2="100" y2="22" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="100" cy="18" r="5" fill={eyeGlow}>
          <animate attributeName="r" values="4;6;4" dur="1.4s" repeatCount="indefinite" />
        </circle>

        {/* head */}
        <rect x="48" y="40" width="104" height="92" rx="32" fill="url(#bodyGrad)" stroke="#cbd5e1" strokeWidth="1.5" />

        {/* visor / face screen */}
        <rect x="60" y="60" width="80" height="44" rx="18" fill="url(#visorGrad)" />
        <rect x="60" y="60" width="80" height="44" rx="18" fill="none" stroke={eyeGlow} strokeWidth="1.2" opacity="0.6" />

        {/* eyes */}
        <g style={{ animation: "blink 4.2s ease-in-out infinite", transformOrigin: "100px 82px" }}>
          <circle cx="84" cy="82" r="6" fill={eyeGlow}>
            <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="116" cy="82" r="6" fill={eyeGlow}>
            <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* eye shine */}
          <circle cx="86" cy="80" r="1.6" fill="#ffffff" />
          <circle cx="118" cy="80" r="1.6" fill="#ffffff" />
        </g>

        {/* cheeks */}
        <circle cx="66" cy="112" r="8" fill="url(#cheekGrad)" />
        <circle cx="134" cy="112" r="8" fill="url(#cheekGrad)" />

        {/* mouth */}
        <g style={{ animation: mouthAnim, transformOrigin: "100px 118px" }}>
          {state === "thinking" ? (
            <circle cx="100" cy="118" r="3" fill={eyeGlow} />
          ) : (
            <rect x="92" y="115" width="16" height="6" rx="3" fill={eyeGlow} />
          )}
        </g>

        {/* body */}
        <rect x="68" y="132" width="64" height="42" rx="16" fill="url(#bodyGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
        {/* chest light */}
        <circle cx="100" cy="153" r="6" fill={eyeGlow}>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.6s" repeatCount="indefinite" />
        </circle>

        {/* arms */}
        <rect x="40" y="138" width="22" height="10" rx="5" fill="url(#bodyGrad)" stroke="#cbd5e1" strokeWidth="1.2" />
        <rect x="138" y="138" width="22" height="10" rx="5" fill="url(#bodyGrad)" stroke="#cbd5e1" strokeWidth="1.2" />
      </svg>

      <style>{`
        @keyframes charFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes auraPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes mouthIdle {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.9); }
        }
        @keyframes mouthTalk {
          0%, 100% { transform: scaleY(0.6); }
          50% { transform: scaleY(1.4); }
        }
        @keyframes mouthThink {
          0%, 100% { transform: translateX(-3px) scale(0.9); }
          50% { transform: translateX(3px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

function NeuralOrb({ active }: { active: boolean }) {
  return (
    <div className="relative w-56 h-56">
      {/* outer rotating ring */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" style={{ animation: "orbSpin 18s linear infinite" }}>
        <defs>
          <linearGradient id="ring1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#84cc16" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="92" fill="none" stroke="url(#ring1)" strokeWidth="1.2" strokeDasharray="4 8" opacity="0.7" />
      </svg>
      {/* mid counter ring */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" style={{ animation: "orbSpinR 12s linear infinite" }}>
        <circle cx="100" cy="100" r="74" fill="none" stroke="#22d3ee" strokeWidth="0.8" strokeDasharray="2 6" opacity="0.5" />
        <circle cx="100" cy="8" r="2.5" fill="#22d3ee" />
        <circle cx="100" cy="192" r="2" fill="#a78bfa" />
      </svg>
      {/* inner pulse */}
      <div
        className="absolute inset-0 m-auto rounded-full"
        style={{
          width: "60%",
          height: "60%",
          background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9), rgba(167,139,250,0.6) 30%, rgba(34,211,238,0.4) 60%, rgba(0,0,0,0.0) 80%)",
          filter: "blur(0.3px)",
          animation: active ? "orbPulse 2.2s ease-in-out infinite" : "none",
          boxShadow: "0 0 60px rgba(167,139,250,0.55), 0 0 120px rgba(34,211,238,0.35) inset",
        }}
      />
      {/* core */}
      <div
        className="absolute inset-0 m-auto rounded-full"
        style={{
          width: "22%",
          height: "22%",
          background: "radial-gradient(circle, #ffffff, #a78bfa 60%, #4c1d95 100%)",
          boxShadow: "0 0 30px rgba(255,255,255,0.7)",
        }}
      />
      {/* orbiting nodes */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" style={{ animation: "orbSpin 8s linear infinite" }}>
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const r = 88;
          const x = 100 + r * Math.cos((deg * Math.PI) / 180);
          const y = 100 + r * Math.sin((deg * Math.PI) / 180);
          return <circle key={deg} cx={x} cy={y} r="3" fill="#ffffff" opacity="0.85" />;
        })}
      </svg>

      <style>{`
        @keyframes orbSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbSpinR { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
