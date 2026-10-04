import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useRouterState } from "@tanstack/react-router";
import { X, Send, Loader2 } from "lucide-react";
import { runAgentChat } from "@/lib/agent-chat.functions";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What does InsightAI do?",
  "Explain RAG in simple terms",
  "How can AI help my business?",
  "What's the difference between ML and AI?",
];

export function FloatingChat() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/admin")) return null;
  return <FloatingChatInner />;
}

function FloatingChatInner() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Hi! I'm Forge 🤖 — ask me anything and I'll give you a quick answer.",
    },
  ]);
  const askFn = useServerFn(runAgentChat);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Auto-open on first visit (per browser)
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (!localStorage.getItem("forge_chat_seen")) {
        const t = setTimeout(() => {
          setOpen(true);
          localStorage.setItem("forge_chat_seen", "1");
        }, 1200);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  // Allow other components to open the chat via a custom event
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => setOpen(true);
    window.addEventListener("forge:open", handler);
    return () => window.removeEventListener("forge:open", handler);
  }, []);



  async function send(text: string) {
    const prompt = text.trim();
    if (!prompt || loading) return;
    const history = messages.slice(-10);
    setMessages((m) => [...m, { role: "user", content: prompt }]);
    setInput("");
    setLoading(true);
    try {
      const res = await askFn({ data: { prompt, history } });
      setMessages((m) => [...m, { role: "assistant", content: res.answer }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating robot button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Chat with Forge AI"
          className="fixed bottom-5 right-5 z-[60] group"
        >
          <span
            className="absolute inset-0 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"
            style={{ background: "radial-gradient(circle, #22d3ee99, #a78bfa55 60%, transparent 80%)" }}
          />
          <span
            className="relative flex items-center justify-center w-16 h-16 rounded-full border border-white/20 shadow-2xl"
            style={{
              background: "linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #312e81 100%)",
              animation: "fcFloat 3.5s ease-in-out infinite",
            }}
          >
            <RobotIcon />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-black animate-pulse" />
          </span>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs bg-white text-black px-2.5 py-1 rounded-md shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ask Forge AI
          </span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-[60] w-[min(380px,calc(100vw-2rem))] max-h-[min(600px,calc(100vh-2rem))] flex flex-col rounded-2xl border border-white/15 shadow-2xl overflow-hidden"
          style={{ background: "linear-gradient(180deg, #0b1020 0%, #0a0f1d 100%)" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10"
            style={{ background: "linear-gradient(90deg, #1e1b4b 0%, #0c1226 100%)" }}
          >
            <div className="relative w-9 h-9 rounded-full flex items-center justify-center border border-white/15"
              style={{ background: "linear-gradient(160deg, #312e81, #0f172a)" }}
            >
              <RobotIcon small />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0b1020]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white">Forge AI</div>
              <div className="text-[11px] text-white/55">Online · AI Assistant</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white rounded-br-sm"
                      : "bg-white/[0.06] text-white/90 border border-white/10 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm text-white/70 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Forge is thinking…
                </div>
              </div>
            )}
            {messages.length === 1 && !loading && (
              <div className="pt-1 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-white/15 bg-white/[0.04] text-white/75 hover:bg-white/[0.08] hover:text-white transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="border-t border-white/10 p-2.5 flex items-center gap-2"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Forge anything…"
              className="flex-1 bg-white/[0.06] border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="w-9 h-9 flex items-center justify-center rounded-full text-white disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #a78bfa, #22d3ee)" }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes fcFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}

function RobotIcon({ small = false }: { small?: boolean }) {
  const size = small ? 22 : 32;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="fcBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <line x1="32" y1="10" x2="32" y2="4" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="3" r="2.2" fill="#22d3ee">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <rect x="12" y="12" width="40" height="34" rx="12" fill="url(#fcBody)" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="18" y="20" width="28" height="16" rx="6" fill="#0f172a" />
      <circle cx="26" cy="28" r="2.4" fill="#22d3ee">
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="38" cy="28" r="2.4" fill="#22d3ee">
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <rect x="28" y="40" width="8" height="3" rx="1.5" fill="#22d3ee" />
      <rect x="22" y="48" width="20" height="12" rx="5" fill="url(#fcBody)" stroke="#cbd5e1" strokeWidth="1" />
      <circle cx="32" cy="54" r="2" fill="#22d3ee" />
    </svg>
  );
}
