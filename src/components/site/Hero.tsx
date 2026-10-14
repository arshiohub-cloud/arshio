import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const SERVICES_TYPEWRITER = [
  { text: "UI/UX & Brand Systems", icon: "🎨", color: "#27e2c4" },
  { text: "Viral Motion & Video Reels", icon: "🎬", color: "#8b5cf6" },
  { text: "Custom ERP & Software", icon: "⚡", color: "#00e5b0" },
  { text: "iOS & Android Mobile Apps", icon: "📱", color: "#38bdf8" },
  { text: "Performance Growth & Ads", icon: "🚀", color: "#3b82f6" },
];

function useTypewriter(words: string[], typeMs = 65, holdMs = 1400, eraseMs = 30) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"type" | "hold" | "erase">("type");

  useEffect(() => {
    const word = words[i];
    let t: ReturnType<typeof setTimeout>;
    if (phase === "type") {
      if (text.length < word.length) {
        t = setTimeout(() => setText(word.slice(0, text.length + 1)), typeMs);
      } else {
        t = setTimeout(() => setPhase("erase"), holdMs);
      }
    } else if (phase === "erase") {
      if (text.length > 0) {
        t = setTimeout(() => setText(word.slice(0, text.length - 1)), eraseMs);
      } else {
        setI((n) => (n + 1) % words.length);
        setPhase("type");
      }
    }
    return () => clearTimeout(t!);
  }, [text, phase, i, words, typeMs, holdMs, eraseMs]);

  return { text, index: i };
}

export function Hero() {
  const { text: typed, index: srvIdx } = useTypewriter(SERVICES_TYPEWRITER.map((s) => s.text));
  const currentSrv = SERVICES_TYPEWRITER[srvIdx];

  return (
    <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden bg-transparent text-white py-16 sm:py-24 border-b border-white/5">
      {/* Brand Ambient Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[500px] bg-gradient-to-b from-[#27e2c4]/15 via-[#131f37]/30 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#27e2c4]/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 backdrop-blur-md text-[11px] sm:text-xs font-semibold text-[#27e2c4] mb-6 sm:mb-8 shadow-lg shadow-[#27e2c4]/10">
          <Sparkles className="w-3.5 h-3.5 text-[#27e2c4]" />
          <span>All-in-One Digital & Creative Studio</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.12]">
          Design-Led Digital Products That <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">
            Scale Your Business Fast.
          </span>
        </h1>

        {/* Dynamic Typewriter Pill with Responsive Wrap */}
        <div className="mt-6 sm:mt-8 flex items-center justify-center px-2">
          <div
            className="inline-flex items-center justify-center gap-2 sm:gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0b132b]/90 border border-slate-800 shadow-2xl backdrop-blur-xl transition-all duration-300 max-w-full flex-wrap"
            style={{ borderColor: `${currentSrv.color}66` }}
          >
            <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-slate-400">
              Specialized In:
            </span>
            <span className="text-lg sm:text-xl leading-none">{currentSrv.icon}</span>
            <span
              className="text-xs sm:text-lg font-bold font-mono text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(90deg, ${currentSrv.color}, #ffffff)` }}
            >
              {typed || "\u00A0"}
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="mt-5 sm:mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From high-converting UI/UX and viral motion reels to custom ERP systems, native mobile apps, and performance growth campaigns.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-slate-950 bg-[#27e2c4] hover:bg-[#1fd6b9] px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl shadow-xl shadow-[#27e2c4]/25 transition-all hover:scale-105 active:scale-95"
          >
            Start Your Project <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <Link
            to="/pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-white bg-[#131f37] hover:bg-[#1a2948] border border-slate-800 px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl transition-all"
          >
            Explore Pricing & Tiers
          </Link>
        </div>

        {/* Trust Badges & Stats */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">120+</div>
            <div className="text-[11px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Projects Delivered</div>
          </div>
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#27e2c4]">99.4%</div>
            <div className="text-[11px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Client Satisfaction</div>
          </div>
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">4.8M+</div>
            <div className="text-[11px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Video Views Generated</div>
          </div>
          <div className="text-center p-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">3.5x</div>
            <div className="text-[11px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Average ROI Increase</div>
          </div>
        </div>
      </div>
    </section>
  );
}
