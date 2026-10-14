import { useState, useRef } from "react";
import {
  ArrowRight,
  Globe,
  Smartphone,
  Palette,
  Layers,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Activity,
  Sparkles,
  ExternalLink,
  TrendingUp,
  Cpu,
  Monitor,
  Terminal,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { useSiteSettings } from "@/lib/cms-store";

const STUDIO_MODES = [
  {
    id: "web",
    label: "Web Platform",
    icon: Globe,
    tag: "Next.js 15 • React 19 • Tailwind",
    projectName: "Aurelia Global Commerce Suite",
    url: "preview.arshio.agency/aurelia-storefront",
    speed: "340ms",
    speedLabel: "Global Edge TTFB",
    score: "100/100",
    scoreLabel: "Core Web Vitals",
    impact: "+38.4% Checkout Conversion Lift",
    description: "High-performance headless e-commerce platform with sub-second route changes and instant edge caching.",
    uiBadge: "Live Production Preview",
    primaryMetric: "$428,950",
    primaryMetricLabel: "Monthly Volume Processed",
    secondaryMetric: "0.28s",
    secondaryMetricLabel: "Average Page Hydration",
  },
  {
    id: "mobile",
    label: "Mobile Apps",
    icon: Smartphone,
    tag: "React Native • Swift • GraphQL",
    projectName: "VitalSync Telehealth & Health OS",
    url: "preview.arshio.agency/vitalsync-mobile-app",
    speed: "60 FPS",
    speedLabel: "Native Frame Fluidity",
    score: "4.9 / 5.0",
    scoreLabel: "App Store Rating",
    impact: "85K+ Active Patient Downloads",
    description: "Cross-platform mobile healthcare suite featuring biometric authentication and offline-first encrypted sync.",
    uiBadge: "iOS & Android Build v3.4",
    primaryMetric: "85,420",
    primaryMetricLabel: "Active Monthly Users",
    secondaryMetric: "99.98%",
    secondaryMetricLabel: "Crash-Free Session Rate",
  },
  {
    id: "software",
    label: "Custom ERP & SaaS",
    icon: Cpu,
    tag: "Node.js • PostgreSQL • Redis",
    projectName: "Apex Logistics & Dispatch Engine",
    url: "preview.arshio.agency/apex-cloud-erp",
    speed: "42ms",
    speedLabel: "Database Query Latency",
    score: "99.99%",
    scoreLabel: "System Uptime SLA",
    impact: "68% Operational Overhead Cut",
    description: "Multi-tenant cloud ERP with automated inventory routing, barcode sync, and webhook dispatching.",
    uiBadge: "Enterprise Cloud Engine",
    primaryMetric: "142,000",
    primaryMetricLabel: "Daily Warehouse Dispatches",
    secondaryMetric: "Zero",
    secondaryMetricLabel: "Manual Data Entry Lag",
  },
  {
    id: "motion",
    label: "Motion & Reels",
    icon: Layers,
    tag: "After Effects • Cinema 4D • 4K",
    projectName: "HyperGlow Viral Global Campaign",
    url: "preview.arshio.agency/hyperglow-motion-suite",
    speed: "4K 60fps",
    speedLabel: "Master Export Quality",
    score: "4.5x",
    scoreLabel: "Verified Campaign ROAS",
    impact: "4.2M+ Organic Video Views",
    description: "Algorithm-optimized social motion reels with frame-perfect retention pacing for Meta and TikTok.",
    uiBadge: "Viral Creative Campaign",
    primaryMetric: "4,215,800",
    primaryMetricLabel: "Total Organic Video Views",
    secondaryMetric: "4.5x",
    secondaryMetricLabel: "Paid Ad Return Multiple",
  },
];

export function Hero() {
  const [settings] = useSiteSettings();
  const hero = settings.hero;
  const prefersReduced = useReducedMotion();

  // Active studio discipline mode in the mockup
  const [activeModeId, setActiveModeId] = useState<string>("web");
  const activeMode = STUDIO_MODES.find((m) => m.id === activeModeId) || STUDIO_MODES[0];

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

        {/* 5. Authentic Digital Studio Workstation Showcase — Replaces Cliché Blank Space with Real Craft */}
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
            className="relative rounded-2xl sm:rounded-3xl bg-[#0b132b]/95 border border-slate-800/90 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.85),0_0_50px_rgba(39,226,196,0.12)] overflow-hidden text-left transition-all duration-300"
          >
            {/* Interactive Spotlight Radial Glow following cursor */}
            {isHovered && (
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
                style={{
                  background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(39, 226, 196, 0.08), transparent 70%)`,
                }}
              />
            )}

            {/* macOS Browser Chrome Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#070d1e] border-b border-slate-800/80 relative z-20">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                <div className="ml-3 hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#131f37]/80 border border-slate-800 text-[11px] font-mono text-slate-400">
                  <Lock className="w-3 h-3 text-[#27e2c4]" />
                  <span className="text-[#27e2c4]">https://</span>
                  <span>{activeMode.url}</span>
                </div>
              </div>

              {/* Live Status indicator */}
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  <span>Studio Engine Live</span>
                </span>
                <span className="hidden md:inline-block text-[11px] font-mono text-slate-400">
                  v3.8 Production
                </span>
              </div>
            </div>

            {/* Interactive Discipline Selector Tabs — Lets Visitors Explore Arshio's Superpowers */}
            <div className="px-4 sm:px-6 py-2.5 bg-[#081024] border-b border-slate-800/70 flex items-center gap-2 overflow-x-auto scrollbar-none relative z-20">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
                Inspect Output:
              </span>
              {STUDIO_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = activeModeId === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveModeId(mode.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-[#27e2c4]/15 text-[#27e2c4] border border-[#27e2c4]/40 shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Workstation Canvas Body */}
            <div className="p-5 sm:p-7 bg-[#0b132b]/90 relative z-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
                {/* Left Architecture & Telemetry Specs */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Active Project & Tech Stack */}
                  <div className="bg-[#070d1e] p-4 sm:p-5 rounded-2xl border border-slate-800/90 group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-[#27e2c4] tracking-wider bg-[#27e2c4]/10 px-2 py-0.5 rounded border border-[#27e2c4]/20">
                        {activeMode.tag}
                      </span>
                      <Activity className="w-4 h-4 text-[#27e2c4] animate-pulse" />
                    </div>
                    <div className="mt-2.5 text-base sm:text-lg font-bold text-white font-display">
                      {activeMode.projectName}
                    </div>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {activeMode.description}
                    </p>
                  </div>

                  {/* Real-Time Live Performance Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#070d1e] p-3.5 sm:p-4 rounded-xl border border-slate-800/90">
                      <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                        {activeMode.speedLabel}
                      </div>
                      <div className="mt-1.5 text-xl sm:text-2xl font-black text-[#27e2c4] font-display flex items-baseline gap-1">
                        {activeMode.speed}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                        <TrendingUp className="w-3 h-3" /> Ultra-Low Latency
                      </div>
                    </div>

                    <div className="bg-[#070d1e] p-3.5 sm:p-4 rounded-xl border border-slate-800/90">
                      <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                        {activeMode.scoreLabel}
                      </div>
                      <div className="mt-1.5 text-xl sm:text-2xl font-black text-sky-400 font-display flex items-baseline gap-1">
                        {activeMode.score}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-sky-400 font-mono">
                        <Sparkles className="w-3 h-3" /> Audit Certified
                      </div>
                    </div>
                  </div>

                  {/* Impact Outcome Banner */}
                  <div className="bg-[#131f37]/70 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5 text-xs text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#27e2c4] shrink-0" />
                    <span className="font-semibold text-slate-200">
                      Verified Result: <strong className="text-[#27e2c4]">{activeMode.impact}</strong>
                    </span>
                  </div>
                </div>

                {/* Right Realistic Product Canvas Preview */}
                <div className="lg:col-span-7 bg-[#070d1e] p-5 sm:p-6 rounded-2xl border border-slate-800/90 flex flex-col justify-between space-y-4">
                  {/* Canvas App Bar Mock */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#27e2c4]" />
                      <span className="text-xs font-bold text-white font-display">
                        {activeMode.uiBadge}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                      <Monitor className="w-3 h-3 text-[#27e2c4]" />
                      <span>Desktop 1440px</span>
                    </div>
                  </div>

                  {/* Realistic Interactive UI Content Card */}
                  <div className="bg-[#0b132b] rounded-xl p-4 sm:p-5 border border-slate-800/80 shadow-inner space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-mono text-slate-400 text-[11px]">Primary Telemetry Metric</span>
                      <span className="text-[11px] font-mono text-[#27e2c4] bg-[#27e2c4]/10 px-2 py-0.5 rounded">
                        Active Sync
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                          {activeMode.primaryMetric}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {activeMode.primaryMetricLabel}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-bold text-[#27e2c4] font-display">
                          {activeMode.secondaryMetric}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {activeMode.secondaryMetricLabel}
                        </div>
                      </div>
                    </div>

                    {/* Animated Progress / Velocity Bar */}
                    <div className="pt-2">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Production Optimization Level</span>
                        <span className="text-[#27e2c4]">99.8% Perfect</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          key={activeMode.id}
                          initial={{ width: 0 }}
                          animate={{ width: "98%" }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="bg-gradient-to-r from-[#27e2c4] to-[#38bdf8] h-full rounded-full shadow-[0_0_10px_rgba(39,226,196,0.5)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Production Commit & SLA Guarantee */}
                  <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-400 border-t border-slate-800/60 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Terminal className="w-3.5 h-3.5 text-[#27e2c4]" />
                      <span>git commit: 52a0bf1 (0 errors)</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>100% Commercial IP Transfer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 6. Authority Grounded Trust Strip — Replaced Generic Stats with Concrete Business & Engineering Outcomes */}
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 sm:mt-16 p-5 sm:p-7 rounded-2xl bg-[#0b132b]/80 border border-slate-800/90 backdrop-blur-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-slate-800/80 text-left sm:text-center"
        >
          {/* Stat 1: Revenue & GMV */}
          <div className="p-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              $14.2M+
            </div>
            <div className="text-xs sm:text-sm text-slate-200 mt-1 font-bold">
              Client Revenue Enabled
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Across launched SaaS platforms, custom software, and high-converting storefronts.
            </div>
          </div>

          {/* Stat 2: Edge Speed */}
          <div className="p-2 pt-5 sm:pt-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#27e2c4] font-display tracking-tight">
              &lt; 380ms
            </div>
            <div className="text-xs sm:text-sm text-slate-200 mt-1 font-bold">
              Sub-Second Global TTFB
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Obsessive 100/100 Core Web Vitals standard with global edge CDN deployment.
            </div>
          </div>

          {/* Stat 3: Sprint Delivery */}
          <div className="p-2 pt-5 sm:pt-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-sky-400 font-display tracking-tight">
              99.4%
            </div>
            <div className="text-xs sm:text-sm text-slate-200 mt-1 font-bold">
              Sprint On-Time Delivery
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Agile 2-week deployment milestones with guaranteed weekly working staging builds.
            </div>
          </div>

          {/* Stat 4: IP Ownership */}
          <div className="p-2 pt-5 sm:pt-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-display tracking-tight">
              100%
            </div>
            <div className="text-xs sm:text-sm text-slate-200 mt-1 font-bold">
              Commercial IP Ownership
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Zero vendor lock-in. Complete Figma files, Git repos, and commercial rights transferred.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
