import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mic, PhoneOff, ArrowRight, Volume2, CalendarCheck, UserCheck, CalendarPlus } from "lucide-react";
import { ariaCaptureLead, ariaCaptureFromTranscript } from "@/lib/aria-voice.functions";

type VapiClient = {
  start: (assistant: unknown) => Promise<unknown>;
  stop: () => void;
  on: (event: string, cb: (arg?: unknown) => void) => void;
};

type TranscriptLine = { who: "caller" | "aria"; text: string };

type Captured = {
  name: string;
  email: string;
  company: string | null;
  needs: string;
  timeline: string | null;
  slot: string | null;
  booked: boolean;
  scheduledAt: string | null;
};

const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY as string | undefined;
const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID as string | undefined;

const SYSTEM_PROMPT = `You are Aria, the voice concierge for InsightAI Consultancy, a USA-based AI consultancy in Jackson Heights, New York.
InsightAI builds AI agents, RAG knowledge systems, automation, data platforms and custom AI products for businesses.
Your job on this call:
1. Greet warmly and briefly.
2. Answer questions about InsightAI's services clearly and concisely.
3. Qualify the caller: get their full name, email address, company, what problem they want to solve, and their rough timeline.
4. Offer them a free 30-minute AI audit and agree on a specific day and time that suits them.
5. As soon as you have at least their name, email and what they need, call the tool "save_lead_and_book_audit" with everything you have.
   Call it again at the end if you learn more, and always call it once a day and time is agreed.
   Right after calling it, confirm out loud: say their audit is reserved for the agreed day and time and that a confirmation will follow by email.
Keep every reply under 3 sentences — this is a live phone-style conversation, so be natural, warm and brief. Never use markdown, lists or special characters. Never make up prices; say pricing is confirmed after the free audit. Always read email addresses back to the caller to confirm you heard them correctly.`;

const BOOKING_TOOL = {
  type: "function" as const,
  async: true,
  function: {
    name: "save_lead_and_book_audit",
    description:
      "Save the caller as a qualified lead for InsightAI Consultancy and reserve their free 30-minute AI audit. Call this as soon as you have a name, email and what they need.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Caller's full name" },
        email: { type: "string", description: "Caller's email address" },
        company: { type: "string", description: "Caller's company name, if given" },
        phone: { type: "string", description: "Caller's phone number, if given" },
        needs: { type: "string", description: "One or two sentences on what the caller wants to solve" },
        timeline: { type: "string", description: "Their rough timeline, if given" },
        requested_slot: {
          type: "string",
          description: "The day and time agreed for the free 30-minute AI audit, in plain words",
        },
        timezone: { type: "string", description: "Caller's timezone, if mentioned" },
      },
      required: ["name", "email", "needs"],
    },
  },
};


export function AriaVoice() {
  const [status, setStatus] = useState<"idle" | "connecting" | "live" | "ended" | "error">("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [captured, setCaptured] = useState<Captured | null>(null);
  const [saving, setSaving] = useState(false);
  const vapiRef = useRef<VapiClient | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<TranscriptLine[]>([]);
  const capturedRef = useRef(false);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    transcriptRef.current = transcript;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [transcript]);

  // gentle idle pulse for the orb
  useEffect(() => {
    if (status !== "live") return;
    const id = setInterval(() => setLevel((l) => (l > 0.5 ? 0.2 : 0.7)), 600);
    return () => clearInterval(id);
  }, [status]);

  const saveCaller = async (args: Record<string, unknown>) => {
    const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
    const name = str(args.name);
    const email = str(args.email);
    if (!name || !email) return;
    setSaving(true);
    try {
      const res = await ariaCaptureLead({
        data: {
          name,
          email,
          company: str(args.company),
          phone: str(args.phone),
          needs: str(args.needs) ?? "Spoke with Aria on a live voice call.",
          timeline: str(args.timeline),
          requested_slot: str(args.requested_slot),
          scheduled_at: null,
          timezone: str(args.timezone) ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
      if (res.ok) {
        capturedRef.current = true;
        setCaptured({
          name,
          email,
          company: str(args.company),
          needs: str(args.needs) ?? "",
          timeline: str(args.timeline),
          slot: res.slotLabel,
          booked: Boolean(res.bookingId),
          scheduledAt: null,
        });
      }
    } catch {
      /* the transcript fallback will try again after the call */
    } finally {
      setSaving(false);
    }
  };

  const runFallback = async () => {
    if (capturedRef.current) return;
    const lines = transcriptRef.current;
    if (lines.length < 2) return;
    setSaving(true);
    try {
      const res = await ariaCaptureFromTranscript({ data: { transcript: lines } });
      if (res.ok) {
        capturedRef.current = true;
        setCaptured({
          name: "",
          email: "",
          company: null,
          needs: "",
          timeline: null,
          slot: res.slotLabel,
          booked: Boolean(res.bookingId),
          scheduledAt: null,
        });
      }
    } catch {
      /* nothing more to do */
    } finally {
      setSaving(false);
    }
  };

  const startCall = async () => {
    if (!VAPI_PUBLIC_KEY) {
      setStatus("error");
      setErrorMsg("Aria's voice service is not connected yet. Please reach us through the contact page.");
      return;
    }
    setStatus("connecting");
    setErrorMsg(null);
    setTranscript([]);
    setCaptured(null);
    capturedRef.current = false;
    transcriptRef.current = [];
    try {
      const { default: Vapi } = await import("@vapi-ai/web");
      const vapi = new Vapi(VAPI_PUBLIC_KEY) as unknown as VapiClient;
      vapiRef.current = vapi;

      vapi.on("call-start", () => setStatus("live"));
      vapi.on("call-end", () => {
        setStatus("ended");
        setIsSpeaking(false);
        void runFallback();
      });
      vapi.on("speech-start", () => setIsSpeaking(true));
      vapi.on("speech-end", () => setIsSpeaking(false));
      vapi.on("volume-level", (v) => setLevel(typeof v === "number" ? v : 0));
      vapi.on("message", (msg) => {
        const m = msg as {
          type?: string;
          role?: string;
          transcriptType?: string;
          transcript?: string;
          toolCalls?: Array<{ function?: { name?: string; arguments?: unknown } }>;
          toolCallList?: Array<{ function?: { name?: string; arguments?: unknown } }>;
          functionCall?: { name?: string; parameters?: unknown };
        };
        if (m?.type === "transcript" && m.transcriptType === "final" && m.transcript) {
          const who = m.role === "user" ? "caller" : "aria";
          setTranscript((t) => [...t, { who, text: m.transcript! }]);
          return;
        }

        const parseArgs = (raw: unknown): Record<string, unknown> | null => {
          if (!raw) return null;
          if (typeof raw === "string") {
            try {
              return JSON.parse(raw) as Record<string, unknown>;
            } catch {
              return null;
            }
          }
          return typeof raw === "object" ? (raw as Record<string, unknown>) : null;
        };

        const calls = m.toolCalls ?? m.toolCallList ?? [];
        for (const call of calls) {
          if (call?.function?.name === "save_lead_and_book_audit") {
            const args = parseArgs(call.function.arguments);
            if (args) void saveCaller(args);
          }
        }
        if (m.functionCall?.name === "save_lead_and_book_audit") {
          const args = parseArgs(m.functionCall.parameters);
          if (args) void saveCaller(args);
        }
      });
      vapi.on("error", (e) => {
        console.error("Vapi error:", e);
        setStatus("error");
        setErrorMsg("The call could not connect. Please try again, or reach us through the contact page.");
      });

      const assistant = VAPI_ASSISTANT_ID
        ? VAPI_ASSISTANT_ID
        : {
            name: "Aria — InsightAI Voice Concierge",
            firstMessage:
              "Hi, thanks for calling InsightAI Consultancy — this is Aria. How can I help you today?",
            transcriber: { provider: "deepgram", model: "nova-2", language: "en" },
            model: {
              provider: "openai",
              model: "gpt-4o-mini",
              messages: [{ role: "system", content: SYSTEM_PROMPT }],
              temperature: 0.4,
              maxTokens: 200,
              tools: [BOOKING_TOOL],
            },
            voice: { provider: "11labs", voiceId: "sarah" },
            clientMessages: ["transcript", "tool-calls", "function-call", "status-update", "speech-update"],
            endCallMessage: "Thanks for calling InsightAI. We look forward to speaking with you soon.",
            maxDurationSeconds: 300,
          };

      await vapi.start(assistant);
    } catch (e) {
      console.error(e);
      setStatus("error");
      setErrorMsg(
        "Microphone access is needed to talk to Aria. Please allow the microphone and try again."
      );
    }
  };

  const endCall = () => {
    vapiRef.current?.stop();
    setStatus("ended");
    setIsSpeaking(false);
    void runFallback();
  };

  const calendarHref = (() => {
    if (!captured?.slot) return null;
    const parsed = new Date(captured.slot);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Free 30-minute AI audit — InsightAI Consultancy",
      details: `Requested during a voice call with Aria. Slot: ${captured.slot}`,
      location: "Online",
    });
    if (!Number.isNaN(parsed.getTime())) {
      const end = new Date(parsed.getTime() + 30 * 60 * 1000);
      params.set("dates", `${fmt(parsed)}/${fmt(end)}`);
    }
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  })();


  const live = status === "live";
  const configured = Boolean(VAPI_PUBLIC_KEY);

  return (
    <div className="relative glass-card overflow-hidden p-0">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(700px circle at 30% 30%, rgba(167,139,250,0.22), transparent 60%), radial-gradient(600px circle at 80% 70%, rgba(34,211,238,0.2), transparent 60%)",
        }}
      />

      <div className="relative grid lg:grid-cols-[1.05fr_1fr] gap-0">
        {/* LEFT — orb + controls */}
        <div className="relative flex flex-col items-center justify-center p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10 min-h-[480px]">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 ${live ? "animate-ping" : ""}`} />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-white/70">
              {live ? (isSpeaking ? "Aria is speaking" : "Listening…") : status === "connecting" ? "Connecting…" : "Voice agent · idle"}
            </span>
          </div>

          {/* Orb */}
          <div className="relative w-56 h-56">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border"
                style={{
                  borderColor: "rgba(167,139,250,0.25)",
                  animation: live ? `ariaPing 2.4s cubic-bezier(0,0,0.2,1) ${i * 0.8}s infinite` : "none",
                  opacity: live ? 1 : 0.3,
                }}
              />
            ))}
            <div
              className="absolute inset-6 rounded-full transition-transform duration-300"
              style={{
                background: "radial-gradient(circle at 35% 30%, #ffffff 0%, #a78bfa 25%, #6366f1 55%, #0b0b25 100%)",
                boxShadow: live
                  ? "0 0 80px rgba(167,139,250,0.7), inset 0 0 50px rgba(34,211,238,0.4)"
                  : "0 0 30px rgba(167,139,250,0.3)",
                transform: `scale(${1 + (live ? level * 0.12 : 0)})`,
                animation: live ? "none" : "ariaFloat 5s ease-in-out infinite",
              }}
            />
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                top: "22%", left: "26%", width: "32%", height: "20%",
                background: "radial-gradient(ellipse, rgba(255,255,255,0.85), transparent 70%)",
                filter: "blur(2px)", opacity: 0.8,
              }}
            />
          </div>

          <div className="mt-6 text-center">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/50">Now talking</div>
            <div className="mt-1 text-white font-semibold text-xl">Aria · Voice Concierge</div>
            <div className="mt-1 text-sm text-white/60 max-w-sm">
              A real conversation — she answers questions about our services and can book your free AI audit.
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center gap-3">
            {!live ? (
              <button
                onClick={startCall}
                disabled={status === "connecting"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
                  color: "#0a0a0a",
                  boxShadow: "0 0 32px rgba(167,139,250,0.45)",
                }}
              >
                <Mic className="w-4 h-4" />
                {status === "connecting" ? "Connecting…" : "Talk to Aria"}
              </button>
            ) : (
              <button
                onClick={endCall}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition"
                style={{
                  background: "linear-gradient(135deg, #f43f5e, #f59e0b)",
                  color: "#0a0a0a",
                  boxShadow: "0 0 32px rgba(244,63,94,0.45)",
                }}
              >
                <PhoneOff className="w-4 h-4" /> End call
              </button>
            )}
            <span className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.04] text-white/70 flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </span>
          </div>

          {!configured && (
            <p className="mt-4 text-xs text-amber-300/80 max-w-xs text-center">
              Voice service not connected yet — the team is switching it on shortly.
            </p>
          )}
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
            <span className="text-[10px] text-white/40">Live demo · she books real audit slots</span>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 min-h-[320px] max-h-[420px] overflow-y-auto pr-1">
            {transcript.length === 0 && (
              <div className="h-full flex items-center justify-center text-center text-white/45 text-sm italic px-6">
                Press <span className="mx-1 text-white/70">"Talk to Aria"</span>, allow the microphone, and just speak — she'll answer out loud.
              </div>
            )}
            {transcript.map((m, i) => (
              <div key={i} className={`flex ${m.who === "caller" ? "justify-end" : "justify-start"}`} style={{ animation: "ariaIn 0.45s ease-out both" }}>
                <div
                  className="max-w-[85%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-snug"
                  style={
                    m.who === "caller"
                      ? { background: "rgba(163,230,53,0.12)", border: "1px solid rgba(163,230,53,0.35)", color: "#e8ffd0" }
                      : { background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.35)", color: "#efeaff" }
                  }
                >
                  <div className="text-[10px] uppercase tracking-wider mb-0.5 opacity-70">
                    {m.who === "caller" ? "You" : "Aria"}
                  </div>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {saving && !captured && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
              Saving your details…
            </div>
          )}

          {captured && (
            <div
              className="mt-4 rounded-2xl px-4 py-4"
              style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.14), rgba(34,211,238,0.10))",
                border: "1px solid rgba(16,185,129,0.4)",
                animation: "ariaIn 0.5s ease-out both",
              }}
            >
              <div className="flex items-center gap-2 text-emerald-200 font-semibold text-sm">
                {captured.booked ? <CalendarCheck className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                {captured.booked ? "AI audit reserved" : "Your details are with our team"}
              </div>
              <div className="mt-2 space-y-1 text-[13px] text-white/75">
                {captured.name && (
                  <div>
                    <span className="text-white/45">Name · </span>
                    {captured.name}
                  </div>
                )}
                {captured.email && (
                  <div>
                    <span className="text-white/45">Email · </span>
                    {captured.email}
                  </div>
                )}
                {captured.company && (
                  <div>
                    <span className="text-white/45">Company · </span>
                    {captured.company}
                  </div>
                )}
                {captured.slot && (
                  <div>
                    <span className="text-white/45">Audit slot · </span>
                    {captured.slot}
                  </div>
                )}
                {captured.timeline && (
                  <div>
                    <span className="text-white/45">Timeline · </span>
                    {captured.timeline}
                  </div>
                )}
              </div>
              {calendarHref && (
                <a
                  href={calendarHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
                  style={{ background: "linear-gradient(135deg, #10b981, #22d3ee)", color: "#07110d" }}
                >
                  <CalendarPlus className="w-3.5 h-3.5" /> Add to calendar
                </a>
              )}
              <p className="mt-3 text-[11px] text-white/45">
                Our team will email you to confirm. Pricing is confirmed after the free audit.
              </p>
            </div>
          )}


          {status === "error" && errorMsg && (
            <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {errorMsg}{" "}
              <Link to="/contact" className="underline underline-offset-4 text-red-100">Contact us instead</Link>
            </div>
          )}

          {status === "ended" && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link to="/contact" className="btn-primary text-sm inline-flex">
                Book a free AI audit <ArrowRight className="w-4 h-4" />
              </Link>
              <button onClick={startCall} className="btn-ghost text-sm inline-flex">
                Start a new call
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ariaPing { 0% { transform: scale(0.85); opacity: 0.6; } 80%, 100% { transform: scale(1.4); opacity: 0; } }
        @keyframes ariaFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes ariaIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
