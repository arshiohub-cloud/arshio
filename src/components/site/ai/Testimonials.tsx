import { Star } from "lucide-react";
import { FadeUp } from "@/components/site/product/anim";

const testimonials = [
  {
    quote:
      "InsightAI deployed our RAG copilot in 5 weeks. Our support team now handles 3× the ticket volume with the same headcount.",
    name: "VP of Operations",
    org: "Enterprise FinTech",
    accent: "#67e8f9",
  },
  {
    quote:
      "The research agent they built cut our due-diligence review from 3 weeks to 2 days. It's now core to every deal we do.",
    name: "Chief Strategy Officer",
    org: "Private Equity Firm",
    accent: "#a3e635",
  },
  {
    quote:
      "We started with a free audit call and had a working AI prototype in 2 weeks. The sandbox approach eliminated all our risk.",
    name: "CTO",
    org: "PropTech Startup",
    accent: "#f472b6",
  },
];

export function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {testimonials.map((t, i) => (
        <FadeUp key={t.name + t.org} delay={i * 120}>
          <div
            className="glass-card p-7 h-full flex flex-col"
            style={{ borderTop: `2px solid ${t.accent}` }}
          >
            <div className="flex gap-0.5 mb-4" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
              ))}
            </div>
            <p className="text-[15px] text-white/90 leading-relaxed flex-1">
              <span className="text-2xl leading-none mr-1" style={{ color: t.accent }}>“</span>
              {t.quote}
              <span className="text-2xl leading-none ml-0.5" style={{ color: t.accent }}>”</span>
            </p>
            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="text-sm text-white font-semibold">{t.name}</div>
              <div className="text-xs text-[#888]">{t.org}</div>
            </div>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
