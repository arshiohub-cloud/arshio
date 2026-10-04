import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Navbar } from "@/components/site/Navbar";
import { PortfolioShowcase } from "@/components/site/PortfolioShowcase";
import { EstimatorBannerCTA } from "@/components/site/EstimatorBannerCTA";
import { Footer } from "@/components/site/Footer";
import { AmbientBackground } from "@/components/site/AmbientBackground";
import { Sparkles, ArrowRight, Award, ShieldCheck, CheckCircle2, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio & Case Studies — Custom ERP, Web & Mobile Apps | Arshio" },
      { name: "description", content: "Explore Arshio's real-world client case studies in Custom ERP Software, Next.js Web Dev, React Native Mobile Apps, UI/UX Design, Motion Reels, and Performance Marketing." },
      { property: "og:title", content: "Client Case Studies & Portfolio — Arshio Digital Agency" },
      { property: "og:description", content: "Custom ERP/CRM, Web Dev, Mobile Apps, UI/UX, Video Reels, Digital Marketing." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <div className="relative min-h-screen bg-[#070d1e] text-white overflow-hidden">
      {/* Universal Floating Ambient Mesh Gradient Aurora */}
      <AmbientBackground />

      <div className="relative z-10">
        <TopBar />
        <Navbar />

        <main>
          {/* Page Hero */}
          <section className="relative py-20 md:py-28 bg-[#070d1e] border-b border-slate-800/80 overflow-hidden text-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" /> Proven Engineering & Creative Deliverables
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Engineering Value. <br />
                <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">
                  Delivering Measurable Impact.
                </span>
              </h1>
              <p className="mt-5 text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                Explore our portfolio of bespoke ERP platforms, high-converting web stores, cross-platform mobile apps, viral video reels, and performance growth campaigns.
              </p>

              {/* Agency Stats Bar */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[#0b132b]/80 backdrop-blur-xl rounded-2xl border border-slate-800 text-left">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4] shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white">50+</div>
                    <div className="text-xs text-slate-400">Projects Delivered</div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white">99.2%</div>
                    <div className="text-xs text-slate-400">On-Time SLA</div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4] shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white">4.9 / 5.0</div>
                    <div className="text-xs text-slate-400">Client Rating</div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4] shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white">$15M+</div>
                    <div className="text-xs text-slate-400">Client Revenue Impact</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Portfolio Showcase Grid & Case Studies */}
          <PortfolioShowcase isPreview={false} />

          {/* Instant Cost Estimator Banner CTA */}
          <EstimatorBannerCTA />
        </main>

        <Footer />
      </div>
    </div>
  );
}
