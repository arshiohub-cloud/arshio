import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play, Radar, Sparkles } from "lucide-react";
import { projects } from "@/data/projects";

const ACCENTS = ["#a78bfa", "#67e8f9", "#f472b6", "#fbbf24", "#34d399", "#c084fc"];

/**
 * ProductShowcase — cinematic featured product with rotating thumbnail rail.
 * Auto-cycles through the portfolio; hover to pause; click to focus.
 */
export function ProductShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % projects.length), 5200);
    return () => clearInterval(t);
  }, [paused]);

  const p = projects[active];
  const accent = ACCENTS[active % ACCENTS.length];
  const host = p.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <section
      className="relative py-20 md:py-28 border-b border-white/5 overflow-hidden"
      style={{ background: "#050505" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ambient */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-80 transition-all duration-1000"
        style={{
          background: `radial-gradient(1000px 500px at 85% 15%, ${accent}22, transparent 65%), radial-gradient(700px 400px at 5% 90%, ${accent}18, transparent 70%)`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4">
        <header className="mb-10 md:mb-14 flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <span
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] font-semibold"
              style={{ color: accent }}
            >
              <Radar size={12} />
              Now scanning · {projects.length} live deployments
            </span>
            <h2
              className="mt-3 font-semibold tracking-tight text-white"
              style={{ fontSize: "clamp(30px, 4.5vw, 52px)", lineHeight: 1.05 }}
            >
              Cinematic view of
              <br />
              <span className="italic text-white/60">production AI in action.</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/50">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#34d399" }}
            />
            Auto-tour {paused ? "paused" : "running"}
          </div>
        </header>

        {/* Featured stage */}
        <FeaturedStage
          key={`stage-${active}`}
          project={p}
          accent={accent}
          index={active}
          loaded={!!loaded[active]}
          onLoad={() => setLoaded((l) => ({ ...l, [active]: true }))}
          host={host}
        />

        {/* Thumbnail rail */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {projects.map((pr, i) => {
            const a = ACCENTS[i % ACCENTS.length];
            const on = i === active;
            return (
              <button
                key={pr.name}
                onClick={() => setActive(i)}
                className="group relative text-left overflow-hidden rounded-lg transition-all duration-500"
                style={{
                  background: on
                    ? `linear-gradient(160deg, ${a}22, ${a}03)`
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${on ? a + "77" : "rgba(255,255,255,0.06)"}`,
                  boxShadow: on ? `0 15px 40px -20px ${a}` : undefined,
                  transform: on ? "translateY(-2px)" : undefined,
                }}
              >
                <div className="px-3 py-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="tabular-nums text-[10px] tracking-[0.22em] font-semibold"
                      style={{ color: on ? a : "rgba(255,255,255,0.35)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {on && (
                      <span
                        className="text-[9px] uppercase tracking-[0.22em] font-semibold px-1.5 py-0.5 rounded"
                        style={{ color: a, background: `${a}18`, border: `1px solid ${a}44` }}
                      >
                        Focus
                      </span>
                    )}
                  </div>
                  <div
                    className="text-[9.5px] uppercase tracking-[0.18em] mb-1 truncate"
                    style={{ color: on ? a : "rgba(255,255,255,0.4)" }}
                  >
                    {pr.category}
                  </div>
                  <div
                    className="font-medium truncate text-[13px]"
                    style={{ color: on ? "#fff" : "#c9c9d4" }}
                  >
                    {pr.name}
                  </div>
                </div>
                {on && !paused && (
                  <span
                    key={`prg-${i}`}
                    className="absolute left-0 bottom-0 h-[2px]"
                    style={{ background: a, animation: "prodbar 5.2s linear forwards" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-center text-[12px] text-white/40">
          <Sparkles size={11} className="inline -mt-0.5 mr-1" />
          Auto-tours the live portfolio. Hover to pause · click any thumbnail to focus.
        </p>
      </div>

      <style>{`@keyframes prodbar { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  );
}

function FeaturedStage({
  project,
  accent,
  index,
  loaded,
  onLoad,
  host,
}: {
  project: (typeof projects)[number];
  accent: string;
  index: number;
  loaded: boolean;
  onLoad: () => void;
  host: string;
}) {
  const [hover, setHover] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-8 lg:gap-12 items-center animate-fade-in">
      {/* Live preview */}
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-10 rounded-3xl blur-3xl opacity-40"
          style={{ background: `radial-gradient(circle, ${accent}66, transparent 65%)` }}
        />
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="relative block overflow-hidden rounded-xl border border-white/10 bg-black"
          style={{ boxShadow: `0 50px 120px -50px ${accent}` }}
        >
          {/* Chrome */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))" }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <div
              className="ml-3 flex-1 truncate text-[11px] px-3 py-1 rounded-md text-white/50"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {host}
            </div>
            <span
              className="text-[10px] uppercase tracking-[0.2em] font-semibold px-2 py-0.5 rounded flex items-center gap-1"
              style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}44` }}
            >
              <span
                className="w-1 h-1 rounded-full animate-pulse"
                style={{ background: accent }}
              />
              Live
            </span>
          </div>

          {/* Live iframe */}
          <div className="relative w-full aspect-[16/10]">
            <div
              className="absolute top-0 left-0"
              style={{
                width: "1280px",
                height: "800px",
                transform: "scale(0.44)",
                transformOrigin: "top left",
                pointerEvents: "none",
              }}
            >
              <iframe
                ref={iframeRef}
                src={project.url}
                title={`${project.name} preview`}
                className="w-full h-full border-0"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                onLoad={onLoad}
              />
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
              style={{
                opacity: hover && loaded ? 0 : 1,
                background: `radial-gradient(circle at center, ${accent}22 0%, #0a0018 60%, #000 100%)`,
              }}
            >
              <div className="flex flex-col items-center gap-3 text-white/85">
                <div
                  className="w-14 h-14 rounded-full backdrop-blur flex items-center justify-center"
                  style={{
                    background: `${accent}22`,
                    border: `1px solid ${accent}66`,
                    boxShadow: `0 0 30px -5px ${accent}`,
                  }}
                >
                  <Play className="w-5 h-5 fill-white text-white" />
                </div>
                <span className="text-[11px] uppercase tracking-[0.25em] font-medium">
                  {loaded ? "Hover to preview" : "Loading live app…"}
                </span>
              </div>
            </div>
            {/* scanline */}
            {loaded && (
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 h-8 opacity-40"
                style={{
                  background: `linear-gradient(180deg, ${accent}00, ${accent}77, ${accent}00)`,
                  animation: "scanline 3.5s linear infinite",
                }}
              />
            )}
          </div>
        </a>

        <style>{`@keyframes scanline { 0% { top: -10% } 100% { top: 110% } }`}</style>
      </div>

      {/* Detail */}
      <div>
        <div className="flex items-center gap-4">
          <span
            className="tabular-nums font-black leading-none"
            style={{ fontSize: 76, color: accent, opacity: 0.95, letterSpacing: "-0.04em" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-col gap-1.5">
            <span
              className="text-[10.5px] uppercase tracking-[0.28em] font-semibold"
              style={{ color: accent }}
            >
              {project.category}
            </span>
            <span className="h-px w-16" style={{ background: `${accent}66` }} />
          </div>
        </div>
        <h3
          className="mt-5 text-white font-semibold tracking-tight"
          style={{ fontSize: "clamp(28px, 3.4vw, 40px)", lineHeight: 1.08 }}
        >
          {project.name}
        </h3>
        <p className="mt-4 text-[15.5px] leading-relaxed text-[#a5a5b3] max-w-xl">
          {project.desc}
        </p>

        {/* pseudo telemetry */}
        <div
          className="mt-6 grid grid-cols-3 rounded-xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {[
            { l: "Status", v: "Deployed" },
            { l: "Uptime", v: "99.9%" },
            { l: "Domain", v: host.split("/")[0].split(".")[0] },
          ].map((k, i) => (
            <div
              key={k.l}
              className="px-3 py-3"
              style={{
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.05)" : undefined,
              }}
            >
              <div className="text-[9.5px] uppercase tracking-[0.22em] text-white/45">
                {k.l}
              </div>
              <div
                className="mt-1 text-[13px] font-medium truncate"
                style={{ color: accent }}
              >
                {k.v}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
              color: "#0a0018",
              boxShadow: `0 10px 30px -8px ${accent}`,
            }}
          >
            Visit platform <ArrowUpRight size={15} />
          </a>
          <span className="text-[12px] text-white/40 truncate">{host}</span>
        </div>
      </div>
    </div>
  );
}
