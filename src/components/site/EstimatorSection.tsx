import { useState } from "react";
import { Sparkles, Check, Clock, ArrowRight, ShieldCheck, Layers, FileCode, Users, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Discipline = {
  id: string;
  name: string;
  category: string;
  startingUSD: string;
  startingBDT: string;
  timeline: string;
  deliverables: string[];
  tools: string[];
  idealFor: string;
};

const DISCIPLINES: Discipline[] = [
  {
    id: "software",
    name: "Custom Software & ERP/CRM",
    category: "Enterprise Systems",
    startingUSD: "$1,400",
    startingBDT: "৳165,000",
    timeline: "4 – 8 Weeks",
    deliverables: [
      "Custom ERP/CRM system architecture & database schema",
      "Role-based access control & multi-tenant security",
      "Interactive Figma design system & clickable user flows",
      "100% source code ownership & automated cloud deployment",
      "Comprehensive API documentation & 30-day warranty",
    ],
    tools: ["Node.js", "Python", "PostgreSQL", "Docker", "AWS / Cloud"],
    idealFor: "Businesses replacing manual spreadsheets, legacy software, or fragmented tools with one unified operations platform.",
  },
  {
    id: "web",
    name: "High-Speed Web Applications",
    category: "Web Platforms",
    startingUSD: "$950",
    startingBDT: "৳110,000",
    timeline: "2 – 4 Weeks",
    deliverables: [
      "Sub-second page load speeds (<600ms) with Next.js / React",
      "Responsive, mobile-first layouts with custom Tailwind CSS",
      "SEO-optimized structure & Core Web Vitals score 95+",
      "CMS or e-commerce store integration (Shopify / Headless)",
      "Analytics tracking, GA4 & Meta Pixel setup",
    ],
    tools: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Vercel"],
    idealFor: "Brands and SaaS founders needing modern, ultra-fast web stores or customer portals that maximize conversion.",
  },
  {
    id: "mobile",
    name: "iOS & Android Mobile Apps",
    category: "Cross-Platform",
    startingUSD: "$1,800",
    startingBDT: "৳210,000",
    timeline: "4 – 8 Weeks",
    deliverables: [
      "Native-feel cross-platform code (React Native / Flutter)",
      "Pixel-perfect mobile UI/UX with smooth micro-animations",
      "Push notification integration & offline caching",
      "App Store & Google Play publishing support",
      "Secure backend authentication & real-time sync",
    ],
    tools: ["React Native", "Flutter", "Firebase", "App Store", "Google Play"],
    idealFor: "Startups and companies launching customer-facing mobile apps with seamless performance across iOS and Android.",
  },
  {
    id: "design",
    name: "UI/UX & Brand Design Systems",
    category: "Product Design",
    startingUSD: "$650",
    startingBDT: "৳75,000",
    timeline: "1 – 3 Weeks",
    deliverables: [
      "Complete Figma design system with components & auto-layout",
      "User research, competitor benchmarking & UX wireframing",
      "Interactive clickable prototypes for user testing",
      "Developer handoff documentation & export-ready assets",
      "2 comprehensive rounds of design feedback & revisions",
    ],
    tools: ["Figma", "Design Tokens", "Wireframing", "User Research", "Adobe Suite"],
    idealFor: "Founders needing clickable prototypes for investor pitches, or existing products needing an Awwwards-level visual overhaul.",
  },
  {
    id: "video",
    name: "Viral Video & Motion Reels",
    category: "Motion & Media",
    startingUSD: "$450",
    startingBDT: "৳50,000",
    timeline: "1 – 2 Weeks",
    deliverables: [
      "High-retention 9:16 short-form video reels & TikTok ad edits",
      "3D product motion graphics & animated logo bumpers",
      "Professional color grading, audio mastering & sound design",
      "Hook-focused pacing optimized for algorithm engagement",
      "Exported in 4K with raw master project files included",
    ],
    tools: ["Premiere Pro", "After Effects", "Cinema 4D", "DaVinci Resolve"],
    idealFor: "D2C brands, creators, and corporate marketing teams wanting high-converting reels that capture attention instantly.",
  },
  {
    id: "marketing",
    name: "Performance Marketing & Funnel Ads",
    category: "Growth & Ads",
    startingUSD: "$550 / mo",
    startingBDT: "৳65,000 / mo",
    timeline: "Monthly Retainer",
    deliverables: [
      "Meta Business Manager & Google Ads PPC campaign architecture",
      "High-converting ad copywriting & creative variations",
      "Landing page conversion rate optimization (CRO) audits",
      "Weekly performance reports & real-time ROAS dashboards",
      "A/B split testing of audiences, ad formats & creatives",
    ],
    tools: ["Meta Ads", "Google Ads", "GA4", "Klaviyo", "Looker Studio"],
    idealFor: "E-commerce and service businesses looking for data-driven customer acquisition with measurable ROI.",
  },
];

export function EstimatorSection() {
  const [activeId, setActiveId] = useState<string>("software");
  const activeDiscipline = DISCIPLINES.find((d) => d.id === activeId) || DISCIPLINES[0];

  return (
    <section className="py-24 bg-transparent border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Transparent Scope & Investment Guide
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Clear, Predictable <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">Investment.</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            No confusing multipliers, hourly bloat, or guesswork. Select a discipline below to view typical project scope, timeline, and starting rates.
          </p>
        </div>

        {/* Interactive Discipline Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {DISCIPLINES.map((d) => {
            const isActive = d.id === activeId;
            return (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#27e2c4] text-slate-950 shadow-lg shadow-[#27e2c4]/25 scale-105"
                    : "bg-[#0b132b] text-slate-300 hover:text-white border border-slate-800 hover:border-[#27e2c4]/40"
                }`}
              >
                {d.name}
              </button>
            );
          })}
        </div>

        {/* Focal Scope & Investment Card */}
        <div className="bg-[#0b132b] rounded-3xl border border-slate-800/80 p-5 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden group hover:border-[#27e2c4]/40 transition-all duration-300 mb-12">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#27e2c4]/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Left: Discipline Overview & Deliverables */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#27e2c4] bg-[#27e2c4]/10 px-3 py-1 rounded-md border border-[#27e2c4]/30">
                  {activeDiscipline.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#27e2c4]" /> {activeDiscipline.timeline}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {activeDiscipline.name}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activeDiscipline.idealFor}
              </p>

              {/* Deliverables List */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-[#27e2c4] uppercase tracking-wider">
                  Guaranteed Scope & Deliverables:
                </div>
                <div className="space-y-2.5">
                  {activeDiscipline.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-[#27e2c4]/15 border border-[#27e2c4]/40 flex items-center justify-center shrink-0 p-0.5">
                        <Check className="w-3 h-3 text-[#27e2c4] stroke-[3]" />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div className="pt-4 border-t border-slate-800/80">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Primary Tech Stack:
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeDiscipline.tools.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono bg-[#131f37] text-slate-300 px-2.5 py-1 rounded-md border border-slate-700/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Pricing Box & Fast Action */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#070d1e]/80 rounded-2xl border border-slate-800 p-5 sm:p-8 space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Typical Project Investment
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-[#27e2c4]">
                    {activeDiscipline.startingUSD}
                  </div>
                  <div className="text-sm font-mono text-slate-400 mt-1">
                    or {activeDiscipline.startingBDT}
                  </div>
                </div>
                <div className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-4">
                  Final fee is locked based on your confirmed scope document before any work begins. Zero surprise invoices.
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                {[
                  "100% Commercial IP & Code Ownership",
                  "Fixed milestone delivery timeline",
                  "Weekly staging demo & Slack channel",
                  "30-day post-launch warranty",
                ].map((g) => (
                  <div key={g} className="flex items-center gap-2 text-xs text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#27e2c4] shrink-0" />
                    <span>{g}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 text-sm font-extrabold text-slate-950 bg-[#27e2c4] hover:bg-[#1fd6b9] py-3.5 px-6 rounded-xl shadow-lg shadow-[#27e2c4]/20 transition-all hover:scale-[1.02]"
                >
                  Request Scoped Proposal <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/pricing"
                  className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 hover:text-white py-2.5 transition-colors"
                >
                  Compare All Pricing Models &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Clear Engagement Models Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0b132b] rounded-2xl border border-slate-800/80 p-6 space-y-3 hover:border-[#27e2c4]/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4]">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Fixed-Scope Milestone Project</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clear deliverables, fixed fee, and rigid deadlines for ERP systems, web stores, and mobile apps.
            </p>
          </div>

          <div className="bg-[#0b132b] rounded-2xl border border-slate-800/80 p-6 space-y-3 hover:border-[#27e2c4]/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4]">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Dedicated Team Capacity</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monthly agile sprints with dedicated senior developers and designers embedded into your organization.
            </p>
          </div>

          <div className="bg-[#0b132b] rounded-2xl border border-slate-800/80 p-6 space-y-3 hover:border-[#27e2c4]/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4]">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Growth & Performance Retainer</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ongoing viral motion reels, ad creative variations, and conversion-focused marketing campaigns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
