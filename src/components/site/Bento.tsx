import { type ReactNode } from "react";

/**
 * BentoGrid — an asymmetric 6-tile layout that replaces uniform card grids.
 *
 * Desktop (lg): 6-col grid, first tile spans 4×2 (feature),
 *               tiles 2–3 fill the right rail (2 cols each),
 *               tiles 4–6 form a bottom row of three (2 cols each).
 * Tablet (md):  2-col grid, feature spans 2 cols.
 * Mobile:       single column.
 */
export const BENTO_SPANS = [
  "md:col-span-2 lg:col-span-4 lg:row-span-2", // 0 — feature
  "md:col-span-1 lg:col-span-2 lg:row-span-1", // 1
  "md:col-span-1 lg:col-span-2 lg:row-span-1", // 2
  "md:col-span-2 lg:col-span-2 lg:row-span-1", // 3
  "md:col-span-1 lg:col-span-2 lg:row-span-1", // 4
  "md:col-span-1 lg:col-span-2 lg:row-span-1", // 5
] as const;

export function BentoGrid({ children }: { children: ReactNode }) {
  return (
    <div
      className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[minmax(200px,auto)]"
    >
      {children}
    </div>
  );
}

export function BentoTile({
  index,
  accent = "#a78bfa",
  className = "",
  children,
  as: Tag = "div",
  href,
  ...rest
}: {
  index: number;
  accent?: string;
  className?: string;
  children: ReactNode;
  as?: "div" | "a";
  href?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const span = BENTO_SPANS[index % BENTO_SPANS.length];
  const isFeature = index % BENTO_SPANS.length === 0;

  const inner = (
    <div
      className="relative h-full w-full rounded-2xl overflow-hidden transition-transform duration-300 group-hover:-translate-y-1"
      style={{
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: isFeature
          ? `0 0 0 1px ${accent}22, 0 30px 80px -40px ${accent}55`
          : "0 20px 60px -40px rgba(0,0,0,0.6)",
      }}
    >
      {/* accent corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full opacity-40 group-hover:opacity-70 transition-opacity"
        style={{
          background: `radial-gradient(circle, ${accent}44, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
      {/* subtle grid backdrop for feature tile */}
      {isFeature && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      )}
      <div className="relative h-full w-full p-6 md:p-7 flex flex-col">
        {children}
      </div>
    </div>
  );

  if (Tag === "a" && href) {
    return (
      <a
        href={href}
        className={`group block ${span} ${className}`}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    );
  }
  return (
    <div className={`group ${span} ${className}`} {...rest}>
      {inner}
    </div>
  );
}
