import { Search, Palette, Code, Rocket, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Search,
    num: "01",
    title: "Discovery & Strategy",
    desc: "We analyze your business goals, target audience, and competition to map a clear creative and technical roadmap.",
  },
  {
    icon: Palette,
    num: "02",
    title: "UI/UX & Creative Prototype",
    desc: "Crafting wireframes, Figma prototypes, and high-impact visual designs before writing a single line of code.",
  },
  {
    icon: Code,
    num: "03",
    title: "Production & Development",
    desc: "Building blazing-fast web/mobile code, high-resolution 4K video editing, or data-driven ad funnels.",
  },
  {
    icon: Rocket,
    num: "04",
    title: "Launch & Scaled Growth",
    desc: "Rigorous quality assurance, deployment, and performance tracking to maximize your business ROI.",
  },
];

export function Process() {
  return (
    <section id="process" className="py-24 bg-[#070d1e] border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Proven Workflow
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Our 4-Step Working <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">Process</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            A transparent, agile, and results-driven methodology to deliver top-tier client outcomes on time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={s.num}
              className="bg-[#0b132b] rounded-2xl border border-slate-800/80 p-7 hover:border-[#27e2c4]/40 transition-all duration-300 shadow-xl relative group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4] group-hover:scale-110 transition-transform">
                  <s.icon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-extrabold font-mono text-[#27e2c4]/30 group-hover:text-[#27e2c4] transition-colors">
                  {s.num}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#27e2c4] transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-[#27e2c4]">
                <span>Phase {idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
