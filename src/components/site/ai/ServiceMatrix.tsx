import { useEffect, useState } from "react";
import { ArrowRight, Check, Cpu, Zap, Shield } from "lucide-react";
import { SERVICES } from "@/data/services";

/**
 * ServiceMatrix — interactive AI service explorer.
 * Left rail: numbered service list (auto-cycles + click). Right: animated detail panel.
 */
export function ServiceMatrix() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % SERVICES.length), 4200);
    return () => clearInterval(t);
  }, [paused]);

  const s = SERVICES[active];
  const accent = s.accent;

  return (
    <section
      className="relative py-20 md:py-28 border-b border-white/5 overflow-hidden"
      style={{ background: "#000" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-70 transition-all duration-1000"
        style={{
          background: `radial-gradient(900px 500px at 80% 30%, ${accent}22, transparent 70%), radial-gradient(600px 400px at 10% 90%, ${accent}18, transparent 70%)`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4">
        <header className="mb-12 md:mb-16 max-w-3xl">
          <span
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] font-semibold"
            style={{ color: accent }}
          >
            <span className="inline-block w-6 h-px" style={{ background: accent }} />
            AI Capability Matrix
          </span>
          <h2
            className="mt-3 font-semibold tracking-tight text-white"
            style={{ fontSize: "clamp(28px, 4vw, 46px)", lineHeight: 1.05 }}
          >
            Six capabilities.
            <br />
            <span className="italic text-white/60">One intelligent stack.</span>
          </h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-6 lg:gap-10">
          {/* Left rail */}
          <div className="flex flex-col gap-2">
            {SERVICES.map((svc, i) => {
              const on = i === active;
              return (
                <button
                  key={svc.slug}
                  onClick={() => setActive(i)}
                  className="group relative text-left overflow-hidden rounded-xl transition-all duration-500"
                  style={{
                    background: on
                      ? `linear-gradient(90deg, ${svc.accent}18, transparent)`
                      : "rgba(255,255,255,0.02)",
                    border: `1px solid ${on ? svc.accent + "55" : "rgba(255,255,255,0.06)"}`,
                    boxShadow: on ? `0 0 40px -15px ${svc.accent}` : undefined,
                  }}
                >
                  {/* progress bar */}
                  {on && !paused && (
                    <span
                      key={`bar-${i}`}
                      className="absolute left-0 bottom-0 h-[2px]"
                      style={{
                        background: svc.accent,
                        animation: "svcbar 4.2s linear forwards",
                      }}
                    />
                  )}
                  <div className="flex items-center gap-4 p-4 md:p-5">
                    <span
                      className="tabular-nums text-[11px] tracking-[0.25em] font-semibold w-8"
                      style={{ color: on ? svc.accent : "rgba(255,255,255,0.35)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="flex items-center justify-center rounded-lg flex-shrink-0 transition-all"
                      style={{
                        width: 40,
                        height: 40,
                        background: on
                          ? `linear-gradient(135deg, ${svc.accent}33, ${svc.accent}08)`
                          : "rgba(255,255,255,0.04)",
                        border: `1px solid ${on ? svc.accent + "55" : "rgba(255,255,255,0.08)"}`,
                      }}
                    >
                      <svc.Icon size={18} color={on ? svc.accent : "#9a9aa8"} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        className="font-medium truncate transition-colors"
                        style={{ color: on ? "#fff" : "#c9c9d4", fontSize: 15 }}
                      >
                        {svc.title}
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/40 mt-0.5">
                        {svc.tags[0]}
                      </div>
                    </div>
                    <ArrowRight
                      size={14}
                      className="transition-all"
                      style={{
                        color: on ? svc.accent : "rgba(255,255,255,0.2)",
                        transform: on ? "translateX(2px)" : "translateX(-4px)",
                        opacity: on ? 1 : 0.5,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right detail panel */}
          <div
            key={s.slug}
            className="relative rounded-2xl overflow-hidden animate-fade-in"
            style={{
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
              border: `1px solid ${accent}44`,
              boxShadow: `0 40px 80px -50px ${accent}88`,
            }}
          >
            {/* HUD header */}
            <div
              className="flex items-center justify-between px-5 py-2.5 border-b border-white/5"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/50">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: accent }}
                />
                Service · {String(active + 1).padStart(2, "0")} of 06
              </div>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
                <span className="flex items-center gap-1.5"><Cpu size={11} /> AI</span>
                <span className="flex items-center gap-1.5"><Zap size={11} /> Live</span>
                <span className="flex items-center gap-1.5"><Shield size={11} /> Private</span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-start gap-5">
                <div
                  className="flex items-center justify-center rounded-2xl flex-shrink-0"
                  style={{
                    width: 64,
                    height: 64,
                    background: `linear-gradient(135deg, ${accent}33, ${accent}08)`,
                    border: `1px solid ${accent}66`,
                    boxShadow: `0 0 40px -10px ${accent}, inset 0 1px 0 ${accent}44`,
                  }}
                >
                  <s.Icon size={30} color={accent} />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className="text-[10.5px] uppercase tracking-[0.28em] font-semibold"
                    style={{ color: accent }}
                  >
                    {s.tags.join(" · ")}
                  </div>
                  <h3
                    className="mt-1.5 text-white font-semibold tracking-tight"
                    style={{ fontSize: "clamp(24px, 2.8vw, 32px)", lineHeight: 1.1 }}
                  >
                    {s.title}
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-[15px] leading-relaxed text-[#a5a5b3]">
                {s.desc}
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {s.bullets.map((b) => (
                  <div
                    key={b}
                    className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg text-[13.5px] text-[#c9c9d4]"
                    style={{
                      background: `${accent}0a`,
                      border: `1px solid ${accent}22`,
                    }}
                  >
                    <span
                      className="mt-[3px] flex items-center justify-center rounded-full flex-shrink-0"
                      style={{
                        width: 16,
                        height: 16,
                        background: `${accent}22`,
                        border: `1px solid ${accent}55`,
                      }}
                    >
                      <Check size={9} color={accent} strokeWidth={3.5} />
                    </span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div
                className="mt-6 pt-5 flex items-center justify-between gap-3"
                style={{ borderTop: "1px dashed rgba(255,255,255,0.08)" }}
              >
                <a
                  href={`#cap-${s.slug}`}
                  className="text-[13px] text-white/60 hover:text-white transition inline-flex items-center gap-1.5"
                >
                  Deep-dive <ArrowRight size={13} />
                </a>
                <a
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] font-medium transition hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
                    color: "#0a0018",
                    boxShadow: `0 10px 30px -10px ${accent}`,
                  }}
                >
                  Talk to us <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes svcbar { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  );
}
