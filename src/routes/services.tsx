import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SERVICES } from "@/data/services";
import { EstimatorBannerCTA } from "@/components/site/EstimatorBannerCTA";
import { ContactForm } from "@/components/site/ContactForm";
import { AmbientBackground } from "@/components/site/AmbientBackground";
import { ArrowRight, Check, Sparkles, ShieldCheck, Layers, FileCode, Clock } from "lucide-react";

// Tech stack mappings for each service pillar to eliminate generic AI vibe
const SERVICE_TECH_STACK: { [key: string]: string[] } = {
  "custom-software-erp-crm": ["Node.js", "Python", "PostgreSQL", "Docker", "AWS / Cloud", "REST / GraphQL APIs"],
  "web-development": ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Shopify", "Vercel"],
  "mobile-app-development": ["React Native", "Flutter", "iOS App Store", "Google Play", "Firebase"],
  "ui-ux-graphic-design": ["Figma", "Design Systems", "Wireframing", "User Research", "Adobe Suite"],
  "video-editing-motion": ["Adobe Premiere Pro", "After Effects", "Cinema 4D", "4K Mastering", "DaVinci Resolve"],
  "digital-marketing-growth": ["Meta Business Manager", "Google Ads PPC", "SEO & GEO", "Klaviyo", "GA4 Analytics"],
};

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services — Custom Software, ERP/CRM, Web & Mobile Apps | Arshio" },
      { name: "description", content: "Explore Arshio's 6 core service pillars: Custom ERP/CRM Software, Web Development, Mobile Apps, UI/UX Design, Motion Video Editing, and Digital Marketing." },
      { property: "og:title", content: "Core Services — Arshio Digital Agency" },
      { property: "og:description", content: "Custom ERP/CRM, Web Dev, Mobile Apps, UI/UX, Video Reels, Digital Marketing." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const scrollToService = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
                <Sparkles className="w-3.5 h-3.5" /> Full-Spectrum Digital Capabilities
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Six Specialized Pillars Built to <br />
                <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">
                  Accelerate Your Business.
                </span>
              </h1>
              <p className="mt-5 text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                From bespoke ERP & CRM platforms to pixel-perfect UI/UX, viral video reels, full-stack code, and ROI-driven marketing campaigns.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/estimator"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-[#27e2c4] hover:bg-[#1fd6b9] shadow-lg shadow-[#27e2c4]/20 transition-all hover:scale-105"
                >
                  Instant Cost Calculator <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-[#131f37] hover:bg-[#1a2948] border border-slate-800 transition-all"
                >
                  Book Discovery Call
                </Link>
              </div>
            </div>
          </section>

          {/* Sticky Quick-Navigation Service Pills */}
          <div className="sticky top-20 z-40 bg-[#070d1e]/90 backdrop-blur-xl border-b border-slate-800/80 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none">
              {SERVICES.map((s, idx) => (
                <button
                  key={s.slug}
                  onClick={() => scrollToService(s.slug)}
                  className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap bg-[#0b132b] text-slate-300 hover:text-[#27e2c4] border border-slate-800 hover:border-[#27e2c4]/40 transition-all"
                >
                  0{idx + 1}. {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Service Pillars Breakdown */}
          <section className="py-24 bg-[#0b132b]/60 border-b border-slate-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
              {SERVICES.map((s, idx) => {
                const tools = SERVICE_TECH_STACK[s.slug] || [];

                return (
                  <div
                    key={s.slug}
                    id={s.slug}
                    className="bg-[#070d1e]/90 backdrop-blur-2xl rounded-3xl border border-slate-800/80 p-8 sm:p-12 shadow-2xl relative overflow-hidden group hover:border-[#27e2c4]/40 transition-all duration-300 scroll-mt-36"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-[#27e2c4] bg-[#27e2c4]/10 px-3 py-1 rounded-md border border-[#27e2c4]/30">
                            Pillar 0{idx + 1}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {s.tags.map((t) => (
                              <span key={t} className="text-[10px] uppercase font-bold text-slate-400 bg-[#131f37] px-2.5 py-1 rounded-md border border-slate-800">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-[#27e2c4] transition-colors">
                          {s.title}
                        </h2>

                        <p className="text-slate-300 text-base leading-relaxed">
                          {s.desc}
                        </p>

                        {/* Deliverables List */}
                        <div className="space-y-3 pt-2">
                          <div className="text-xs font-bold text-[#27e2c4] uppercase tracking-wider">
                            Key Deliverables & Capabilities:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {s.bullets.map((b) => (
                              <div key={b} className="flex items-start gap-2.5 text-sm text-slate-200">
                                <span className="mt-0.5 w-4 h-4 rounded-full bg-[#27e2c4]/15 border border-[#27e2c4]/40 flex items-center justify-center shrink-0 p-0.5">
                                  <Check className="w-3 h-3 text-[#27e2c4] stroke-[3]" />
                                </span>
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Professional Tools & Tech Stack Badges */}
                        <div className="pt-4 border-t border-slate-800/80">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                            Tools & Tech Stack Used:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {tools.map((tool) => (
                              <span
                                key={tool}
                                className="text-xs font-semibold bg-[#131f37] text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700/80"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4">
                          <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-950 bg-[#27e2c4] hover:bg-[#1fd6b9] px-6 py-3 rounded-xl shadow-lg shadow-[#27e2c4]/20 transition-all hover:scale-105"
                          >
                            Start {s.title} Project <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>

                      {/* Right Column: Deliverable Guarantees Card */}
                      <div className="lg:col-span-5 flex justify-center">
                        <div className="w-full bg-[#0b132b] rounded-2xl border border-slate-800 p-7 shadow-xl space-y-6 group-hover:border-[#27e2c4]/30 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4] shrink-0 shadow-lg shadow-[#27e2c4]/10">
                              <s.Icon className="w-7 h-7" />
                            </div>
                            <div>
                              <div className="text-lg font-bold text-white">{s.title}</div>
                              <div className="text-xs font-semibold text-[#27e2c4]">Guaranteed Scope & SLA</div>
                            </div>
                          </div>

                          <div className="space-y-3 pt-2 border-t border-slate-800/80">
                            {[
                              { icon: ShieldCheck, title: "100% IP Ownership", detail: "Full copyright & source asset transfer" },
                              { icon: FileCode, title: "Clean Documentation", detail: "Comprehensive handoff & code docs" },
                              { icon: Clock, title: "1-3 Week Agile Sprints", detail: "Weekly staging demos & Slack updates" },
                              { icon: Layers, title: "2 Rounds of Revisions", detail: "Quality assurance guaranteed" },
                            ].map((g, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <g.icon className="w-4 h-4 text-[#27e2c4] shrink-0 mt-1" />
                                <div>
                                  <div className="text-xs font-bold text-white">{g.title}</div>
                                  <div className="text-[11px] text-slate-400">{g.detail}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Interactive Estimator Banner CTA */}
          <EstimatorBannerCTA />

          {/* Contact Form */}
          <ContactForm />
        </main>

        <Footer />
      </div>
    </div>
  );
}
