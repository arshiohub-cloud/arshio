import { ShieldCheck, Clock, Users, Lock, Award } from "lucide-react";

const DIFFERENTIATORS = [
  {
    icon: Users,
    title: "Dedicated Senior Team",
    desc: "No junior outsourcing or offshore fluff. You work 1-on-1 with senior UI/UX designers, lead engineers, and creative directors.",
  },
  {
    icon: Clock,
    title: "Rapid Sprint Turnarounds",
    desc: "We ship designs and code in 1 to 3 week agile sprints with real-time Slack updates, live staging links, and weekly demos.",
  },
  {
    icon: Award,
    title: "Fixed Transparent Pricing",
    desc: "No surprise invoices or hourly bloat. Clear scope, instant cost estimator, and fixed project fees before we begin.",
  },
  {
    icon: Lock,
    title: "100% Commercial IP Ownership",
    desc: "You own all Figma design files, source code repositories, and raw 4K video assets with complete commercial copyright license.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-[#070d1e] border-b border-slate-800/80 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[500px] h-[500px] bg-[#27e2c4]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Why Arshio
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built for Founders & Brands Who Expect <br />
            <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">
              World-Class Execution.
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            Why leading businesses choose Arshio over fragmented freelancers or slow traditional agencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIFFERENTIATORS.map((d, i) => (
            <div
              key={i}
              className="bg-[#0b132b] rounded-2xl border border-slate-800/80 p-7 hover:border-[#27e2c4]/40 transition-all duration-300 shadow-xl group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4] mb-6 group-hover:scale-110 transition-transform">
                <d.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#27e2c4] transition-colors">
                {d.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
