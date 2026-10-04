import type { ComponentType, ReactNode } from "react";
import { Check } from "lucide-react";
import { TopBar } from "@/components/site/TopBar";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FadeUp, CountUp, TiltCard } from "./anim";

export type ProductFeature = {
  Icon: ComponentType<{ size?: number; color?: string }>;
  title: string;
  desc: string;
  badge?: string;
};

export type ProductStat = { end: number; suffix?: string; prefix?: string; label: string };

export type ProductPageConfig = {
  category: string; // e.g. "Client ITES Product"
  emoji?: string;
  name: string;
  tagline: string;
  description: string;
  breadcrumb: string[]; // e.g. ["ITES Products","Client ITES","Omni Smart LMS"]
  liveUrl?: string;
  liveUrlLabel?: string; // visible URL chip
  trustBadges?: string[];
  features: ProductFeature[];
  featureCols?: 3 | 4;
  stats?: ProductStat[];
  techStack?: string[];
  chips?: { label: string; sub?: string }[]; // e.g. brand/impact/trusted chips
  chipsTitle?: string;
  unique?: ReactNode; // arbitrary unique section
  ctaText?: string;
  ctaHref?: string;
};

export function ProductPageTemplate(cfg: ProductPageConfig) {
  const featureCols = cfg.featureCols ?? 4;
  const live = cfg.liveUrl;
  return (
    <div className="min-h-screen bg-black text-white">
      <TopBar />
      <Navbar />
      <main>
        {/* HERO */}
        <section
          className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-[140px] md:pb-[100px]"
          style={{ background: "#000" }}
        >
          <div className="spotlight" />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 30%, rgba(124,58,237,0.25) 0%, rgba(124,58,237,0.05) 40%, transparent 70%)",
            }}
          />

          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <FadeUp>
              <nav className="text-[13px] text-[#888] mb-6">
                <a href="/" className="hover:text-white">Home</a>
                {cfg.breadcrumb.map((b, i) => (
                  <span key={b}>
                    <span className="mx-2 text-[#444]">›</span>
                    <span className={i === cfg.breadcrumb.length - 1 ? "text-white/80" : ""}>
                      {b}
                    </span>
                  </span>
                ))}
              </nav>
            </FadeUp>

            <FadeUp delay={80}>
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
                style={{
                  background: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  color: "#a78bfa",
                }}
              >
                {cfg.emoji} {cfg.category}
              </span>
            </FadeUp>

            <FadeUp delay={140}>
              <h1
                className="font-bold text-white tracking-tight"
                style={{ fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1.05 }}
              >
                {cfg.name}
              </h1>
            </FadeUp>

            <FadeUp delay={220}>
              <p
                className="mt-4 font-semibold"
                style={{
                  fontSize: "clamp(20px, 3vw, 32px)",
                  background: "linear-gradient(135deg, #a78bfa, #7c3aed, #4f46e5)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {cfg.tagline}
              </p>
            </FadeUp>

            <FadeUp delay={300}>
              <p
                className="mt-6 mx-auto text-[#888]"
                style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 600 }}
              >
                {cfg.description}
              </p>
            </FadeUp>

            <FadeUp delay={380}>
              <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                {live && (
                  <a
                    href={live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition bg-white text-black hover:bg-white/90"
                  >
                    View Live Platform
                  </a>
                )}
                <a
                  href={cfg.ctaHref ?? "/contact"}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition"
                  style={{
                    border: "1px solid #7c3aed",
                    color: "#a78bfa",
                    background: "rgba(124,58,237,0.08)",
                  }}
                >
                  {cfg.ctaText ?? "Request Demo"}
                </a>
              </div>
            </FadeUp>

            {cfg.trustBadges && cfg.trustBadges.length > 0 && (
              <FadeUp delay={460}>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] text-[#888]">
                  {cfg.trustBadges.map((t) => (
                    <span key={t} className="inline-flex items-center gap-2">
                      <Check className="w-4 h-4" style={{ color: "#7c3aed" }} />
                      {t}
                    </span>
                  ))}
                </div>
              </FadeUp>
            )}
          </div>
        </section>

        {/* LIVE EMBED */}
        {live && (
          <section className="relative py-16 sm:py-20 md:py-24 border-b border-white/5" style={{ background: "#0a0a0a" }}>
            <div className="relative max-w-7xl mx-auto px-4">
              <FadeUp>
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">See the Platform Live</h2>
                  <p className="mt-3 text-[#888] max-w-2xl mx-auto">
                    Explore {cfg.name} in real time — no signup required.
                  </p>
                </div>
              </FadeUp>
              <FadeUp delay={120}>
                <div
                  className="mx-auto"
                  style={{
                    maxWidth: 1100,
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 0 80px rgba(124,58,237,0.12)",
                  }}
                >
                  <div
                    className="flex items-center gap-3 px-4"
                    style={{ height: 40, background: "#111", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                      <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
                      <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
                    </div>
                    <div className="flex-1 text-center text-[12px] text-[#888] truncate px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.04)" }}>
                      {cfg.liveUrlLabel ?? new URL(live).host}
                    </div>
                  </div>
                  <iframe
                    src={live}
                    title={`${cfg.name} Live Platform`}
                    loading="lazy"
                    className="w-full block h-[420px] md:h-[650px]"
                    style={{ border: "none" }}
                  />
                </div>
                <div className="mt-3 text-center">
                  <a href={live} target="_blank" rel="noopener noreferrer" style={{ color: "#a78bfa", fontSize: 13 }} className="hover:underline">
                    Open Full Platform →
                  </a>
                </div>
              </FadeUp>
            </div>
          </section>
        )}

        {/* FEATURES */}
        <section className="relative py-16 sm:py-20 md:py-24 border-b border-white/5" style={{ background: "#000" }}>
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative max-w-7xl mx-auto px-4">
            <FadeUp>
              <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold rainbow-text">Platform Features</h2>
                <p className="mt-3 text-[#888] max-w-2xl mx-auto">
                  Everything {cfg.name} brings to your workflow.
                </p>
              </div>
            </FadeUp>
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${featureCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-5`}>
              {cfg.features.map(({ Icon, title, desc, badge }, i) => (
                <FadeUp key={title} delay={(i % featureCols) * 100}>
                  <TiltCard>
                    <div
                      className="flex items-center justify-center mb-4"
                      style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(124,58,237,0.12)" }}
                    >
                      <Icon size={24} color="#7c3aed" />
                    </div>
                    <h3 className="text-white font-semibold text-lg">{title}</h3>
                    <p className="mt-2 text-sm text-[#888] leading-relaxed">{desc}</p>
                    {badge && (
                      <span
                        className="mt-5 self-start inline-block"
                        style={{
                          background: "rgba(124,58,237,0.1)",
                          color: "#a78bfa",
                          border: "1px solid rgba(124,58,237,0.25)",
                          borderRadius: 9999,
                          fontSize: 11,
                          padding: "3px 10px",
                          marginTop: "auto",
                        }}
                      >
                        {badge}
                      </span>
                    )}
                  </TiltCard>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {cfg.unique}

        {/* CHIPS */}
        {cfg.chips && cfg.chips.length > 0 && (
          <section className="relative py-16 sm:py-20 border-b border-white/5" style={{ background: "#0a0a0a" }}>
            <div className="max-w-6xl mx-auto px-4 text-center">
              <FadeUp>
                <h2 className="text-2xl md:text-3xl font-bold text-white">{cfg.chipsTitle ?? "Trusted across teams"}</h2>
              </FadeUp>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {cfg.chips.map((c) => (
                  <span
                    key={c.label}
                    className="px-4 py-2 rounded-full text-sm text-white/80"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {c.label}
                    {c.sub && <span className="text-[#666] ml-2">{c.sub}</span>}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* STATS */}
        {cfg.stats && cfg.stats.length > 0 && (
          <section style={{ background: "#0a0a0a" }} className="py-14 sm:py-20 border-b border-white/5">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-y-8">
              {cfg.stats.map((s) => (
                <div key={s.label} className="text-center px-4">
                  <CountUp end={s.end} suffix={s.suffix} prefix={s.prefix} />
                  <div className="mt-2 text-[13px] text-[#888]">{s.label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TECH STACK */}
        {cfg.techStack && cfg.techStack.length > 0 && (
          <section className="py-14 sm:py-20" style={{ background: "#000" }}>
            <div className="max-w-5xl mx-auto px-4 text-center">
              <FadeUp>
                <h2 className="text-xl md:text-2xl font-semibold text-white/90">Built with a modern stack</h2>
              </FadeUp>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {cfg.techStack.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 text-xs rounded-full text-[#a78bfa]"
                    style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FINAL CTA */}
        <section className="relative overflow-hidden py-16 sm:py-20 md:py-[100px] text-center" style={{
          background: "linear-gradient(135deg, #0d0020, #1a0040, #0d0020)",
          borderTop: "1px solid rgba(124,58,237,0.2)",
        }}>
          <div className="spotlight" />
          <div className="relative max-w-3xl mx-auto px-4">
            <h2 className="font-bold text-white" style={{ fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.2 }}>
              Ready to see {cfg.name} in action?
            </h2>
            <p className="mt-4 text-[#aaa]">Talk to our team and get a tailored walkthrough.</p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <a href="/contact" className="btn-primary">Request Demo</a>
              {live && (
                <a href={live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium border border-white/15 text-white hover:bg-white/5 transition">
                  Open Live Platform
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
