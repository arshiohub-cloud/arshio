import { ShieldCheck, Clock, Users, Lock, Award, CheckCircle2 } from "lucide-react";

const DIFFERENTIATORS = [
  {
    icon: Users,
    title: "1-on-1 Direct Senior Access",
    desc: "No non-technical account managers or junior outsourcing. You collaborate directly with senior UI/UX directors, lead full-stack engineers, and creative producers who build your product.",
    badge: "Senior Talent Only",
  },
  {
    icon: Clock,
    title: "1 to 3 Week Agile Sprints",
    desc: "We work in rapid 14-day production cycles with weekly staging previews. You test live deployed builds in real time on staging URLs rather than waiting months for a big reveal.",
    badge: "99.4% On-Time SLA",
  },
  {
    icon: Award,
    title: "Fixed Milestone Pricing & Clear SRS",
    desc: "Before writing a single line of code, we deliver a locked Technical Blueprint with fixed milestones and transparent deliverables. Zero surprise invoices, zero scope-creep billing.",
    badge: "Locked Budget",
  },
  {
    icon: Lock,
    title: "100% Commercial IP Ownership",
    desc: "You legally own every line of source code, Figma design system file, and raw 4K video asset upon milestone delivery. No proprietary lock-in, no ongoing licensing fees.",
    badge: "Zero Strings Attached",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-28 bg-transparent border-b border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[500px] h-[500px] bg-[#27e2c4]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16 items-start">
          {/* Left: Bold Editorial Statement (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-mono font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Built for Discerning Founders
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
              Senior Talent. <br />
              Direct Access. <br />
              <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">
                Zero Lock-In.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We are not a faceless outsourcing body shop, and we don’t pad meetings with layers of non-technical account managers. We are a tight collective of senior engineers, product designers, and growth directors who treat your business like our own.
            </p>

            <div className="p-5 rounded-2xl bg-[#0b132b] border border-slate-800 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-[#27e2c4] font-bold">
                Our Operating Guarantee
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#27e2c4] shrink-0" />
                  <span>Guaranteed response time under 4 business hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#27e2c4] shrink-0" />
                  <span>Direct shared Slack / WhatsApp channel with lead devs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#27e2c4] shrink-0" />
                  <span>Comprehensive 30-day post-launch code warranty</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: 4 Distinct Proof Points */}
          <div className="lg:col-span-7 space-y-5">
            {DIFFERENTIATORS.map((d, i) => (
              <div
                key={i}
                className="bg-[#0b132b] rounded-2xl border border-slate-800/80 p-6 sm:p-8 hover:border-[#27e2c4]/40 transition-all duration-300 shadow-xl group"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4] shrink-0 group-hover:scale-110 transition-transform shadow-md">
                    <d.icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#27e2c4] transition-colors">
                        {d.title}
                      </h3>
                      <span className="text-[10px] font-mono text-[#27e2c4] bg-[#27e2c4]/10 border border-[#27e2c4]/20 px-2 py-0.5 rounded-full">
                        {d.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {d.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
