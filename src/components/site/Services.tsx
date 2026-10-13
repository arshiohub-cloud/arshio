import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useFadeIn } from "@/hooks/use-fade-in";
import { SERVICES } from "@/data/services";
import { Link } from "@tanstack/react-router";

export function Services() {
  return (
    <section
      id="services"
      className="relative py-24 md:py-32 bg-[#070d1e] border-b border-slate-800/80 overflow-hidden"
    >
      {/* Brand Ambient Glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(1000px 450px at 20% 0%, rgba(39,226,196,0.15), transparent 60%), radial-gradient(800px 400px at 90% 80%, rgba(56,189,248,0.10), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <header className="max-w-3xl mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Core Expertise
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            High-Impact Services Engineered <br />
            <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent italic">
              for Business Growth.
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl">
            Six focused service pillars designed to scale your brand with world-class design, video, code, and marketing.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.slug} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
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

  return (
    <Link
      ref={ref}
      to="/services"
      className="fade-up group relative block overflow-hidden rounded-2xl bg-[#0b132b] border border-slate-800/80 transition-all duration-300 hover:border-[#27e2c4]/40 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
    >
      {/* Top accent glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-20 group-hover:opacity-60 transition-opacity duration-500"
        style={{ background: brandAccent }}
      />

      <div className="relative p-7 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4 mb-6">
            <div
              className="flex items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110"
              style={{
                width: 54,
                height: 54,
                background: "rgba(39, 226, 196, 0.1)",
                border: "1px solid rgba(39, 226, 196, 0.3)",
                boxShadow: "0 0 25px rgba(39, 226, 196, 0.2)",
              }}
            >
              <Icon size={26} color={brandAccent} />
            </div>
            <span className="tabular-nums text-xs font-mono font-bold tracking-widest text-[#27e2c4]">
              {num} / 06
            </span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#27e2c4] transition-colors">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{desc}</p>

          <ul className="mt-6 space-y-2.5">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="mt-0.5 flex items-center justify-center rounded-full bg-[#27e2c4]/15 border border-[#27e2c4]/40 p-0.5 shrink-0">
                  <Check size={10} color={brandAccent} strokeWidth={3} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-[#131f37] text-[#27e2c4] border border-[#27e2c4]/20"
              >
                {t}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#27e2c4] group-hover:translate-x-1 transition-transform">
            Explore <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
