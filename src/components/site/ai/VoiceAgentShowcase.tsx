import { useEffect, useRef, useState } from "react";
import { Mic, Phone, Volume2 } from "lucide-react";

const turns = [
  { who: "user", text: "Hi, I want to book a demo for next Tuesday." },
  { who: "agent", text: "Of course! I have 10 AM, 2 PM, and 4:30 PM open on Tuesday. Which works best?" },
  { who: "user", text: "Let's do 2 PM. Can you also send a calendar invite?" },
  { who: "agent", text: "Booked 2 PM Tuesday with our solutions lead. Invite is on its way to your email — anything else I can help with?" },
  { who: "user", text: "That's perfect, thanks!" },
  { who: "agent", text: "You're welcome. Talk soon!" },
] as const;

export function VoiceAgentShowcase() {
  const [active, setActive] = useState(false);
  const [turn, setTurn] = useState(0);
  const [visible, setVisible] = useState<typeof turns[number][]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // cycle conversation
  useEffect(() => {
    if (!active) return;
    setVisible([turns[0]]);
    setTurn(0);
    const id = setInterval(() => {
      setTurn((t) => {
        const next = t + 1;
        if (next >= turns.length) {
          setActive(false);
          return t;
        }
        setVisible((v) => [...v, turns[next]]);
        return next;
      });
    }, 2400);
    return () => clearInterval(id);
  }, [active]);

  // waveform
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      cv.width = cv.clientWidth * dpr;
      cv.height = cv.clientHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let t = 0;
    const draw = () => {
      t += 0.05;
      const w = cv.width, h = cv.height;
      ctx.clearRect(0, 0, w, h);
      const bars = 64;
      const bw = w / bars;
      const speakerIsAgent = visible.length > 0 && visible[visible.length - 1].who === "agent";
      const energy = active ? 1 : 0.25;

      for (let i = 0; i < bars; i++) {
        const phase = (i / bars) * Math.PI * 4;
        const amp = (Math.sin(t + phase) * 0.5 + 0.5) *
                    (Math.sin(t * 0.6 + i * 0.3) * 0.5 + 0.5);
        const bh = (amp * h * 0.85 + h * 0.05) * energy;
        const x = i * bw + bw * 0.2;
        const y = (h - bh) / 2;
        const grad = ctx.createLinearGradient(0, y, 0, y + bh);
        if (speakerIsAgent) {
          grad.addColorStop(0, "#a78bfa");
          grad.addColorStop(1, "#22d3ee");
        } else {
          grad.addColorStop(0, "#a3e635");
          grad.addColorStop(1, "#67e8f9");
        }
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, bw * 0.6, bh);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [active, visible]);

  return (
    <div className="relative glass-card overflow-hidden p-0">
      {/* ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(700px circle at 30% 30%, rgba(167,139,250,0.25), transparent 60%), radial-gradient(600px circle at 80% 70%, rgba(34,211,238,0.22), transparent 60%)",
        }}
      />

      <div className="relative grid lg:grid-cols-[1.05fr_1fr] gap-0">
        {/* LEFT — Orb */}
        <div className="relative flex flex-col items-center justify-center p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10 min-h-[520px]">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 ${active ? "animate-ping" : ""}`} />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/70">
              {active ? "Live voice agent" : "Voice agent · idle"}
            </span>
          </div>

          <Orb active={active} />

          <div className="mt-6 text-center">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/50">Now talking</div>
            <div className="mt-1 text-white font-semibold text-xl">Aria · Voice Concierge</div>
            <div className="mt-1 text-sm text-white/60 max-w-sm">Real-time speech, sub-400ms latency, 32 languages.</div>
          </div>

          {/* Waveform */}
          <div className="mt-6 w-full max-w-md h-16">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => setActive((a) => !a)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition"
              style={{
                background: active
                  ? "linear-gradient(135deg, #f43f5e, #f59e0b)"
                  : "linear-gradient(135deg, #a78bfa, #22d3ee)",
                color: "#0a0a0a",
                boxShadow: active ? "0 0 32px rgba(244,63,94,0.45)" : "0 0 32px rgba(167,139,250,0.45)",
              }}
            >
              {active ? <><Phone className="w-4 h-4" /> End call</> : <><Mic className="w-4 h-4" /> Start voice call</>}
            </button>
            <button
              aria-label="Volume"
              className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.04] text-white/70 hover:text-white hover:border-white/35 flex items-center justify-center transition"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT — transcript */}
        <div className="p-6 lg:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500/80" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-[11px] uppercase tracking-wide text-white/40">live.transcript</span>
            </div>
            <span className="text-[10px] text-white/40 tabular-nums">{visible.length}/{turns.length}</span>
          </div>

          <div className="flex-1 space-y-3 min-h-[360px]">
            {visible.length === 0 && (
              <div className="h-full flex items-center justify-center text-center text-white/45 text-sm italic">
                Press <span className="mx-1 text-white/70">"Start voice call"</span> to hear Aria handle a real conversation.
              </div>
            )}
            {visible.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.who === "user" ? "justify-end" : "justify-start"}`}
                style={{ animation: "voiceIn 0.45s ease-out both" }}
              >
                <div
                  className="max-w-[85%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-snug"
                  style={
                    m.who === "user"
                      ? { background: "rgba(163,230,53,0.12)", border: "1px solid rgba(163,230,53,0.35)", color: "#e8ffd0" }
                      : { background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.35)", color: "#efeaff" }
                  }
                >
                  <div className="text-[10px] uppercase tracking-wider mb-0.5 opacity-70">
                    {m.who === "user" ? "Caller" : "Aria"}
                  </div>
                  {m.text}
                </div>
              </div>
            ))}
            {active && turn < turns.length - 1 && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-3 py-2 inline-flex gap-1" style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Spec strip */}
          <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
            {[
              { k: "Latency", v: "380ms" },
              { k: "Voices", v: "1.2k+" },
              { k: "Languages", v: "32" },
            ].map((s) => (
              <div key={s.k}>
                <div className="text-[10px] uppercase tracking-wider text-white/45">{s.k}</div>
                <div className="text-sm font-semibold text-white mt-0.5">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes voiceIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

function Orb({ active }: { active: boolean }) {
  return (
    <div className="relative w-64 h-64">
      {/* outer rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border"
          style={{
            borderColor: "rgba(167,139,250,0.25)",
            animation: active ? `orbPing 2.4s cubic-bezier(0,0,0.2,1) ${i * 0.8}s infinite` : "none",
            opacity: active ? 1 : 0.3,
          }}
        />
      ))}
      {/* core */}
      <div
        className="absolute inset-6 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #ffffff 0%, #a78bfa 25%, #6366f1 55%, #0b0b25 100%)",
          boxShadow: active
            ? "0 0 80px rgba(167,139,250,0.7), inset 0 0 50px rgba(34,211,238,0.4)"
            : "0 0 30px rgba(167,139,250,0.3)",
          animation: active ? "orbBreath 2.2s ease-in-out infinite" : "orbFloat 5s ease-in-out infinite",
        }}
      />
      {/* highlight */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: "22%",
          left: "26%",
          width: "32%",
          height: "20%",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.85), transparent 70%)",
          filter: "blur(2px)",
          opacity: 0.8,
        }}
      />
      <style>{`
        @keyframes orbPing {
          0% { transform: scale(0.85); opacity: 0.6; }
          80%, 100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes orbBreath {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes orbFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
