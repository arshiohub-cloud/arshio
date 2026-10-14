import { ArrowRight, Check, Sparkles, TrendingUp, Cpu, Zap, Layout, Video } from "lucide-react";
import { useFadeIn } from "@/hooks/use-fade-in";
import { SERVICES } from "@/data/services";
import { Link } from "@tanstack/react-router";

export function Services() {
  return (
    <section
      id="services"
      className="relative py-20 sm:py-28 bg-transparent border-b border-white/5 overflow-hidden"
    >
      {/* Brand Ambient Glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(1000px 450px at 20% 0%, rgba(39,226,196,0.12), transparent 60%), radial-gradient(800px 400px at 90% 80%, rgba(56,189,248,0.08), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <header className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider mb-4 font-mono">
            <Sparkles className="w-3.5 h-3.5" /> Six Specialized Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            High-Impact Engineering & Creative Services{" "}
            <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">
              Under One Roof.
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            From initial system architecture and dark-mode Figma prototypes to scalable cloud deployment and algorithm-optimized video reels.
          </p>
        </header>

        {/* Asymmetric Bento Grid — Eliminates Generic Clone Card Syndrome */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <BentoServiceCard key={s.slug} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoServiceCard({
  slug,
  Icon,
  title,
  desc,
  bullets,
  tags,
  index,
}: (typeof SERVICES)[number] & { index: number }) {
  const ref = useFadeIn<HTMLAnchorElement>();
  const num = String(index + 1).padStart(2, "0");
  const brandAccent = "#27e2c4";

  // Flagship 1: Custom ERP & Software (2 columns wide on desktop)
  const isLargeERP = index === 0;
  // Flagship 2: Performance Marketing (Full width 3 columns banner on desktop)
  const isWideMarketing = index === 5;

  const colSpanClass = isLargeERP
    ? "lg:col-span-2"
    : isWideMarketing
    ? "lg:col-span-3 md:col-span-2"
    : "lg:col-span-1";

  return (
    <Link
      ref={ref}
      to="/services"
      className={`fade-up group relative block overflow-hidden rounded-3xl bg-[#0b132b] border border-slate-800/80 transition-all duration-300 hover:border-[#27e2c4]/40 hover:-translate-y-1 shadow-xl flex flex-col justify-between ${colSpanClass}`}
    >
      {/* Top accent glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-15 group-hover:opacity-50 transition-opacity duration-500"
        style={{ background: brandAccent }}
      />

      <div className="relative p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div
              className="flex items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110"
              style={{
                width: 52,
                height: 52,
                background: "rgba(39, 226, 196, 0.1)",
                border: "1px solid rgba(39, 226, 196, 0.3)",
                boxShadow: "0 0 25px rgba(39, 226, 196, 0.15)",
              }}
            >
              <Icon size={24} color={brandAccent} />
            </div>

            <div className="flex items-center gap-2">
              {isLargeERP && (
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider text-[#27e2c4] bg-[#27e2c4]/10 border border-[#27e2c4]/30 px-2.5 py-0.5 rounded-full">
                  Flagship Enterprise Architecture
                </span>
              )}
              {isWideMarketing && (
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/30 px-2.5 py-0.5 rounded-full">
                  Full-Funnel Growth
                </span>
              )}
              <span className="tabular-nums text-xs font-mono font-bold tracking-widest text-[#27e2c4]">
                {num} / 06
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:text-[#27e2c4] transition-colors">
            {title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-300">{desc}</p>

          {/* Deliverables List */}
          <ul
            className={`mt-6 space-y-2.5 ${
              isLargeERP || isWideMarketing
                ? "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 space-y-0"
                : ""
            }`}
          >
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-xs text-slate-200">
                <span className="mt-0.5 flex items-center justify-center rounded-full bg-[#27e2c4]/15 border border-[#27e2c4]/40 p-0.5 shrink-0">
                  <Check size={10} color={brandAccent} strokeWidth={3} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Tags & Link */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#131f37] text-slate-300 border border-slate-800"
              >
                {t}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#27e2c4] group-hover:translate-x-1 transition-transform ml-auto">
            Explore Capabilities <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
