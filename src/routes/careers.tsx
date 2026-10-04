import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AmbientBackground } from "@/components/site/AmbientBackground";
import {
  Sparkles,
  Briefcase,
  Globe,
  DollarSign,
  Laptop,
  GraduationCap,
  Zap,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers & Open Positions — Join Arshio Digital Agency" },
      { name: "description", content: "Explore remote engineering, UI/UX design, motion graphics, and digital marketing careers at Arshio Digital Agency." },
      { property: "og:title", content: "Careers — Arshio Digital Agency" },
      { property: "og:description", content: "Build enterprise ERP software, web apps, and video reels with us." },
    ],
  }),
  component: CareersPage,
});

const PERKS = [
  {
    icon: Globe,
    title: "100% Remote-First Culture",
    desc: "Work from anywhere in the world with flexible working hours and async communication.",
  },
  {
    icon: DollarSign,
    title: "Competitive USD Compensation",
    desc: "Industry-leading salaries with bi-annual performance bonuses and profit sharing.",
  },
  {
    icon: Laptop,
    title: "M-Series Mac Hardware Stipend",
    desc: "We equip every team member with top-tier Apple Silicon MacBooks and 4K display monitors.",
  },
  {
    icon: GraduationCap,
    title: "$1,000/yr Education Budget",
    desc: "Generous annual stipend for courses, design assets, developer conferences, and books.",
  },
];

const OPEN_POSITIONS = [
  {
    id: "senior-fullstack",
    title: "Senior Full-Stack Engineer (Node.js & Next.js)",
    type: "Full-Time",
    location: "Remote (Global)",
    department: "Engineering",
    desc: "Architecting high-throughput custom ERP systems, REST APIs, and sub-second React 19 web applications.",
    requirements: [
      "4+ years of professional experience with Node.js, TypeScript, and PostgreSQL.",
      "Deep expertise in Next.js 15, React Start, Server Components, and Tailwind CSS.",
      "Experience with Docker containerization, AWS, and Supabase / PostgreSQL optimization.",
      "Strong technical communication skills and async team workflow.",
    ],
  },
  {
    id: "lead-uiux-designer",
    title: "Lead UI/UX Product Designer",
    type: "Full-Time",
    location: "Remote (Global)",
    department: "Design",
    desc: "Designing dark-mode first enterprise software design systems, mobile app UI, and interactive Figma prototypes.",
    requirements: [
      "3+ years of UI/UX design experience for SaaS, web apps, or digital agencies.",
      "Mastery of Figma, auto-layout, component design systems, and responsive wireframes.",
      "Portfolio demonstrating clean typography, micro-interactions, and conversion-focused UX.",
    ],
  },
  {
    id: "motion-video-editor",
    title: "Motion Graphics Artist & Reels Editor",
    type: "Full-Time / Contract",
    location: "Remote (Global)",
    department: "Creative",
    desc: "Editing high-energy short-form TikTok/Reels commercials, 3D product motion graphics, and sound design.",
    requirements: [
      "Expertise in Adobe Premiere Pro, After Effects, and DaVinci Resolve color grading.",
      "Proven track record editing high-converting social media reels with motion typography.",
      "Strong portfolio of short-form motion graphics and video editing deliverables.",
    ],
  },
  {
    id: "performance-marketer",
    title: "Performance Marketing & PPC Specialist",
    type: "Full-Time",
    location: "Remote (Global)",
    department: "Growth Marketing",
    desc: "Managing ROI-driven Meta Business Manager, Google Ads PPC campaigns, and conversion funnel optimizations.",
    requirements: [
      "3+ years managing paid ad budgets ($10K+/month) with proven ROAS track record.",
      "Deep understanding of GA4 analytics, Meta Pixel tracking, and ad copy testing.",
      "Experience auditing conversion funnels and landing page UI/UX.",
    ],
  },
];

function CareersPage() {
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
                <Sparkles className="w-3.5 h-3.5" /> Join Our Engineering & Creative Team
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Build High-Impact Assets. <br />
                <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">
                  Shape the Future of Tech.
                </span>
              </h1>
              <p className="mt-5 text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                We are a remote-first collective of full-stack engineers, UI/UX directors, motion artists, and growth marketers building world-class products.
              </p>
            </div>
          </section>

          {/* Perks & Benefits Section */}
          <section className="py-24 bg-[#0b132b]/60 border-b border-slate-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" /> Why Work at Arshio
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  Perks Built for Top-Tier Talent
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {PERKS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.title}
                      className="bg-[#070d1e]/90 backdrop-blur-2xl rounded-3xl border border-slate-800/80 p-8 shadow-xl hover:border-[#27e2c4]/40 transition-all space-y-4 group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4] group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white group-hover:text-[#27e2c4] transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Open Positions Accordion */}
          <section className="py-24 bg-[#070d1e] border-b border-slate-800/80">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider">
                  <Briefcase className="w-3.5 h-3.5" /> Open Roles
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                  Explore Current Opportunities
                </h2>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {OPEN_POSITIONS.map((pos) => (
                  <AccordionItem
                    key={pos.id}
                    value={pos.id}
                    className="bg-[#0b132b]/90 border border-slate-800/80 rounded-3xl px-8 py-4 transition-colors"
                  >
                    <AccordionTrigger className="hover:no-underline py-4 text-left">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-mono font-bold text-[#27e2c4] bg-[#27e2c4]/10 px-3 py-1 rounded-md border border-[#27e2c4]/30">
                            {pos.department}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3 text-[#27e2c4]" /> {pos.type}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                            <MapPin className="w-3 h-3 text-[#38bdf8]" /> {pos.location}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white hover:text-[#27e2c4] transition-colors">
                          {pos.title}
                        </h3>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="text-slate-300 text-sm leading-relaxed pt-4 space-y-6">
                      <p>{pos.desc}</p>

                      <div className="space-y-3">
                        <div className="text-xs font-bold text-[#27e2c4] uppercase tracking-wider">
                          Key Requirements:
                        </div>
                        <div className="space-y-2">
                          {pos.requirements.map((req, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                              <span className="mt-0.5 w-4 h-4 rounded-full bg-[#27e2c4]/15 border border-[#27e2c4]/40 flex items-center justify-center shrink-0 p-0.5">
                                <CheckCircle2 className="w-3 h-3 text-[#27e2c4]" />
                              </span>
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800">
                        <a
                          href="mailto:careers@arshio.com?subject=Application%20for%20Open%20Role"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-[#27e2c4] hover:bg-[#1fd6b9] shadow-md"
                        >
                          Apply for this Position <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
