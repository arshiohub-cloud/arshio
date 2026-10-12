import { Reveal } from "./Reveal";

type SectionHeaderProps = {
  badge?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

/**
 * SectionHeader — Consistent section titles with optional badge and accent.
 * Supports left-aligned and centered layouts.
 */
export function SectionHeader({
  badge,
  title,
  titleAccent,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div className={`${isCenter ? "text-center" : "text-left"} mb-16 ${className}`}>
      {badge && (
        <Reveal delay={0}>
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#2DE0C6] mb-4 font-mono">
            {badge}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.1}>
        <h2
          className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] ${
            isCenter ? "mx-auto max-w-3xl" : ""
          }`}
        >
          {title}
          {titleAccent && (
            <>
              {" "}
              <span className="text-gradient-teal">{titleAccent}</span>
            </>
          )}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.2}>
          <p
            className={`mt-4 text-base sm:text-lg text-white/60 leading-relaxed ${
              isCenter ? "mx-auto max-w-xl" : "max-w-lg"
            }`}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
