import { Check } from "lucide-react";

export function CTABanner() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0d0020 0%, #1a0040 50%, #0d0020 100%)",
        borderTop: "1px solid rgba(124,58,237,0.3)",
        padding: "100px 0",
      }}
    >
      <div className="spotlight" />
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-white">
          Ready to Transform with{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #a78bfa, #6366f1)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            AI?
          </span>
        </h2>
        <p className="mt-5 text-[#888] max-w-2xl mx-auto">
          Join organizations using InsightAI to launch AI copilots, autonomous agents,
          vision systems, and workflow automation products.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <a href="#contact" className="btn-primary">Get Started Today</a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition"
            style={{
              border: "1px solid #7c3aed",
              color: "#a78bfa",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(124,58,237,0.15)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Schedule a Demo
          </a>
        </div>
        <div className="mt-10 flex items-center justify-center gap-x-8 gap-y-3 flex-wrap text-[13px] text-[#888]">
          {[
            "Response within 24 hours",
            "Free initial consultation",
            "Dedicated AI specialist assigned",
          ].map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <Check className="w-4 h-4" style={{ color: "#7c3aed" }} />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
