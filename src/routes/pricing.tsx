import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AmbientBackground } from "@/components/site/AmbientBackground";
import { EstimatorSection } from "@/components/site/EstimatorSection";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Engagement Models — Transparent Agency Rates | Arshio" },
      { name: "description", content: "Explore Arshio's transparent pricing engagement models: Fixed-Scope Projects, Dedicated Monthly Retainers, and Performance Marketing." },
      { property: "og:title", content: "Pricing & Engagement Models — Arshio Digital Agency" },
      { property: "og:description", content: "Transparent pricing models with zero hidden fees and 100% code ownership." },
    ],
  }),
  component: PricingPage,
});

const ENGAGEMENT_MODELS = [
  {
    title: "Fixed-Scope Project",
    tag: "Most Popular for ERP & Apps",
    priceUSD: "Starting from $1,200",
    priceBDT: "Starting from ৳140,000",
    desc: "Ideal for custom ERP/CRM platforms, web applications, mobile apps, and UI/UX design overhauls with clear deliverables.",
    features: [
      "Fixed milestone timeline & budget",
      "Comprehensive Technical SRS & Schema",
      "Figma Prototype & System Architecture",
      "100% Source Code & Asset Ownership",
      "99.2% On-Time SLA Guarantee",
      "30-Day Post-Launch Technical Support",
    ],
    ctaText: "Estimate Project Cost",
    ctaLink: "/estimator",
    highlight: true,
  },
  {
    title: "Dedicated Team Retainer",
    tag: "Flexible Agile Capacity",
    priceUSD: "Starting from $2,500 / mo",
    priceBDT: "Starting from ৳280,000 / mo",
    desc: "Dedicated senior engineers, UI/UX designers, and QA leads working exclusively as an extension of your company.",
    features: [
      "Dedicated Full-Stack & Mobile Engineers",
      "Weekly Agile Sprints & Code Commits",
      "Direct Slack / WhatsApp Channel Access",
      "Flexible Scope Prioritization",
      "Continuous Staging & CI/CD Deploys",
      "No Long-Term Lock-in (Cancel Anytime)",
    ],
    ctaText: "Hire Dedicated Team",
    ctaLink: "/contact",
    highlight: false,
  },
  {
    title: "Growth & Motion Retainer",
    tag: "Reels, Ads & Conversion",
    priceUSD: "Starting from $950 / mo",
    priceBDT: "Starting from ৳110,000 / mo",
    desc: "Ongoing short-form video reels, 3D motion graphics, and ROI-focused Meta & Google PPC performance ad management.",
    features: [
      "8–12 High-Quality Edited Motion Reels",
      "Meta Business Manager & Google Ads PPC",
      "Ad Copywriting & Creative Variations",
      "Conversion Landing Page Tweaks",
      "Weekly Analytics & ROAS Reports",
      "Dedicated Creative Art Director",
    ],
    ctaText: "Boost Brand Growth",
    ctaLink: "/contact",
    highlight: false,
  },
];

const PRICING_FAQS = [
  {
    q: "Are there any hidden maintenance fees or surprise charges?",
    a: "None. All fixed-scope projects include a transparent Technical Blueprint detailing exact deliverables, milestone pricing, and 30 days of complimentary post-launch support.",
  },
  {
    q: "How does the Dedicated Team Retainer work?",
    a: "You get dedicated full-stack developers or UI designers allocated to your project. We work in 14-day agile sprints, and you can scale team capacity up or down with 7 days notice.",
  },
  {
    q: "Which currency do you accept for payments?",
    a: "We accept payments in USD ($), BDT (৳), and EUR (€) via wire transfer, bank deposit, Stripe, bKash, or international credit card.",
  },
  {
    q: "Can I get a custom price for a smaller or larger project?",
    a: "Absolutely! Use our interactive Cost Estimator below or book a free 30-minute discovery call to get a tailored scope document.",
  },
];

function PricingPage() {
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
                <Sparkles className="w-3.5 h-3.5" /> Transparent & Flexible Engagement Models
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Predictable Investment. <br />
                <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">
                  Maximum Enterprise ROI.
                </span>
              </h1>
              <p className="mt-5 text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                Whether you need a fixed-scope custom ERP software build, a dedicated engineering team, or an ongoing video & marketing growth retainer.
              </p>
            </div>
          </section>

          {/* Pricing Models Grid */}
          <section className="py-24 bg-[#0b132b]/60 border-b border-slate-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {ENGAGEMENT_MODELS.map((m) => (
                <div
                  key={m.title}
                  className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
                    m.highlight
                      ? "bg-gradient-to-b from-[#0b132b] via-[#070d1e] to-[#070d1e] border-2 border-[#27e2c4] shadow-2xl shadow-[#27e2c4]/15 scale-105"
                      : "bg-[#070d1e]/90 backdrop-blur-2xl border border-slate-800/80 hover:border-[#27e2c4]/40"
                  }`}
                >
                  {m.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#27e2c4] text-slate-950 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {m.tag}
                    </div>
                  )}

                  <div className="space-y-6">
                    {!m.highlight && (
                      <span className="inline-block text-xs font-mono font-bold text-[#27e2c4] bg-[#27e2c4]/10 px-3 py-1 rounded-md border border-[#27e2c4]/30">
                        {m.tag}
                      </span>
                    )}

                    <h3 className="text-2xl font-extrabold text-white">{m.title}</h3>

                    <div className="space-y-1">
                      <div className="text-2xl sm:text-3xl font-black text-[#27e2c4]">{m.priceUSD}</div>
                      <div className="text-xs font-mono text-slate-400">{m.priceBDT}</div>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed">{m.desc}</p>

                    <div className="pt-4 border-t border-slate-800 space-y-3">
                      <div className="text-xs font-bold text-[#27e2c4] uppercase tracking-wider">
                        Included Features & SLA:
                      </div>
                      <div className="space-y-2.5">
                        {m.features.map((f) => (
                          <div key={f} className="flex items-start gap-2.5 text-xs text-slate-200">
                            <span className="mt-0.5 w-4 h-4 rounded-full bg-[#27e2c4]/15 border border-[#27e2c4]/40 flex items-center justify-center shrink-0 p-0.5">
                              <CheckCircle2 className="w-3 h-3 text-[#27e2c4]" />
                            </span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6">
                    <Link
                      to={m.ctaLink}
                      className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${
                        m.highlight
                          ? "bg-[#27e2c4] text-slate-950 hover:bg-[#1fd6b9] shadow-lg shadow-[#27e2c4]/25"
                          : "bg-[#131f37] text-white hover:bg-[#1a2948] border border-slate-700"
                      }`}
                    >
                      {m.ctaText} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Embedded Interactive Cost Estimator */}
          <section className="relative">
            <div className="text-center pt-16 pb-4">
              <span className="text-xs font-mono font-bold text-[#27e2c4] bg-[#27e2c4]/10 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 uppercase tracking-wider">
                Custom Calculator
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
                Need a Custom Feature-Based Estimate?
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
                Use our interactive cost & timeline estimator below to calculate your tailored budget in USD, BDT, or EUR.
              </p>
            </div>
            <EstimatorSection />
          </section>

          {/* Pricing FAQ Section */}
          <section className="py-24 bg-[#070d1e] border-b border-slate-800/80">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5" /> Pricing Questions
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Pricing & Payment Terms FAQ
                </h2>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {PRICING_FAQS.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`pricing-faq-${idx}`}
                    className="bg-[#0b132b]/80 border border-slate-800/80 rounded-2xl px-6 py-2"
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
        </main>

        <Footer />
      </div>
    </div>
  );
}
