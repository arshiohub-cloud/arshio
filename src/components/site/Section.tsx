import type { ReactNode } from "react";
import { useFadeIn } from "@/hooks/use-fade-in";

export function Section({
  id,
  bg = "#000000",
  title,
  subtitle,
  children,
}: {
  id?: string;
  bg?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const ref = useFadeIn<HTMLDivElement>();
  return (
    <section id={id} style={{ background: bg }} className="ai-grid-bg py-24 border-b border-white/5">
      <div ref={ref} className="fade-up relative max-w-7xl mx-auto px-4">
        {title && (
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight rainbow-text">{title}</h2>
            {subtitle && <p className="mt-4 text-[#888] max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
