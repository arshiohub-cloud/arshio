import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Play, ChevronDown } from "lucide-react";
import { StatCounter } from "./StatCounter";

const ROTATING_WORDS = [
  "UI/UX Design",
  "Web Apps",
  "Mobile Apps",
  "Motion & Video",
  "Growth Marketing",
];

const HEADLINE_WORDS = ["Design-led", "digital", "products", "that", "scale", "your", "business."];

/**
 * Hero — Premium hero section with staggered headline reveal,
 * rotating service word, floating UI mockup composition, and trust strip.
 */
export function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-32 sm:pt-36 pb-16 px-6 sm:px-8">
      <div className="mx-auto max-w-7xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-[#2DE0C6]/8 border border-[#2DE0C6]/15 px-4 py-1.5 text-xs font-semibold text-[#2DE0C6] uppercase tracking-[0.15em] font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2DE0C6] animate-pulse" />
                Digital Agency
              </span>
            </motion.div>

            {/* Headline — word-by-word stagger */}
            <h1 className="hero-h1 mt-6">
              {HEADLINE_WORDS.map((word, i) => (
                <motion.span
                  key={word}
                  className="inline-block mr-[0.25em]"
                  initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subline */}
            <motion.p
              className="mt-5 text-lg sm:text-xl text-white/60 leading-relaxed max-w-lg"
              initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              We partner with ambitious teams to design, build, and grow{" "}
              <span className="text-white/90 font-medium">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    className="inline-block text-[#2DE0C6]"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {ROTATING_WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>{" "}
              that deliver real results.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <Link to="/contact" className="btn-primary text-base py-3.5 px-8">
                Start Your Project
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/portfolio"
                className="btn-ghost text-base py-3.5 px-8"
              >
                <Play className="h-4 w-4" />
                View Our Work
              </Link>
            </motion.div>
          </div>

          {/* Right: Floating UI Composition */}
          <motion.div
            className="relative hidden lg:flex items-center justify-center"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <HeroVisual />
          </motion.div>
        </div>

        {/* Trust Strip: Stats */}
        <motion.div
          className="mt-20 lg:mt-24"
          initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <div className="section-divider mb-10" />
          <StatCounter />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <motion.button
            onClick={() => {
              document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center gap-1 text-white/30 hover:text-white/50 transition-colors"
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            aria-label="Scroll to services"
          >
            <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
            <ChevronDown className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * HeroVisual — Floating composition of 3 code-drawn UI mockup cards
 * with parallax-style gentle float animation.
 */
function HeroVisual() {
  return (
    <div className="relative w-full max-w-lg h-[440px]">
      {/* Card 1: Dashboard */}
      <motion.div
        className="absolute top-0 right-0 w-72 glass-card p-0 overflow-hidden shadow-2xl"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
          </div>
          <span className="text-[10px] font-mono text-white/30 ml-2">analytics-dashboard.app</span>
        </div>
        {/* Content mock */}
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Revenue</span>
            <span className="text-sm font-bold text-[#2DE0C6]">+24.5%</span>
          </div>
          {/* Mini bar chart */}
          <div className="flex items-end gap-1 h-16">
            {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-[#2DE0C6]/40 to-[#22B8F0]/30"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex gap-4 text-[10px] text-white/30">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
          </div>
        </div>
      </motion.div>

      {/* Card 2: Mobile App */}
      <motion.div
        className="absolute bottom-8 left-0 w-48 glass-card p-0 overflow-hidden shadow-2xl"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="px-4 py-3 border-b border-white/5">
          <span className="text-[10px] font-mono text-white/30">FitPulse \u2014 iOS</span>
        </div>
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#EC4899]/30 to-[#8B5CF6]/30 flex items-center justify-center">
              <span className="text-lg">❤️</span>
            </div>
            <div>
              <div className="text-xs font-medium text-white/80">Heart Rate</div>
              <div className="text-lg font-bold text-[#EC4899]">72 BPM</div>
            </div>
          </div>
          {/* Pulse line */}
          <svg viewBox="0 0 160 40" className="w-full h-8 text-[#EC4899]/50">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              points="0,20 20,20 30,8 40,32 50,20 60,20 80,20 90,5 100,35 110,20 130,20 140,15 150,25 160,20"
            />
          </svg>
        </div>
      </motion.div>

      {/* Card 3: Motion Timeline */}
      <motion.div
        className="absolute bottom-0 right-8 w-56 glass-card p-0 overflow-hidden shadow-2xl"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
      >
        <div className="px-4 py-3 border-b border-white/5">
          <span className="text-[10px] font-mono text-white/30">motion-timeline.ae</span>
        </div>
        <div className="px-4 py-3 space-y-2">
          {/* Timeline tracks */}
          {[
            { label: "Text", color: "#2DE0C6", w: "80%" },
            { label: "Video", color: "#22B8F0", w: "65%" },
            { label: "Audio", color: "#8B5CF6", w: "90%" },
            { label: "FX", color: "#F59E0B", w: "50%" },
          ].map((track) => (
            <div key={track.label} className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-white/30 w-8">{track.label}</span>
              <div className="flex-1 h-3 rounded-sm bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-sm opacity-60"
                  style={{
                    width: track.w,
                    background: `linear-gradient(90deg, ${track.color}80, ${track.color}40)`,
                  }}
                />
              </div>
            </div>
          ))}
          {/* Playhead */}
          <div className="relative h-4 mt-1">
            <div className="absolute left-[60%] top-0 bottom-0 w-[2px] bg-[#2DE0C6] rounded-full" />
            <div className="absolute left-[60%] -top-1 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-[#2DE0C6] border-2 border-[#050A18]" />
          </div>
        </div>
      </motion.div>

      {/* Ambient glow behind cards */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 60% 50%, rgba(45,224,198,0.08), transparent 70%)",
        }}
      />
    </div>
  );
}
