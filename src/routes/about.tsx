import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AmbientBackground } from "@/components/site/AmbientBackground";
import { EstimatorBannerCTA } from "@/components/site/EstimatorBannerCTA";
import {
  Sparkles,
  ShieldCheck,
  Award,
  Users,
  Code2,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Palette,
  Terminal,
  Video,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Arshio — Creative & Digital Software Agency" },
      { name: "description", content: "Learn about Arshio Digital Agency. We are an all-in-one software development, UI/UX, video reels, and digital growth agency building scalable enterprise tools." },
      { property: "og:title", content: "About Us — Arshio Digital Agency" },
      { property: "og:description", content: "Custom ERP/CRM, Web Dev, Mobile Apps, UI/UX, Video Reels, Digital Marketing." },
    ],
  }),
  component: AboutPage,
});

const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: "100% Code & IP Ownership",
    desc: "You retain full legal ownership of all source code, Figma design files, database schemas, and cloud assets. Zero lock-in.",
  },
  {
    icon: Award,
    title: "99.2% On-Time SLA Guarantee",
    desc: "We build in strict 14-day agile sprints with weekly staging previews. No hidden delays or unannounced extension fees.",
  },
  {
    icon: Users,
    title: "Direct Access to Engineers",
    desc: "Work directly with senior full-stack developers, UI directors, and growth leads. No non-technical account managers.",
  },
  {
    icon: TrendingUp,
    title: "Measurable ROI & Performance",
    desc: "Whether optimizing page loads to 0.5s or reducing warehouse operational lag by 65%, every deliverable is built for bottom-line growth.",
  },
];

const TEAM_PILLARS = [
  {
    icon: Terminal,
    role: "Full-Stack Software Engineers",
    skills: ["Node.js", "Python", "PostgreSQL", "Next.js", "Docker"],
    desc: "Architecting high-throughput custom ERPs, REST/GraphQL microservices, and sub-second web applications.",
  },
  {
    icon: Palette,
    role: "UI/UX & Product Design Directors",
    skills: ["Figma", "Design Systems", "Mobile UI", "User Research"],
    desc: "Crafting intuitive dark-mode interfaces, interactive mobile flows, and scalable brand component design systems.",
  },
  {
    icon: Code2,
    role: "Mobile App Developers",
    skills: ["React Native", "Flutter", "iOS Swift", "Android Kotlin"],
    desc: "Engineering high-performance cross-platform iOS & Android mobile applications with offline sync capability.",
  },
  {
    icon: Video,
    role: "Motion Editors & Growth Marketers",
    skills: ["Premiere Pro", "After Effects", "Meta Ads", "Google Ads"],
    desc: "Creating viral short-form Reels, 3D product motion commercials, and ROI-focused digital performance campaigns.",
  },
];

function AboutPage() {
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
                <Sparkles className="w-3.5 h-3.5" /> Human Craftsmanship & Precision Engineering
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                We Don't Just Ship Code. <br />
                <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">
                  We Build High-Value Digital Assets.
                </span>
              </h1>
              <p className="mt-5 text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                Arshio is an all-in-one digital agency combining custom ERP software engineering, sub-second web applications, mobile apps, UI/UX design, motion reels, and performance marketing.
              </p>

              {/* Stats Bar */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[#0b132b]/80 backdrop-blur-xl rounded-2xl border border-slate-800 text-left">
                <div>
                  <div className="text-3xl font-black text-[#27e2c4]">50+</div>
                  <div className="text-xs text-slate-400 font-semibold uppercase mt-1">Projects Delivered</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white">99.2%</div>
                  <div className="text-xs text-slate-400 font-semibold uppercase mt-1">On-Time SLA</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-[#38bdf8]">4.9 / 5.0</div>
                  <div className="text-xs text-slate-400 font-semibold uppercase mt-1">Client Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-[#27e2c4]">$15M+</div>
                  <div className="text-xs text-slate-400 font-semibold uppercase mt-1">Client Revenue Generated</div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className="py-24 bg-[#0b132b]/60 border-b border-slate-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> Our Operating Principles
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  Why High-Growth Brands Choose <span className="text-[#27e2c4]">Arshio</span>
                </h2>
                <p className="text-slate-300 text-base">
                  We eliminate traditional agency bloat, scope vagueness, and slow communication.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {CORE_VALUES.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div
                      key={v.title}
                      className="bg-[#070d1e]/90 backdrop-blur-2xl rounded-3xl border border-slate-800/80 p-8 shadow-xl hover:border-[#27e2c4]/40 transition-all duration-300 space-y-4 group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4] group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white group-hover:text-[#27e2c4] transition-colors">
                        {v.title}
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {v.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Core Team & Engineering Capabilities */}
          <section className="py-24 bg-[#070d1e] border-b border-slate-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5" /> Core Team Pillars
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  Multidisciplinary Engineering & Creative Talent
                </h2>
                <p className="text-slate-300 text-base">
                  Dedicated specialists focused on delivering pixel perfection and clean architecture.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {TEAM_PILLARS.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div
                      key={t.role}
                      className="bg-[#0b132b]/80 backdrop-blur-2xl rounded-3xl border border-slate-800/80 p-8 shadow-xl space-y-6 hover:border-[#27e2c4]/40 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4]">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{t.role}</h3>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {t.skills.map((s) => (
                              <span key={s} className="text-[10px] font-mono bg-[#131f37] text-[#27e2c4] px-2 py-0.5 rounded border border-slate-800">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-300 text-sm leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Cost Estimator Banner CTA */}
          <EstimatorBannerCTA />
        </main>

        <Footer />
      </div>
    </div>
  );
}
