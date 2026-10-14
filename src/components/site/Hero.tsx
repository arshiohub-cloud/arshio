import { ArrowRight, Code2, Layers, Cpu, CheckCircle2, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-transparent text-white pt-16 sm:pt-24 pb-20 sm:pb-28 border-b border-white/5">
      {/* Brand Ambient Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[550px] bg-gradient-to-b from-[#27e2c4]/12 via-[#131f37]/25 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#38bdf8]/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Subtle Technical Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Confident Technical Studio Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 backdrop-blur-md text-[11px] sm:text-xs font-mono font-semibold text-[#27e2c4] mb-6 sm:mb-8 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#27e2c4] animate-pulse" />
          <span>SENIOR FULL-CYCLE DIGITAL STUDIO</span>
        </div>

        {/* Main Bold Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white max-w-5xl mx-auto">
          Design-Led Digital Products That <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">
            Scale Your Business Fast.
          </span>
        </h1>

        {/* Human, Compelling Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          We engineer bespoke ERP software, high-converting web applications, mobile apps, and viral motion reels. Senior talent, fixed sprint pricing, zero agency fluff.
        </p>

        {/* Clear Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-slate-950 bg-[#27e2c4] hover:bg-[#1fd6b9] px-8 py-4 rounded-xl shadow-xl shadow-[#27e2c4]/25 transition-all hover:scale-105 active:scale-95"
          >
            Start Your Project <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <Link
            to="/portfolio"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-white bg-[#131f37] hover:bg-[#1a2948] border border-slate-800 px-7 py-4 rounded-xl transition-all"
          >
            Explore Case Studies
          </Link>
        </div>

        {/* Studio Product Mockup Showcase — Replaces Cliché Blank Space with Tangible Craft */}
        <div className="mt-14 sm:mt-20 max-w-5xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl bg-[#0b132b] border border-slate-800/90 shadow-2xl overflow-hidden text-left">
            {/* macOS / Dark Browser Chrome Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#070d1e] border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                <div className="ml-3 hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-[#131f37] border border-slate-800 text-[11px] font-mono text-slate-400">
                  <span className="text-[#27e2c4]">https://</span>
                  <span>app.arshio.dev/operations-dashboard</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Engine: 99.98%
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                  v2.4 Production
                </span>
              </div>
            </div>

            {/* Dashboard Content Mockup Grid */}
            <div className="p-5 sm:p-8 bg-[#0b132b]/80">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
                {/* Left Mini Stats & Architecture Stack */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-[#070d1e] p-4 rounded-xl border border-slate-800">
                    <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                      Full-Stack Architecture
                    </div>
                    <div className="mt-2 text-xl font-bold text-white flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-[#27e2c4]" /> Multi-Tier Cloud ERP
                    </div>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      Custom Node.js + PostgreSQL database engine with live automated warehouse dispatching.
                    </p>
                  </div>

                  <div className="bg-[#070d1e] p-4 rounded-xl border border-slate-800">
                    <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                      Edge Web Performance
                    </div>
                    <div className="mt-2 text-2xl font-black text-[#27e2c4]">
                      0.58s <span className="text-xs font-normal text-slate-400">Global Average</span>
                    </div>
                    <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#27e2c4] h-full w-[96%]" />
                    </div>
                  </div>
                </div>

                {/* Center / Right Visual Performance Canvas */}
                <div className="lg:col-span-8 bg-[#070d1e] p-5 sm:p-6 rounded-xl border border-slate-800 flex flex-col justify-between space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-[#27e2c4]" /> Real-Time Business Velocity & Telemetry
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">Automated synchronization across all digital touchpoints</div>
                    </div>
                    <span className="text-xs font-mono text-[#27e2c4] bg-[#27e2c4]/10 px-2.5 py-1 rounded border border-[#27e2c4]/30">
                      Zero Manual Bloat
                    </span>
                  </div>

                  {/* Visual Graph Bars Representation */}
                  <div className="grid grid-cols-6 gap-2 sm:gap-3 items-end h-28 sm:h-32 pt-4 px-2 border-b border-slate-800">
                    {[
                      { month: "Sprint 1", h: "45%", val: "$24K" },
                      { month: "Sprint 2", h: "62%", val: "$48K" },
                      { month: "Sprint 3", h: "78%", val: "$72K" },
                      { month: "Sprint 4", h: "85%", val: "$96K" },
                      { month: "Sprint 5", h: "94%", val: "$124K" },
                      { month: "Current", h: "100%", val: "$158K", current: true },
                    ].map((bar) => (
                      <div key={bar.month} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[10px] font-mono text-[#27e2c4] opacity-0 group-hover:opacity-100 transition-opacity">
                          {bar.val}
                        </span>
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            bar.current
                              ? "bg-gradient-to-t from-[#27e2c4] to-[#5eead4] shadow-lg shadow-[#27e2c4]/20"
                              : "bg-[#131f37] hover:bg-[#1a2948]"
                          }`}
                          style={{ height: bar.h }}
                        />
                        <span className="text-[10px] font-mono text-slate-400 truncate w-full text-center">
                          {bar.month}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Deliverable Commitments Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#27e2c4] shrink-0" />
                      <span>100% Code Ownership</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#27e2c4] shrink-0" />
                      <span>Weekly Staging Demos</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#27e2c4] shrink-0" />
                      <span>Direct Senior Access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Grounded Trust Strip */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">120+</div>
            <div className="text-[11px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Projects Delivered</div>
          </div>
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#27e2c4]">99.4%</div>
            <div className="text-[11px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">On-Time SLA Record</div>
          </div>
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">4.8M+</div>
            <div className="text-[11px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Video Views Generated</div>
          </div>
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">3.5x</div>
            <div className="text-[11px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Client ROI Multiple</div>
          </div>
        </div>
      </div>
    </section>
  );
}
