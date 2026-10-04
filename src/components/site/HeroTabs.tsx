import { useState } from "react";

const tabs = [
  {
    key: "agents",
    label: "AI Agents",
    icon: "🤖",
    title: "Autonomous Workflow Agents",
    desc: "Task-specific AI agents that research, reason, update systems, and automate repetitive business operations.",
    tags: ["Agentic Ops", "Tool Calling", "Workflow AI", "Human Review"],
  },
  {
    key: "llm",
    label: "LLM Copilots",
    icon: "🧠",
    title: "Private Knowledge Copilots",
    desc: "Secure GPT-style assistants trained on your documents, data, policies, and customer workflows.",
    tags: ["RAG", "Enterprise Search", "Chat UX", "Guardrails"],
  },
  {
    key: "vision",
    label: "Vision AI",
    icon: "👁️",
    title: "Computer Vision Systems",
    desc: "Image, video, and document intelligence for inspection, real estate, healthcare, logistics, and compliance.",
    tags: ["OCR", "Video AI", "Defect Detection", "Multimodal"],
  },
  {
    key: "mlops",
    label: "AI Infrastructure",
    icon: "⚙️",
    title: "MLOps & Private AI Cloud",
    desc: "Production pipelines for model deployment, observability, evaluation, security, and cost control.",
    tags: ["Model Ops", "Eval Suites", "GPU Deploy", "Monitoring"],
  },
];

export function HeroTabs() {
  const [active, setActive] = useState(0);
  const t = tabs[active];

  return (
    <div className="mt-16">
      <div className="flex flex-wrap items-center justify-center gap-1 border-b border-white/5">
        {tabs.map((tab, i) => {
          const isActive = i === active;
          return (
            <button
              key={tab.key}
              onClick={() => setActive(i)}
              className="px-5 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px"
              style={{
                color: isActive ? "#ffffff" : "#888",
                borderBottomColor: isActive ? "#7c3aed" : "transparent",
                background: isActive ? "rgba(124,58,237,0.08)" : "transparent",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        key={t.key}
        className="glass-card mt-6 p-7 text-left mx-auto max-w-2xl"
        style={{ borderRadius: 16, animation: "fadeUp 0.3s ease-out forwards" }}
      >
        <div className="text-3xl mb-3">{t.icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{t.title}</h3>
        <p className="text-sm text-[#888] mb-4">{t.desc}</p>
        <div className="flex flex-wrap gap-2">
          {t.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-[3px] rounded-full"
              style={{
                background: "rgba(124,58,237,0.12)",
                color: "#a78bfa",
                border: "1px solid rgba(124,58,237,0.25)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
