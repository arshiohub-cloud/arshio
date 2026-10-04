import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(once = true) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return { ref, inView };
}

export function CountUp({
  end,
  suffix = "",
  prefix = "",
  duration = 1800,
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    // Respect users that prefer reduced motion: jump straight to final value.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVal(end);
      return;
    }

    const start = performance.now();
    let raf = 0;
    // easeOutExpo — fast start, gentle settle, no overshoot (no layout jitter).
    const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setVal(ease(p) * end);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);

  // Reserve space using the FINAL formatted string so the box never reflows
  // while digits tick up. tabular-nums keeps each digit the same advance width.
  const formatted =
    decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString();
  const finalFormatted =
    decimals > 0 ? end.toFixed(decimals) : Math.floor(end).toLocaleString();

  return (
    <div
      ref={ref}
      className="text-[42px] font-bold text-white leading-none tabular-nums"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      <span className="relative inline-block">
        {/* Invisible reservation sets the final width so nothing shifts. */}
        <span aria-hidden className="invisible whitespace-nowrap">
          {prefix}
          {finalFormatted}
          {suffix}
        </span>
        <span className="absolute inset-0 whitespace-nowrap">
          {prefix}
          {formatted}
          {suffix}
        </span>
      </span>
    </div>
  );
}

export function FadeUp({
  delay = 0,
  children,
  className = "",
}: {
  delay?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 700ms ease ${delay}ms, transform 700ms ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className="glass-card h-full flex flex-col"
      style={{ padding: 28 }}
    >
      {children}
    </div>
  );
}
