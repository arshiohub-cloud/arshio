import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

export function EstimatorBannerCTA() {
  return (
    <section className="py-16 bg-transparent border-b border-white/5 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-gradient-to-r from-[#0b132b] via-[#131f37] to-[#0b132b] rounded-3xl border border-[#27e2c4]/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-[#27e2c4]/60 transition-all">
          {/* Ambient Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#27e2c4]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#27e2c4]/10 text-[#27e2c4] border border-[#27e2c4]/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Zero-Obligation Strategy Session
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              Have a Project in Mind? <br />
              <span className="text-[#27e2c4]">Get a Clear Scope & Proposal.</span>
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Tell us about your requirements. Receive a transparent technical roadmap, milestone timeline, and fixed-fee proposal within 24 hours.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-[#27e2c4] hover:bg-[#1fd6b9] shadow-lg shadow-[#27e2c4]/20 transition-all hover:scale-105"
            >
              Get Free Proposal <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-[#131f37] hover:bg-[#1a2948] border border-slate-700 transition-all"
            >
              View Pricing Tiers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
