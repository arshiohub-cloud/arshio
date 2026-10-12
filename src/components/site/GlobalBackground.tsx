import { useEffect, useRef, useState, useCallback } from "react";

/**
 * GlobalBackground — One continuous ambient background for the entire site.
 * Mounted once in the root layout. All sections are transparent over this.
 *
 * Layers (bottom to top):
 *  a) Deep navy-black base gradient
 *  b) Animated aurora blobs (teal, cyan, indigo, magenta)
 *  c) Subtle dot grid with radial mask
 *  d) Film grain noise overlay
 *  e) Cursor-following soft spotlight (desktop only)
 */
export function GlobalBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef(0);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    return () => {
      mql.removeEventListener("change", handler);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Cursor spotlight (desktop only)
  useEffect(() => {
    if (isMobile || reducedMotion) return;

    const el = spotlightRef.current;
    if (!el) return;

    let tx = 0, ty = 0, cx = 0, cy = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `translate3d(${cx - 300}px, ${cy - 300}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [isMobile, reducedMotion]);

  // Parallax scroll offset for blobs
  useEffect(() => {
    if (reducedMotion) return;
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  const blobAnimation = reducedMotion ? "none" : undefined;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    >
      {/* Layer a: Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #050A18 0%, #070D1F 40%, #0A1228 70%, #050A18 100%)",
        }}
      />

      {/* Layer b: Aurora blobs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Teal blob */}
        <div
          className="absolute rounded-full"
          style={{
            width: isMobile ? "400px" : "700px",
            height: isMobile ? "400px" : "700px",
            top: "10%",
            left: "15%",
            background:
              "radial-gradient(circle, rgba(45, 224, 198, 0.20) 0%, transparent 70%)",
            filter: isMobile ? "blur(80px)" : "blur(140px)",
            animation: blobAnimation ?? "auroraBlob1 30s ease-in-out infinite",
            willChange: "transform, opacity",
          }}
        />
        {/* Cyan blob */}
        <div
          className="absolute rounded-full"
          style={{
            width: isMobile ? "350px" : "600px",
            height: isMobile ? "350px" : "600px",
            top: "50%",
            right: "10%",
            background:
              "radial-gradient(circle, rgba(34, 184, 240, 0.18) 0%, transparent 70%)",
            filter: isMobile ? "blur(80px)" : "blur(130px)",
            animation: blobAnimation ?? "auroraBlob2 35s ease-in-out infinite",
            willChange: "transform, opacity",
          }}
        />
        {/* Indigo blob */}
        <div
          className="absolute rounded-full"
          style={{
            width: isMobile ? "300px" : "550px",
            height: isMobile ? "300px" : "550px",
            bottom: "20%",
            left: "40%",
            background:
              "radial-gradient(circle, rgba(91, 91, 240, 0.16) 0%, transparent 70%)",
            filter: isMobile ? "blur(80px)" : "blur(120px)",
            animation: blobAnimation ?? "auroraBlob3 28s ease-in-out infinite",
            willChange: "transform, opacity",
          }}
        />
        {/* Magenta accent blob (desktop only) */}
        {!isMobile && (
          <div
            className="absolute rounded-full"
            style={{
              width: "450px",
              height: "450px",
              top: "70%",
              right: "30%",
              background:
                "radial-gradient(circle, rgba(236, 72, 153, 0.10) 0%, transparent 70%)",
              filter: "blur(140px)",
              animation:
                blobAnimation ?? "auroraBlob4 38s ease-in-out infinite",
              willChange: "transform, opacity",
            }}
          />
        )}
      </div>

      {/* Layer c: Dot grid pattern with radial mask */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 70%)",
        }}
      />

      {/* Layer d: Film grain noise */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Layer e: Cursor-following spotlight (desktop only) */}
      {!isMobile && !reducedMotion && (
        <div
          ref={spotlightRef}
          className="fixed left-0 top-0 h-[600px] w-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(closest-side, rgba(45, 224, 198, 0.06), rgba(34, 184, 240, 0.03) 40%, transparent 70%)",
            filter: "blur(20px)",
            willChange: "transform",
          }}
        />
      )}
    </div>
  );
}
