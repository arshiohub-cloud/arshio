import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { runAgentChat } from "@/lib/agent-chat.functions";
import { Sparkles, Send, Loader2 } from "lucide-react";

const PRESETS = [
  "Summarize the benefits of agentic AI for ops teams",
  "Draft a 3-step plan to deploy a support copilot",
  "What's the difference between RAG and fine-tuning?",
];

export function PromptPlayground() {
  const run = useServerFn(runAgentChat);
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function submit(p: string) {
    if (!p.trim() || loading) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await run({ data: { prompt: p } });
      setAnswer(res.answer);
    } catch (e) {
      setAnswer(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card p-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-11 h-11 rounded-lg border border-[#67e8f9]/30 bg-[#67e8f9]/5 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#67e8f9]" />
        </span>
        <div>
          <h3 className="text-white font-semibold text-lg">Try the AI live</h3>
          <p className="text-xs text-[#888]">A peek at our agent runtime — ask anything.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => { setPrompt(p); submit(p); }}
            className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-[#bbb] hover:border-[#67e8f9]/40 hover:text-white transition"
          >
            {p}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); submit(prompt); }} className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask the AI assistant…"
          className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#666] focus:outline-none focus:border-[#67e8f9]/40"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="btn-primary text-sm inline-flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Run
        </button>
      </form>

      {(answer || loading) && (
        <div className="mt-5 rounded-lg p-5 text-sm text-[#ddd] leading-relaxed whitespace-pre-wrap" style={{ background: "rgba(103,232,249,0.04)", border: "1px solid rgba(103,232,249,0.15)" }}>
          {loading ? <span className="text-[#888]">Thinking…</span> : answer}
        </div>
      )}
    </div>
  );
}
