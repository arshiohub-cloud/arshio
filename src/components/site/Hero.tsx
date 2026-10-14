import { useState, useRef } from "react";
import { ArrowRight, ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useSiteSettings } from "@/lib/cms-store";

// Curated flagship case studies for the cinematic hero showcase
const FEATURED_WORKS = [
  {
    id: "omni-ecommerce-web",
    tabLabel: "Omni E-Commerce",
    client: "Omni Apparel Global",
    discipline: "Headless E-Commerce & Web Platform",
    title: "Sub-Second Global Luxury Storefront",
    description:
      "Engineered an ultra-fast Next.js 15 headless architecture with server-side rendering, instant cart slide-over, and multi-currency edge routing.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85",
    metricValue: "+210%",
    metricLabel: "Checkout Conversion Lift",
    secondaryMetric: "0.58s Page Load",
    techStack: ["Next.js 15", "React 19", "Tailwind CSS", "Shopify API"],
  },
  {
    id: "fitpulse-fitness-app",
    tabLabel: "FitPulse Mobile",
    client: "FitPulse Health Tech",
    discipline: "iOS & Android Mobile App",
    title: "Live Workout Companion & Biometrics",
    description:
      "Crafted a cross-platform mobile suite featuring real-time Bluetooth heart rate telemetry, customizable training regimes, and 60fps gesture physics.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1400&q=85",
    metricValue: "85K+",
    metricLabel: "App Store Downloads",
    secondaryMetric: "4.9 ★ Rating",
    techStack: ["React Native", "Swift", "Firebase", "BLE Sensors"],
  },
  {
    id: "apex-enterprise-erp",
    tabLabel: "Apex Cloud ERP",
    client: "Apex Global Logistics",
    discipline: "Custom Software & Cloud ERP",
    title: "Multi-Warehouse Inventory & Dispatch Engine",
    description:
      "Replaced disjointed legacy systems with an automated cloud ERP synchronizing 4 regional hubs, barcode scanning, and instant P&L accounting.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85",
    metricValue: "-68%",
    metricLabel: "Operational Lag Reduced",
    secondaryMetric: "99.9% Inventory Accuracy",
    techStack: ["Node.js", "PostgreSQL", "Docker", "REST Engine"],
  },
  {
    id: "hyper-glow-viral-reels",
    tabLabel: "HyperGlow Motion",
    client: "HyperGlow Beverage Co.",
    discipline: "3D Motion & Social Campaign",
    title: "Scroll-Stopping Viral Social Reels",
    description:
      "Storyboarded, modeled, and directed 12 high-energy 3D product motion commercials engineered specifically for Gen-Z TikTok and Reels funnels.",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1400&q=85",
    metricValue: "4.2M+",
    metricLabel: "Organic Video Views",
    secondaryMetric: "4.5x Campaign ROAS",
    techStack: ["After Effects", "Cinema 4D", "Sound Design", "4K HDR"],
  },
];

const TRUSTED_CLIENTS = [
  "Omni Apparel",
  "Apex Supply Chain",
  "FitPulse Health",
  "HyperGlow Beverage",
  "MedFlow Clinics",
  "CloudScale Tech",
  "Nexus Analytics",
];

export function Hero() {
  const [settings] = useSiteSettings();
  const hero = settings.hero;
  const prefersReduced = useReducedMotion();

  // Active featured flagship project
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const activeProject = FEATURED_WORKS[activeProjectIdx];

  // Subtle interactive mouse spotlight on hover
  const stageRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section className="relative overflow-hidden bg-transparent text-white pt-16 sm:pt-24 pb-16 sm:pb-24 border-b border-white/5">
      {/* Cinematic Ambient Glow Effects — Breathing Dynamic Mesh */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1100px] h-[450px] sm:h-[650px] rounded-full blur-[150px] pointer-events-none opacity-40 animate-pulse-slow"
        style={{
          background: "radial-gradient(circle, rgba(39,226,196,0.18) 0%, rgba(19,31,55,0.3) 60%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="absolute top-1/3 right-[5%] w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-25 animate-drift-slow"
        style={{
          background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Modern Subtle Technical Mesh Pattern */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)]"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* 1. Confident Studio Pill with Glowing Radar Beacon */}
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

        {/* 3. Subtitle */}
        <motion.p
          initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-base sm:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed"
        >
          {hero.subtitle}
        </motion.p>

        {/* 4. Action CTAs */}
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <Link
            to={(hero.primaryBtnLink as any) || "/contact"}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-sm sm:text-base font-bold text-slate-950 bg-[#27e2c4] hover:bg-[#20dcb8] px-8 py-4 rounded-full shadow-[0_0_30px_rgba(39,226,196,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] overflow-hidden"
          >
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 pointer-events-none" />
            <span className="relative z-10">{hero.primaryBtnText || "Start Your Project"}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            to={(hero.secondaryBtnLink as any) || "/portfolio"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-white/90 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#27e2c4]/40 backdrop-blur-xl px-7 py-4 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{hero.secondaryBtnText || "Explore Case Studies"}</span>
          </Link>
        </motion.div>

        {/* 5. CINEMATIC FLAGSHIP WORK SHOWCASE — Top Agency Style (Clay & MetaLab Inspired) */}
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 sm:mt-18 max-w-5xl mx-auto"
        >
          <div
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative rounded-2xl sm:rounded-3xl bg-[#0b132b]/90 border border-slate-800/90 shadow-[0_25px_90px_-20px_rgba(0,0,0,0.85),0_0_50px_rgba(39,226,196,0.12)] overflow-hidden text-left transition-all duration-300"
          >
            {/* Interactive Spotlight Radial Glow */}
            {isHovered && (
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
                style={{
                  background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(39, 226, 196, 0.08), transparent 70%)`,
                }}
              />
            )}

            {/* Showcase Stage Header with Clean Project Tabs */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#070d1e] border-b border-slate-800/80 relative z-20 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/70 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/70 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/70 inline-block" />
                <span className="ml-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 hidden sm:inline">
                  Featured Case Studies
                </span>
              </div>

              {/* Clean Minimal Project Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                {FEATURED_WORKS.map((work, idx) => {
                  const isActive = activeProjectIdx === idx;
                  return (
                    <button
                      key={work.id}
                      onClick={() => setActiveProjectIdx(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "bg-[#27e2c4] text-slate-950 font-bold shadow-sm shadow-[#27e2c4]/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {work.tabLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cinematic Visual Stage Display with Cross-Fade */}
            <div className="relative min-h-[440px] sm:min-h-0 sm:aspect-[21/10] lg:aspect-[2.2/1] overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={activeProject.image}
                    alt={activeProject.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Cinematic Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070d1e] via-[#070d1e]/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#070d1e]/80 via-transparent to-transparent hidden sm:block" />

                  {/* Visual Floating Info Overlay */}
                  <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-end">
                    <div className="max-w-2xl">
                      {/* Discipline & Client Pill */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[11px] font-mono uppercase font-bold text-[#27e2c4] bg-[#070d1e]/90 px-2.5 py-1 rounded-md border border-[#27e2c4]/30 backdrop-blur-md">
                          {activeProject.client}
                        </span>
                        <span className="text-xs text-slate-300 font-mono hidden sm:inline">
                          • {activeProject.discipline}
                        </span>
                      </div>

                      {/* Project Headline */}
                      <h3 className="text-lg sm:text-3xl font-extrabold text-white font-display tracking-tight leading-snug drop-shadow-md">
                        {activeProject.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-xl leading-relaxed hidden sm:block">
                        {activeProject.description}
                      </p>

                      {/* Outcome & Action Footer */}
                      <div className="mt-4 flex items-center gap-3 sm:gap-4 flex-wrap">
                        {/* Primary Impact Chip */}
                        <div className="inline-flex items-center gap-2 bg-[#070d1e]/95 border border-slate-700/80 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl backdrop-blur-md shadow-lg">
                          <CheckCircle2 className="w-4 h-4 text-[#27e2c4] shrink-0" />
                          <div className="text-left">
                            <span className="text-sm sm:text-base font-extrabold text-[#27e2c4] font-display">
                              {activeProject.metricValue}
                            </span>
                            <span className="text-[10px] text-slate-300 ml-1.5 uppercase font-mono">
                              {activeProject.metricLabel}
                            </span>
                          </div>
                        </div>

                        {/* Secondary Metric */}
                        <span className="text-xs font-mono text-slate-300 bg-black/40 px-3 py-1.5 sm:py-2 rounded-xl border border-white/5 backdrop-blur-md hidden md:inline-block">
                          {activeProject.secondaryMetric}
                        </span>

                        {/* View Case Study CTA Link */}
                        <Link
                          to="/portfolio"
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white hover:text-[#27e2c4] bg-white/10 hover:bg-white/15 px-3.5 py-2 rounded-xl border border-white/10 backdrop-blur-md transition-all group/link"
                        >
                          <span>Explore Case Study</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* 6. MINIMALIST SOCIAL PROOF & STATS STRIP — Clean, Breathable, Sophisticated */}
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 pt-10 border-t border-slate-800/80 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 text-center lg:text-left"
        >
          {/* Left: Trusted Client Names Ticker */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 whitespace-nowrap">
              Trusted By Teams At:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-bold font-display text-slate-300">
              {TRUSTED_CLIENTS.slice(0, 5).map((client) => (
                <span
                  key={client}
                  className="hover:text-white transition-colors duration-200 cursor-default"
                >
                  {client}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Clean, Crisp Inline Outcomes */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-4 sm:gap-7 text-xs font-mono text-slate-300 pt-2 lg:pt-0">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="text-sm sm:text-base font-extrabold text-white font-display">$14M+</span>
              <span className="text-slate-400">GMV Driven</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="text-sm sm:text-base font-extrabold text-white font-display">50+</span>
              <span className="text-slate-400">Shipped</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="text-sm sm:text-base font-extrabold text-[#27e2c4] font-display">4.9/5</span>
              <span className="text-slate-400">Rating</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="text-sm sm:text-base font-extrabold text-sky-400 font-display">100%</span>
              <span className="text-slate-400">IP Owned</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
