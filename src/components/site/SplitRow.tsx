import type { ReactNode } from "react";
import { useFadeIn } from "@/hooks/use-fade-in";

/**
 * SplitRow — an editorial two-column row that replaces stacked cards.
 * Alternates left/right on desktop, stacks on mobile.
 * Uses hairline dividers instead of glass card borders.
 */
export function SplitRow({
  index,
  eyebrow,
  title,
  description,
  accent = "#a78bfa",
  right,
  footer,
  reverse: reverseProp,
  divider = true,
}: {
  index: number;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  accent?: string;
  right: ReactNode;
  footer?: ReactNode;
  reverse?: boolean;
  divider?: boolean;
}) {
  const ref = useFadeIn<HTMLDivElement>();
  const reverse = reverseProp ?? index % 2 === 1;
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={ref}
      className={`fade-up group relative grid gap-8 md:gap-14 py-14 md:py-20 grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] items-start ${
        divider ? "border-t border-white/8" : ""
      }`}
    >
      {/* left / text */}
      <div className={`min-w-0 ${reverse ? "lg:order-2" : ""}`}>
        <div className="flex items-baseline gap-4">
          <span
            className="tabular-nums text-xs tracking-[0.25em] uppercase"
            style={{ color: accent }}
          >
            {num}
          </span>
          {eyebrow && (
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
              {eyebrow}
            </span>
          )}
        </div>
        <h3
          className="mt-3 text-white font-semibold tracking-tight"
          style={{ fontSize: "clamp(24px, 3vw, 34px)", lineHeight: 1.15 }}
        >
          {title}
        </h3>
        {description && (
          <div className="mt-4 text-[15px] leading-relaxed text-[#9a9aa8] max-w-xl">
            {description}
          </div>
        )}
        {footer && <div className="mt-6">{footer}</div>}
      </div>

      {/* right / visual or supporting content */}
      <div className={`min-w-0 ${reverse ? "lg:order-1" : ""}`}>{right}</div>
    </div>
  );
}

export function EditorialSection({
  id,
  bg = "#000",
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id?: string;
  bg?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} style={{ background: bg }} className="py-20 md:py-28 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4">
        {(title || subtitle) && (
          <header className="max-w-3xl mb-6 md:mb-10">
            {eyebrow && (
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#a78bfa]">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2
                className="mt-2 font-semibold tracking-tight text-white"
                style={{ fontSize: "clamp(28px, 4vw, 46px)", lineHeight: 1.1 }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-[#8a8a94] text-base md:text-lg leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}
          </header>
        )}
        <div>{children}</div>
      </div>
    </section>
  );
}
