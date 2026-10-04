// CSS-only animated backdrop used when WebGL is unavailable.
// Keeps the hero visually rich without Three.js / canvas.
export function HeroFallback() {
  const dots = Array.from({ length: 36 });
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes hf-drift {
          0%   { transform: translate3d(0,0,0) scale(1);   opacity: 0; }
          15%  { opacity: 0.9; }
          85%  { opacity: 0.9; }
          100% { transform: translate3d(var(--dx,0), -120vh, 0) scale(1.4); opacity: 0; }
        }
        @keyframes hf-pulse-bg {
          0%, 100% { transform: scale(1);   opacity: 0.55; }
          50%      { transform: scale(1.1); opacity: 0.8;  }
        }
        @keyframes hf-spin { to { transform: rotate(360deg); } }
        .hf-dot {
          position: absolute; bottom: -10vh;
          width: 6px; height: 6px; border-radius: 9999px;
          background: radial-gradient(circle, #b4c8ff 0%, rgba(108,99,255,0.6) 50%, transparent 80%);
          box-shadow: 0 0 14px rgba(108,99,255,0.7);
          animation: hf-drift linear infinite;
          filter: blur(0.4px);
        }
        .hf-ring {
          position: absolute; left: 50%; top: 50%;
          width: 60vmin; height: 60vmin; margin: -30vmin 0 0 -30vmin;
          border-radius: 9999px;
          border: 1px dashed rgba(0,212,255,0.25);
          animation: hf-spin 60s linear infinite;
        }
        .hf-ring-2 {
          width: 40vmin; height: 40vmin; margin: -20vmin 0 0 -20vmin;
          border-color: rgba(108,99,255,0.3);
          animation-duration: 38s; animation-direction: reverse;
        }
      `}</style>

      {/* Soft glowing core */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "70vmin",
          height: "70vmin",
          background:
            "radial-gradient(closest-side, rgba(108,99,255,0.45), rgba(0,212,255,0.18) 45%, transparent 75%)",
          filter: "blur(20px)",
          animation: "hf-pulse-bg 6s ease-in-out infinite",
        }}
      />

      {/* Concentric rings */}
      <div className="hf-ring" />
      <div className="hf-ring hf-ring-2" />

      {/* Drifting "synapse" particles */}
      {dots.map((_, i) => {
        const left = (i * 97) % 100;
        const dx = ((i * 31) % 60) - 30;
        const dur = 8 + ((i * 7) % 9);
        const delay = (i * 0.4) % 8;
        const size = 4 + (i % 4);
        return (
          <span
            key={i}
            className="hf-dot"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              ["--dx" as never]: `${dx}vw`,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}

// Cheap, side-effect-free WebGL availability probe.
// Returns false in SSR, on prefers-reduced-motion, or when WebGL context fails.
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
    const c = document.createElement("canvas");
    const gl =
      c.getContext("webgl2") ||
      c.getContext("webgl") ||
      c.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}
