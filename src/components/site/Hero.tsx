import { useState, useRef } from "react";
import { ArrowRight, Code2, Cpu, CheckCircle2, ShieldCheck, Lock, Activity, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { useSiteSettings } from "@/lib/cms-store";

export function Hero() {
  const [settings] = useSiteSettings();
  const hero = settings.hero;
  const prefersReduced = useReducedMotion();

  // Interactive mouse-tracking spotlight for the mockup card
  const mockupRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mockupRef.current) return;
    const rect = mockupRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const SPRINT_BARS = [
    { month: "Sprint 1", h: "45%", val: "$24K" },
    { month: "Sprint 2", h: "62%", val: "$48K" },
    { month: "Sprint 3", h: "78%", val: "$72K" },
    { month: "Sprint 4", h: "85%", val: "$96K" },
    { month: "Sprint 5", h: "94%", val: "$124K" },
    { month: "Current", h: "100%", val: "$158K", current: true },
  ];

  return (
    <section className="relative overflow-hidden bg-transparent text-white pt-16 sm:pt-24 pb-20 sm:pb-28 border-b border-white/5">
      {/* Brand Ambient Glow Effects — Breathing Dynamic Orbs */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[450px] sm:h-[600px] rounded-full blur-[140px] pointer-events-none opacity-40 animate-pulse-slow"
        style={{
          background: "radial-gradient(circle, rgba(39,226,196,0.18) 0%, rgba(19,31,55,0.3) 60%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="absolute top-1/4 right-[5%] w-[400px] h-[400px] rounded-full blur-[130px] pointer-events-none opacity-30 animate-drift-slow"
        style={{
          background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)",
        }}
      />

      {/* High-End Technical Grid Mesh Pattern */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)]"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* 1. Confident Technical Studio Pill with Glowing Radar Beacon */}
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/8 backdrop-blur-xl text-[11px] sm:text-xs font-mono font-semibold text-[#27e2c4] mb-6 sm:mb-8 shadow-[0_0_20px_rgba(39,226,196,0.15)] hover:border-[#27e2c4]/50 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27e2c4] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#27e2c4]" />
            </span>
            <span className="tracking-wider uppercase">
              {hero.badge || "SENIOR FULL-CYCLE DIGITAL STUDIO"}
            </span>
          </div>
        </motion.div>

        {/* 2. Main Bold Headline with Luminous Gradient Accent */}
        <motion.h1
          initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white max-w-5xl mx-auto font-display"
        >
          {hero.title} <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(39,226,196,0.3)]">
            {hero.titleAccent}
          </span>
        </motion.h1>

        {/* 3. Human, Compelling Subtitle */}
        <motion.p
          initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-base sm:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed"
        >
          {hero.subtitle}
        </motion.p>

        {/* 4. Clear Action Buttons with Polished Micro-Interactions */}
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          {/* Primary Action Button with Light-sweep */}
          <Link
            to={(hero.primaryBtnLink as any) || "/contact"}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-sm sm:text-base font-bold text-slate-950 bg-[#27e2c4] hover:bg-[#20dcb8] px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(39,226,196,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] overflow-hidden"
          >
            {/* Shimmer reflection */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 pointer-events-none" />
            <span className="relative z-10">{hero.primaryBtnText || "Start Your Project"}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Secondary Action Button with Frosted Glass Border */}
          <Link
            to={(hero.secondaryBtnLink as any) || "/portfolio"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-white/90 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#27e2c4]/40 backdrop-blur-xl px-7 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{hero.secondaryBtnText || "Explore Case Studies"}</span>
          </Link>
        </motion.div>

        {/* 5. Studio Product Mockup Showcase — Replaces Cliché Blank Space with Tangible Craft */}
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 sm:mt-20 max-w-5xl mx-auto"
        >
          <div
            ref={mockupRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative rounded-2xl sm:rounded-3xl bg-[#0b132b]/90 border border-slate-800/90 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8),0_0_50px_rgba(39,226,196,0.12)] overflow-hidden text-left transition-all duration-300"
          >
            {/* Interactive Spotlight Radial Glow following cursor */}
            {isHovered && (
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
                style={{
                  background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(39, 226, 196, 0.08), transparent 70%)`,
                }}
              />
            )}

            {/* macOS / Dark Browser Chrome Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#070d1e] border-b border-slate-800/80 relative z-20">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors inline-block cursor-pointer" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors inline-block cursor-pointer" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors inline-block cursor-pointer" />
                <div className="ml-3 hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#131f37]/80 border border-slate-800 text-[11px] font-mono text-slate-400">
                  <Lock className="w-3 h-3 text-[#27e2c4]" />
                  <span className="text-[#27e2c4]">https://</span>
                  <span>{hero.mockupUrl || "app.arshio.dev/operations-dashboard"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  <span>{hero.mockupStatus || "Live Engine: 99.98%"}</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                  v2.6 Production
                </span>
              </div>
            </div>

            {/* Dashboard Content Mockup Grid */}
            <div className="p-5 sm:p-8 bg-[#0b132b]/80 relative z-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
                {/* Left Mini Stats & Architecture Stack */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-[#070d1e] p-4 sm:p-5 rounded-2xl border border-slate-800/90 hover:border-[#27e2c4]/30 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                        Full-Stack Architecture
                      </div>
                      <Cpu className="w-4 h-4 text-[#27e2c4] group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="mt-2 text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      Multi-Tier Cloud ERP
                    </div>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      Custom Node.js + PostgreSQL database engine with live automated warehouse dispatching.
                    </p>
                  </div>

                  <div className="bg-[#070d1e] p-4 sm:p-5 rounded-2xl border border-slate-800/90 hover:border-[#27e2c4]/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                        Edge Web Performance
                      </div>
                      <Activity className="w-4 h-4 text-[#27e2c4] animate-pulse" />
                    </div>
                    <div className="mt-2 text-2xl sm:text-3xl font-black text-[#27e2c4] font-display flex items-baseline gap-2">
                      0.58s
                      <span className="text-xs font-normal text-slate-400">Global Average</span>
                    </div>
                    <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "96%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        className="bg-gradient-to-r from-[#27e2c4] to-[#38bdf8] h-full rounded-full shadow-[0_0_10px_rgba(39,226,196,0.5)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Center / Right Visual Performance Canvas */}
                <div className="lg:col-span-8 bg-[#070d1e] p-5 sm:p-6 rounded-2xl border border-slate-800/90 flex flex-col justify-between space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-[#27e2c4]" /> Real-Time Business Velocity & Telemetry
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">Automated synchronization across all digital touchpoints</div>
                    </div>
                    <span className="text-xs font-mono text-[#27e2c4] bg-[#27e2c4]/10 px-2.5 py-1 rounded-full border border-[#27e2c4]/30 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#27e2c4] animate-pulse" />
                      Zero Manual Bloat
                    </span>
                  </div>

                  {/* Animated Visual Graph Bars */}
                  <div className="grid grid-cols-6 gap-2 sm:gap-3 items-end h-28 sm:h-36 pt-4 px-2 border-b border-slate-800">
                    {SPRINT_BARS.map((bar, i) => (
                      <div key={bar.month} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[10px] font-mono text-[#27e2c4] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                          {bar.val}
                        </span>
                        <motion.div
                          initial={{ height: "0%" }}
                          whileInView={{ height: bar.h }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                          className={`w-full rounded-t-lg transition-colors ${
                            bar.current
                              ? "bg-gradient-to-t from-[#27e2c4] to-[#5eead4] shadow-[0_0_20px_rgba(39,226,196,0.35)]"
                              : "bg-[#131f37] hover:bg-[#1a2948]"
                          }`}
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
        </motion.div>

        {/* 6. Clean Grounded Trust Strip — With Frosted Glass Polish */}
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 sm:mt-16 p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/8 backdrop-blur-md grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800/60"
        >
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">120+</div>
            <div className="text-[11px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Projects Delivered</div>
          </div>
          <div className="text-center p-2 pt-4 md:pt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#27e2c4] font-display">99.4%</div>
            <div className="text-[11px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">On-Time SLA Record</div>
          </div>
          <div className="text-center p-2 pt-4 md:pt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">4.8M+</div>
            <div className="text-[11px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Video Views Generated</div>
          </div>
          <div className="text-center p-2 pt-4 md:pt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-display">3.5x</div>
            <div className="text-[11px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Client ROI Multiple</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
