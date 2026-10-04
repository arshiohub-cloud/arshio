import { Compass, Hammer, PackageCheck, ArrowRight } from "lucide-react";

const STEPS = [
  {
    Icon: Compass,
    accent: "#67e8f9",
    step: "01",
    label: "Audit",
    price: "Free · 30 min",
    title: "We map your workflows to AI opportunities.",
    bullets: ["Live workflow review", "Top 3 quick-win use cases", "90-day roadmap you keep"],
  },
  {
    Icon: Hammer,
    accent: "#a78bfa",
    step: "02",
    label: "Build",
    price: "From $6k · 2–6 wks",
    title: "We ship the first agent, copilot, or RAG system.",
    bullets: ["Weekly production demos", "Human-approval guardrails", "Evals + telemetry from day one"],
  },
  {
    Icon: PackageCheck,
    accent: "#34d399",
    step: "03",
    label: "Handover",
    price: "Yours to own",
    title: "You keep the code, prompts, evals, and playbooks.",
    bullets: ["Full source + docs", "Team training included", "Optional ongoing SLA"],
  },
];

export function HowWeEngage() {
  return (
    <section
      id="engage"
      className="relative border-b border-white/5 py-20 md:py-24"
      style={{ background: "#000" }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <header className="max-w-2xl mb-12">
          <span className="text-[11px] uppercase tracking-[0.28em] font-semibold" style={{ color: "#67e8f9" }}>
            How we engage
          </span>
          <h2
            className="mt-3 font-semibold tracking-tight text-white"
            style={{ fontSize: "clamp(26px, 3.4vw, 40px)", lineHeight: 1.1 }}
          >
            Three steps. No mystery.{" "}
            <span className="text-white/50">Start with a free audit.</span>
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map(({ Icon, accent, step, label, price, title, bullets }) => (
            <div
              key={step}
              className="relative p-6 rounded-xl"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}88, transparent)` }}
              />
              <div className="flex items-center justify-between mb-6">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${accent}22, ${accent}05)`,
                    border: `1px solid ${accent}40`,
                  }}
                >
                  <Icon size={20} color={accent} />
                </div>
                <span
                  className="text-[10px] tracking-[0.28em] font-mono font-semibold"
                  style={{ color: accent }}
                >
                  {step} · {label.toUpperCase()}
                </span>
              </div>

              <div
                className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-2"
                style={{ color: accent }}
              >
                {price}
              </div>
              <h3 className="text-white font-semibold text-[16px] leading-snug mb-4">
                {title}
              </h3>

              <ul className="space-y-2">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-[#a5a5b3]">
                    <span
                      className="mt-[7px] w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: accent }}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-semibold text-black transition hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(90deg, #a78bfa, #67e8f9)",
              boxShadow: "0 12px 32px -10px #a78bfa",
            }}
          >
            Book your free AI audit <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
