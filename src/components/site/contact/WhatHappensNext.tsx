const STEPS = [
  { emoji: "🗓️", text: "We confirm within 24 hours and schedule your free audit", accent: "#67e8f9" },
  { emoji: "🔍", text: "30-min call: we map your pain points to AI solutions", accent: "#a78bfa" },
  { emoji: "🚀", text: "You receive a prioritized AI roadmap — free, no strings", accent: "#a3e635" },
];

export function WhatHappensNext() {
  return (
    <section className="py-20 border-b border-white/5" style={{ background: "#000" }}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-2xl md:text-3xl font-bold rainbow-text mb-3">
          What Happens After You Reach Out
        </h2>
        <p className="text-center text-[#888] mb-12">A clear, three-step path from your message to your roadmap.</p>

        <div className="grid md:grid-cols-3 gap-5 relative">
          {/* connecting line on md+ */}
          <div
            className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(103,232,249,0.35) 20%, rgba(167,139,250,0.35) 50%, rgba(163,230,53,0.35) 80%, transparent)",
            }}
          />
          {STEPS.map((s, i) => (
            <div key={i} className="glass-card p-6 text-center relative">
              <div
                className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 relative z-10"
                style={{
                  background: `${s.accent}1f`,
                  border: `1px solid ${s.accent}55`,
                  boxShadow: `0 0 24px ${s.accent}33`,
                }}
              >
                {s.emoji}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: s.accent }}>
                Step {i + 1}
              </div>
              <p className="text-sm text-white/85 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
