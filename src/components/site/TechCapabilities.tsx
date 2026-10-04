import { Zap, Brain, Cloud, Lock } from "lucide-react";
import { Section } from "./Section";

const cards = [
  {
    Icon: Zap,
    title: "Edge AI Processing",
    desc: "Real-time inference with minimal latency across all deployments.",
    badges: ["< 100ms latency", "GPU Accelerated"],
  },
  {
    Icon: Brain,
    title: "Deep Learning Models",
    desc: "State-of-the-art neural systems built from enterprise-grade data pipelines.",
    badges: ["99%+ Accuracy", "Custom Models"],
  },
  {
    Icon: Cloud,
    title: "Cloud & On-Premise",
    desc: "Flexible deployment — cloud, hybrid, or on-premise for full control.",
    badges: ["Multi-Cloud", "Auto-Scaling"],
  },
  {
    Icon: Lock,
    title: "Privacy-First Design",
    desc: "Built-in data anonymization, encrypted pipelines, and compliance-ready.",
    badges: ["GDPR Compliant", "Encrypted"],
  },
];

export function TechCapabilities() {
  return (
    <Section
      id="tech"
      title="Built on Cutting-Edge AI"
      subtitle="Enterprise-grade technology powering every InsightAI solution."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(({ Icon, title, desc, badges }) => (
          <div key={title} className="glass-card p-7 flex flex-col">
            <Icon className="w-8 h-8 mb-5" style={{ color: "#a78bfa" }} />
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-[#888] leading-relaxed flex-1">{desc}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {badges.map((b) => (
                <span
                  key={b}
                  className="text-[11px] px-2.5 py-[3px] rounded-md text-white"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
