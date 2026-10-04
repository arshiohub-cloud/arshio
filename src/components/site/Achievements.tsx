import { useEffect, useRef, useState } from "react";
import { useFadeIn } from "@/hooks/use-fade-in";

const stats = [
  { value: 40, suffix: "+", label: "AI Workflows Automated" },
  { value: 12, suffix: "+", label: "LLM, Vision, and RAG Systems Delivered" },
  { value: 5, suffix: "", label: "Live AI Platforms in Production" },
  { value: 2, suffix: "K+", label: "Documents and Media Assets Processed" },
  { value: 50, suffix: "+", label: "Business Processes Analyzed" },
  { value: 2, suffix: "", label: "Languages Supported for AI Workflows" },
];

function Counter({ target, suffix, start }: { target: number; suffix: string; start: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      setN(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);
  return (
    <span>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

export function Achievements() {
  const ref = useFadeIn<HTMLDivElement>();
  const sentinel = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setStarted(true),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{
        background: "rgba(124,58,237,0.06)",
        borderTop: "1px solid rgba(124,58,237,0.15)",
        borderBottom: "1px solid rgba(124,58,237,0.15)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.18), transparent 60%)",
        }}
      />
      <div ref={ref} className="fade-up relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight rainbow-text">
            Our Achievements
          </h2>
          <p className="mt-4 text-[#888] max-w-2xl mx-auto">
            Trusted by leading organizations worldwide.
          </p>
        </div>
        <div ref={sentinel} className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="text-center px-4"
              style={{
                borderRight:
                  (i + 1) % 3 !== 0 ? "1px solid rgba(255,255,255,0.06)" : undefined,
              }}
            >
              <div className="text-[40px] md:text-5xl font-bold text-white tracking-tight">
                <Counter target={s.value} suffix={s.suffix} start={started} />
              </div>
              <div className="text-[13px] text-[#888] mt-2 max-w-[160px] mx-auto">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
