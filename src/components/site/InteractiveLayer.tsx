import { useEffect, useRef } from "react";

/**
 * Site-wide subtle interactivity:
 *  - Cursor-tracked spotlight on every .glass-card (via --mx / --my CSS vars)
 *  - Soft ambient glow that follows the pointer across the page
 */
export function InteractiveLayer() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    let raf = 0;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;

      // per-card spotlight
      const target = (e.target as HTMLElement | null)?.closest?.(".glass-card") as
        | HTMLElement
        | null;
      if (target) {
        const r = target.getBoundingClientRect();
        target.style.setProperty("--mx", `${e.clientX - r.left}px`);
        target.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    };

    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      if (glow) glow.style.transform = `translate3d(${cx - 300}px, ${cy - 300}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[600px] w-[600px] rounded-full opacity-60 mix-blend-screen"
      style={{
        background:
          "radial-gradient(closest-side, rgba(168,201,255,0.10), rgba(180,140,255,0.05) 40%, transparent 70%)",
        filter: "blur(20px)",
      }}
    />
  );
}
