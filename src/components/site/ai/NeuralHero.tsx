import { useEffect, useRef, useState } from "react";

/**
 * NeuralHero — animated neural mesh canvas + gradient ambient + live metric ticker.
 * Used as the reusable AI hero backdrop for /services and /products.
 */
export function NeuralHero({
  eyebrow,
  title,
  accent = "#a78bfa",
  subtitle,
  metrics,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  accent?: string;
  subtitle?: string;
  metrics?: { label: string; value: string; hint?: string }[];
  children?: React.ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: Node[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.max(40, Math.floor((w * h) / 22000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.4,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    let mouse = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => (mouse = { x: -9999, y: -9999 });
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    const hex = accent.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;

        // mouse attraction
        const mdx = mouse.x - a.x;
        const mdy = mouse.y - a.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 160) {
          a.vx += (mdx / md) * 0.008;
          a.vy += (mdy / md) * 0.008;
        }
        a.vx = Math.max(-0.6, Math.min(0.6, a.vx));
        a.vy = Math.max(-0.6, Math.min(0.6, a.vy));

        for (let j = i + 1; j < nodes.length; j++) {
          const bnode = nodes[j];
          const dx = a.x - bnode.x;
          const dy = a.y - bnode.y;
          const d = Math.hypot(dx, dy);
          if (d < 140) {
            const alpha = (1 - d / 140) * 0.35;
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(bnode.x, bnode.y);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${r},${g},${b},0.9)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [accent]);

  return (
    <section
      className="relative overflow-hidden border-b border-white/5"
      style={{
        background:
          "radial-gradient(ellipse at 20% 0%, #14003a 0%, #050014 40%, #000 90%)",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />
      {/* radial vignettes */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(600px 380px at 85% 20%, ${accent}22, transparent 70%), radial-gradient(400px 300px at 15% 90%, #67e8f922, transparent 70%)`,
        }}
      />
      {/* grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="flex items-center gap-3 mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping"
              style={{ background: accent }}
            />
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ background: accent }}
            />
          </span>
          <span
            className="text-[11px] uppercase tracking-[0.32em] font-semibold"
            style={{ color: accent }}
          >
            {eyebrow}
          </span>
          <span className="h-px flex-1 max-w-[120px] bg-white/10" />
        </div>

        <h1
          className="font-semibold tracking-tight text-white"
          style={{ fontSize: "clamp(40px, 6.5vw, 82px)", lineHeight: 1.02 }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl text-[#a5a5b3] text-base md:text-lg leading-relaxed">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}

        {metrics && metrics.length > 0 && (
          <MetricTicker metrics={metrics} accent={accent} />
        )}
      </div>
    </section>
  );
}

function MetricTicker({
  metrics,
  accent,
}: {
  metrics: { label: string; value: string; hint?: string }[];
  accent: string;
}) {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setPulse((p) => (p + 1) % metrics.length), 2200);
    return () => clearInterval(i);
  }, [metrics.length]);

  return (
    <div
      className="mt-14 rounded-2xl backdrop-blur-md overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.4))",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2 text-[10px] uppercase tracking-[0.25em]"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span className="flex items-center gap-2 text-white/60">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#34d399" }}
          />
          Live signal · production telemetry
        </span>
        <span style={{ color: accent }}>{new Date().toISOString().slice(0, 10)}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className="relative px-5 py-5 md:py-6 border-white/5"
            style={{
              borderRight: i < metrics.length - 1 ? "1px solid rgba(255,255,255,0.05)" : undefined,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {pulse === i && (
              <span
                className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full animate-ping"
                style={{ background: accent }}
              />
            )}
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/45">
              {m.label}
            </div>
            <div
              className="mt-2 font-semibold tabular-nums tracking-tight"
              style={{ fontSize: "clamp(22px, 2.4vw, 30px)", color: pulse === i ? accent : "#fff" }}
            >
              {m.value}
            </div>
            {m.hint && (
              <div className="mt-1 text-[11px] text-white/40">{m.hint}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
