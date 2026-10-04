import type { ReactNode } from "react";
import { Hero3D } from "@/components/3d/Hero3D";
import { FadeUp } from "@/components/site/product/anim";

type Variant = "network" | "torus" | "orbs" | "core" | "spiral" | "grid" | "particles";

export function PageHero({
  crumb,
  title,
  subtitle,
  variant = "network",
  interactive = false,
  cta,
}: {
  crumb: string;
  title: ReactNode;
  subtitle?: string;
  variant?: Variant;
  interactive?: boolean;
  cta?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-[140px]" style={{ background: "#000" }}>
      <div className="absolute inset-0 opacity-50">
        <Hero3D variant={variant} height={640} interactive={interactive} />
      </div>
      {/* Readability scrim behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0) 80%)",
        }}
      />
      <div className="spotlight" />
      <div className="relative max-w-5xl mx-auto px-4 text-center">
        <FadeUp>
          <nav className="text-[13px] text-[#aaa] mb-6">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2 text-[#555]">›</span>
            <span className="text-white">{crumb}</span>
          </nav>
        </FadeUp>
        <FadeUp delay={120}>
          <h1
            className="font-bold tracking-tight rainbow-text"
            style={{
              fontSize: "clamp(40px, 6vw, 68px)",
              lineHeight: 1.05,
              textShadow: "0 2px 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.7)",
            }}
          >
            {title}
          </h1>
        </FadeUp>
        {subtitle && (
          <FadeUp delay={220}>
            <p
              className="mt-6 text-white/90 mx-auto"
              style={{
                maxWidth: 660,
                fontSize: 17,
                lineHeight: 1.7,
                textShadow: "0 1px 20px rgba(0,0,0,0.95)",
              }}
            >
              {subtitle}
            </p>
          </FadeUp>
        )}
        {cta && (
          <FadeUp delay={320}>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">{cta}</div>
          </FadeUp>
        )}
      </div>

    </section>
  );
}
