import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AmbientBackground } from "@/components/site/AmbientBackground";
import { EstimatorBannerCTA } from "@/components/site/EstimatorBannerCTA";
import {
  Sparkles,
  Search,
  Layout,
  Code2,
  Rocket,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  FileCheck,
  Gift,
  HelpCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Our Agile Delivery Process — Transparent, Milestone-Driven | Arshio" },
      { name: "description", content: "Explore Arshio's 4-step agency execution blueprint: Blueprint & Architecture, UI/UX Prototyping, Agile Code Sprints, and SLA-backed Cloud Deployment." },
      { property: "og:title", content: "Our Process — Arshio Digital Agency" },
      { property: "og:description", content: "Transparent, milestone-driven digital product engineering." },
    ],
  }),
  component: ProcessPage,
});

const PROCESS_STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Discovery, Architecture & Technical Blueprint",
    subtitle: "Eliminating scope creep before writing a single line of code.",
    desc: "We dive deep into your business operations, target user behavior, and legacy systems. We map out data schemas, API contracts, tech stack selections, and deliver a fixed-scope technical blueprint.",
    timeline: "Week 1",
    deliverables: [
      "Technical Scope Document (SRS)",
      "Database Schema Architecture",
      "API & Third-Party Integration Map",
      "Fixed Milestone & Pricing Roadmap",
    ],
  },
  {
    step: "02",
    icon: Layout,
    title: "UI/UX Design Systems & Interactive Prototyping",
    subtitle: "Crafting pixel-perfect human experiences that drive conversion.",
    desc: "Our design team builds a dedicated Figma design system with high-fidelity wireframes, interactive user flows, and responsive mobile mockups. You test the clickable prototype before engineering begins.",
    timeline: "Weeks 2 – 3",
    deliverables: [
      "Figma Master Design System",
      "Clickable Mobile & Web Prototypes",
      "UX Usability Flow Map",
      "Brand Color & Typography Tokens",
    ],
  },
  {
    step: "03",
    icon: Code2,
    title: "Agile Engineering Sprints & Staging Builds",
    subtitle: "Clean, modular code built for high scalability and security.",
    desc: "We build in 14-day agile sprints with weekly staging previews. You get full access to live demo builds, git repository commits, and automated QA testing logs throughout the build.",
    timeline: "Weeks 4 – 8",
    deliverables: [
      "Production-Ready Codebase",
      "Weekly Live Staging URL Previews",
      "Automated End-to-End Test Suite",
      "REST / GraphQL API Endpoints",
    ],
  },
  {
    step: "04",
    icon: Rocket,
    title: "Production Launch, SLA Guarantee & Growth",
    subtitle: "Zero-downtime deployment backed by ongoing retainer support.",
    desc: "We deploy your product to cloud infrastructure (Vercel, AWS, Docker), optimize search performance (SEO), setup analytics, and back your product with a 99.2% on-time SLA guarantee.",
    timeline: "Week 9+",
    deliverables: [
      "Zero-Downtime Cloud Deployment",
      "Complete Source Code & Asset Ownership",
      "Admin Analytics & User Dashboards",
      "Post-Launch Warranty & Growth Support",
    ],
  },
];

const FAQS = [
  {
    q: "How do you guarantee on-time project delivery?",
    a: "Every project at Arshio starts with a locked Technical Blueprint (Phase 01) and clear 14-day sprint milestones. You review live staging builds every week, preventing end-of-project surprises.",
  },
  {
    q: "Who owns the code, design files, and database IP?",
    a: "You retain 100% full ownership of all source code, Figma design files, database schemas, and intellectual property upon project completion. No proprietary lock-in.",
  },
  {
    q: "Can you integrate with our existing ERP, CRM, or payment gateways?",
    a: "Yes! We specialize in custom integrations for Supabase, PostgreSQL, Shopify, Stripe, bKash, Meta Ads API, Google Cloud, and enterprise REST APIs.",
  },
  {
    q: "What happens after launch?",
    a: "We offer dedicated post-launch SLA maintenance retainers, continuous feature development, speed optimizations, and ongoing digital marketing support.",
  },
];

function ProcessPage() {
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
                <Sparkles className="w-3.5 h-3.5" /> Predictable, High-Speed Execution
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Our 4-Step Blueprint to <br />
                <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">
                  Flawless Digital Delivery.
                </span>
              </h1>
              <p className="mt-5 text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                From initial architecture audit to interactive Figma prototypes, agile sprint commits, and zero-downtime cloud launches. No surprise fees, no missed deadlines.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/estimator"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-[#27e2c4] hover:bg-[#1fd6b9] shadow-lg shadow-[#27e2c4]/20 transition-all hover:scale-105"
                >
                  Estimate Your Timeline & Cost <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-[#131f37] hover:bg-[#1a2948] border border-slate-800 transition-all"
                >
                  Book 30-Min Discovery Call
                </Link>
              </div>
            </div>
          </section>

          {/* Interactive Step-by-Step Process Timeline */}
          <section className="py-24 bg-[#0b132b]/60 border-b border-slate-800/80 relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
              {PROCESS_STEPS.map((s, idx) => {
                const Icon = s.icon;

                return (
                  <div
                    key={s.step}
                    className="relative bg-[#070d1e]/90 backdrop-blur-2xl rounded-3xl border border-slate-800/80 p-8 sm:p-12 shadow-2xl overflow-hidden hover:border-[#27e2c4]/40 transition-all duration-300 group"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Step Badge & Icon */}
                      <div className="lg:col-span-4 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-black font-mono text-[#27e2c4] bg-[#27e2c4]/10 border border-[#27e2c4]/30 px-4 py-1.5 rounded-2xl">
                            {s.step}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 bg-[#131f37] px-3 py-1.5 rounded-full border border-slate-800">
                            <Clock className="w-3.5 h-3.5 text-[#27e2c4]" /> Timeline: {s.timeline}
                          </span>
                        </div>

                        <div className="w-16 h-16 rounded-2xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4] group-hover:scale-110 transition-transform">
                          <Icon className="w-8 h-8" />
                        </div>

                        <h3 className="text-2xl font-extrabold text-white leading-snug group-hover:text-[#27e2c4] transition-colors">
                          {s.title}
                        </h3>
                        <p className="text-xs font-semibold text-[#27e2c4] uppercase tracking-wider">
                          {s.subtitle}
                        </p>
                      </div>

                      {/* Description & Deliverables */}
                      <div className="lg:col-span-8 space-y-6">
                        <p className="text-slate-300 text-base leading-relaxed">
                          {s.desc}
                        </p>

                        <div className="pt-4 border-t border-slate-800/80 space-y-3">
                          <div className="text-xs font-bold text-[#27e2c4] uppercase tracking-wider flex items-center gap-2">
                            <FileCheck className="w-4 h-4" /> Guaranteed Deliverables You Receive:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {s.deliverables.map((item) => (
                              <div key={item} className="flex items-start gap-2.5 text-sm text-slate-200">
                                <span className="mt-0.5 w-4 h-4 rounded-full bg-[#27e2c4]/15 border border-[#27e2c4]/40 flex items-center justify-center shrink-0 p-0.5">
                                  <CheckCircle2 className="w-3 h-3 text-[#27e2c4]" />
                                </span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Free 30-Minute Discovery Call Bonus Card */}
              <div className="bg-gradient-to-r from-[#27e2c4]/15 via-[#0b132b] to-[#38bdf8]/15 rounded-3xl border border-[#27e2c4]/40 p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#27e2c4]/20 text-[#27e2c4] text-xs font-bold uppercase tracking-wider">
                    <Gift className="w-3.5 h-3.5" /> Step 00 — Zero Risk Strategy Session
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">
                    Free 30-Minute Architecture & Scope Audit
                  </h3>
                  <p className="text-slate-300 text-sm max-w-xl">
                    Before any contract is signed, we discuss your goals, outline your product roadmap, and estimate timeline and cost — 100% free with no obligation.
                  </p>
                </div>

                <Link
                  to="/contact"
                  className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-[#27e2c4] hover:bg-[#1fd6b9] shadow-lg shadow-[#27e2c4]/25 transition-all hover:scale-105"
                >
                  Book Free Audit <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Process FAQ Section */}
          <section className="py-24 bg-[#070d1e] border-b border-slate-800/80">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Got Questions About How We Work?
                </h2>
                <p className="text-slate-400 text-sm">
                  Transparent answers about code ownership, timelines, and post-launch support.
                </p>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {FAQS.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`faq-${idx}`}
                    className="bg-[#0b132b]/80 border border-slate-800/80 rounded-2xl px-6 py-2 transition-colors"
                  >
                    <AccordionTrigger className="text-base font-bold text-white hover:text-[#27e2c4] py-4 text-left">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-300 text-sm leading-relaxed pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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
