import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

type Voice = {
  name: string;
  tag: string;
  accent: string;
  sample: string;
  colors: [string, string];
};

const voices: Voice[] = [
  { name: "Aria",    tag: "Warm · Concierge",   accent: "American",     sample: "Welcome back. How can I help you today?",        colors: ["#a78bfa", "#22d3ee"] },
  { name: "Atlas",   tag: "Calm · Support",     accent: "British",      sample: "Of course — let me pull up your account now.",   colors: ["#67e8f9", "#10b981"] },
  { name: "Nova",    tag: "Crisp · Sales",      accent: "American",     sample: "I'd love to book a quick demo for your team.",   colors: ["#f472b6", "#a78bfa"] },
  { name: "Sable",   tag: "Smooth · Narration", accent: "Irish",        sample: "Once upon a time, in a quiet city by the sea…",  colors: ["#facc15", "#f472b6"] },
  { name: "Kenji",   tag: "Polite · Reception", accent: "Japanese-EN",  sample: "Thank you for calling. Please hold one moment.", colors: ["#fb7185", "#facc15"] },
  { name: "Lumen",   tag: "Bright · Coach",     accent: "Australian",   sample: "You've got this. Take a breath and let's begin.", colors: ["#a3e635", "#22d3ee"] },
];

export function VoiceLibrary() {
  const [playing, setPlaying] = useState<number | null>(null);

  useEffect(() => {
    if (playing === null) return;
    const id = setTimeout(() => setPlaying(null), 3200);
    return () => clearTimeout(id);
  }, [playing]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {voices.map((v, i) => (
          <VoiceCard
            key={v.name}
            voice={v}
            playing={playing === i}
            onToggle={() => setPlaying(playing === i ? null : i)}
          />
        ))}
      </div>

      {/* Languages strip */}
      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/50 mb-3 text-center">
          Speaks 32 languages · same voice, same identity
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {["English","Spanish","French","German","Italian","Portuguese","Hindi","Japanese","Korean","Mandarin","Arabic","Turkish","Dutch","Polish","Swedish","Tagalog","Bengali","Tamil","Vietnamese","Indonesian","Greek","Czech","Romanian","Hebrew","Ukrainian","Thai","+ 6 more"].map((l) => (
            <span key={l} className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-white/70">
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function VoiceCard({ voice, playing, onToggle }: { voice: Voice; playing: boolean; onToggle: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    cv.width = cv.clientWidth * dpr;
    cv.height = cv.clientHeight * dpr;

    let raf = 0;
    let t = 0;
    const draw = () => {
      t += playing ? 0.18 : 0.04;
      const w = cv.width, h = cv.height;
      ctx.clearRect(0, 0, w, h);
      const bars = 42;
      const bw = w / bars;
      for (let i = 0; i < bars; i++) {
        const phase = (i / bars) * Math.PI * 3;
        const base = Math.sin(t + phase) * 0.5 + 0.5;
        const sub = Math.sin(t * 0.7 + i * 0.4) * 0.5 + 0.5;
        const energy = playing ? 1 : 0.35;
        const bh = (base * sub * h * 0.85 + h * 0.06) * energy;
        const x = i * bw + bw * 0.2;
        const y = (h - bh) / 2;
        const grad = ctx.createLinearGradient(0, y, 0, y + bh);
        grad.addColorStop(0, voice.colors[0]);
        grad.addColorStop(1, voice.colors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, bw * 0.55, bh);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [playing, voice.colors]);

  return (
    <div
      className="glass-card p-5 relative overflow-hidden transition-all"
      style={{
        borderColor: playing ? voice.colors[0] : undefined,
        boxShadow: playing ? `0 0 40px ${voice.colors[0]}40` : undefined,
      }}
    >
      <div className="absolute inset-0 opacity-0 pointer-events-none transition-opacity"
        style={{ background: `radial-gradient(400px circle at 30% 0%, ${voice.colors[0]}25, transparent 60%)`, opacity: playing ? 1 : 0 }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-black"
            style={{ background: `linear-gradient(135deg, ${voice.colors[0]}, ${voice.colors[1]})` }}
          >
            {voice.name[0]}
          </div>
          <div>
            <div className="text-white font-semibold leading-tight">{voice.name}</div>
            <div className="text-[11px] text-white/50 mt-0.5">{voice.tag}</div>
          </div>
        </div>
        <button
          onClick={onToggle}
          aria-label={playing ? "Stop preview" : "Play preview"}
          className="w-9 h-9 rounded-full flex items-center justify-center transition"
          style={{
            background: playing ? voice.colors[0] : "rgba(255,255,255,0.06)",
            color: playing ? "#0a0a0a" : "#fff",
            border: `1px solid ${playing ? voice.colors[0] : "rgba(255,255,255,0.15)"}`,
          }}
        >
          {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>
      </div>

      <div className="relative mt-4 h-12">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <p className="relative mt-3 text-[12.5px] text-white/75 italic leading-snug min-h-[34px]">"{voice.sample}"</p>
      <div className="relative mt-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-white/40">
        <span>{voice.accent}</span>
        <span>{playing ? "● live preview" : "tap to preview"}</span>
      </div>
    </div>
  );
}
