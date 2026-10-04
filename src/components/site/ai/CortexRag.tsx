import { useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Brain, FileText, Loader2, Quote, RotateCcw, Search, Upload, AlertTriangle } from "lucide-react";
import { askCortex, type CortexChunk } from "@/lib/cortex-rag.functions";
import { CORTEX_SOURCES } from "@/lib/cortex-corpus";
import { chunkText } from "@/lib/cortex-chunk";

type Mode = "sample" | "custom";

const SAMPLE_QUESTIONS = [
  "Who approves a $6,000 purchase?",
  "How much is the home office stipend?",
  "What happens if uptime drops below 98%?",
  "What is required before delivery starts?",
  "How long do I have to submit an expense?",
];

const ACCENT = "#67e8f9";

function Chunk({ n, c, active }: { n: number; c: CortexChunk; active: boolean }) {
  return (
    <div
      className="rounded-xl p-4 transition-all"
      style={{
        background: active ? "rgba(103,232,249,0.07)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? "rgba(103,232,249,0.4)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-[11px] font-mono px-2 py-0.5 rounded-full"
          style={{ background: `${ACCENT}1a`, color: ACCENT, border: `1px solid ${ACCENT}44` }}
        >
          [{n}]
        </span>
        <span className="text-[12px] text-white/80 font-medium truncate">{c.source}</span>
        <span className="text-[11px] text-white/35">· {c.section}</span>
        <span className="ml-auto text-[11px] font-mono text-white/35">match {c.score.toFixed(2)}</span>
      </div>
      <p className="text-[13px] leading-relaxed text-[#9ca3af] whitespace-pre-wrap">{c.text}</p>
    </div>
  );
}

/** Renders the answer, turning [1] markers into hoverable citation chips. */
function Answer({ text, onCite }: { text: string; onCite: (n: number | null) => void }) {
  const parts = text.split(/(\[\d+\])/g);
  return (
    <p className="text-[15px] leading-7 text-[#e5e7eb] whitespace-pre-wrap">
      {parts.map((p, i) => {
        const m = p.match(/^\[(\d+)\]$/);
        if (!m) return <span key={i}>{p}</span>;
        const n = Number(m[1]);
        return (
          <button
            key={i}
            type="button"
            onMouseEnter={() => onCite(n)}
            onMouseLeave={() => onCite(null)}
            onClick={() => onCite(n)}
            className="mx-0.5 align-baseline text-[11px] font-mono px-1.5 py-0.5 rounded-full transition"
            style={{ background: `${ACCENT}1a`, color: ACCENT, border: `1px solid ${ACCENT}55` }}
          >
            {n}
          </button>
        );
      })}
    </p>
  );
}

export function CortexRag() {
  const ask = useServerFn(askCortex);
  const fileRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<Mode>("sample");
  const [customTitle, setCustomTitle] = useState("");
  const [customText, setCustomText] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [grounded, setGrounded] = useState(true);
  const [chunks, setChunks] = useState<CortexChunk[]>([]);
  const [activeCite, setActiveCite] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const indexed = useMemo(() => {
    if (mode === "sample") {
      return CORTEX_SOURCES.flatMap((s) => chunkText(s.title, s.body)).length;
    }
    if (customText.trim().length < 50) return 0;
    return chunkText(customTitle || "Your document", customText).length;
  }, [mode, customText, customTitle]);

  const readyToAsk =
    question.trim().length > 2 && (mode === "sample" || customText.trim().length >= 50) && !loading;

  async function onFile(file: File) {
    setError(null);
    if (file.size > 4_000_000) {
      setError("That file is a bit large — please use something under 4 MB or paste an excerpt.");
      return;
    }
    const isPdf = /\.pdf$/i.test(file.name) || file.type === "application/pdf";
    const isText = /\.(txt|md|markdown|csv|json)$/i.test(file.name) || file.type.startsWith("text/");
    if (!isPdf && !isText) {
      setError("Please use a PDF, plain text, Markdown, CSV or JSON file — or paste the text directly.");
      return;
    }
    try {
      if (isPdf) {
        const { extractPdfText } = await import("@/lib/pdf-text");
        const text = await extractPdfText(file);
        if (text.trim().length < 20) {
          setError("No readable text found in that PDF — it may be a scanned image. Try pasting the text instead.");
          return;
        }
        setCustomTitle(file.name);
        setCustomText(text.slice(0, 40000));
        return;
      }
      const text = await file.text();
      setCustomTitle(file.name);
      setCustomText(text.slice(0, 40000));
    } catch {
      setError("Couldn't read that file. Try another one or paste the text directly.");
    }
  }

  async function submit() {
    if (!readyToAsk) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    setChunks([]);
    setActiveCite(null);
    try {
      const res = await ask({
        data: {
          question: question.trim(),
          ...(mode === "custom"
            ? { customText: customText.trim(), customTitle: customTitle || "Your document" }
            : {}),
        },
      });
      setAnswer(res.answer);
      setGrounded(res.grounded);
      setChunks(res.chunks);
    } catch {
      setError("Cortex couldn't answer just now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setQuestion("");
    setAnswer(null);
    setChunks([]);
    setActiveCite(null);
    setError(null);
  }

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(170deg, rgba(103,232,249,0.06), rgba(0,0,0,0))",
        border: "1px solid rgba(103,232,249,0.18)",
        boxShadow: "0 50px 120px -70px rgba(103,232,249,0.55)",
      }}
    >
      {/* header */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-5 border-b border-white/10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${ACCENT}14`, border: `1px solid ${ACCENT}44` }}
        >
          <Brain size={20} color={ACCENT} />
        </div>
        <div>
          <div className="text-white font-semibold text-sm">Cortex — Company Brain</div>
          <div className="text-[12px] text-white/45">Answers only from the documents it was given, with citations</div>
        </div>
        <div className="ml-auto text-[11px] font-mono text-white/40">
          {indexed > 0 ? `${indexed} passages indexed` : "no passages yet"}
        </div>
      </div>

      {/* mode switch */}
      <div className="flex gap-2 px-6 pt-5">
        {(
          [
            { k: "sample" as Mode, label: "Sample company documents", icon: FileText },
            { k: "custom" as Mode, label: "Use your own document", icon: Upload },
          ]
        ).map(({ k, label, icon: Icon }) => (
          <button
            key={k}
            onClick={() => {
              setMode(k);
              reset();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition"
            style={
              mode === k
                ? { background: `${ACCENT}18`, color: ACCENT, border: `1px solid ${ACCENT}55` }
                : { background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }
            }
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      <div className="px-6 py-6 grid lg:grid-cols-2 gap-6">
        {/* left: sources / input */}
        <div className="space-y-4">
          {mode === "sample" ? (
            <>
              <div className="text-[12px] uppercase tracking-wider text-white/40">Knowledge loaded</div>
              <div className="space-y-2">
                {CORTEX_SOURCES.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <FileText className="w-4 h-4 shrink-0" style={{ color: ACCENT }} />
                    <div className="min-w-0">
                      <div className="text-[13px] text-white/85 truncate">{s.title}</div>
                      <div className="text-[11px] text-white/40">{s.kind}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="text-[12px] uppercase tracking-wider text-white/40">Feed Cortex your text</div>
              <input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Document name (optional)"
                className="w-full rounded-xl px-4 py-2.5 text-sm bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-cyan-400/50"
              />
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={9}
                placeholder="Paste a policy, contract, handbook, FAQ or report here — Cortex will split it into passages and answer only from it."
                className="w-full rounded-xl px-4 py-3 text-sm bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-cyan-400/50 resize-y leading-relaxed"
              />
              <div className="flex items-center gap-3">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.txt,.md,.markdown,.csv,.json,text/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void onFile(f);
                  }}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium"
                  style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <Upload className="w-3.5 h-3.5" /> Upload a file
                </button>
                <span className="text-[11px] text-white/35">
                  {customText.trim().length > 0 ? `${customText.trim().length.toLocaleString()} characters` : "PDF, text, Markdown, CSV or JSON"}
                </span>
              </div>
              <p className="text-[11px] text-white/35">
                Your text is used only to answer this question and is not stored.
              </p>
            </>
          )}

          {/* question box */}
          <div className="pt-2 space-y-3">
            <div className="text-[12px] uppercase tracking-wider text-white/40">Ask a question</div>
            <div className="flex gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void submit();
                }}
                placeholder={mode === "sample" ? "e.g. Who approves a $6,000 purchase?" : "Ask something answered in your text"}
                className="flex-1 rounded-xl px-4 py-3 text-sm bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-cyan-400/50"
              />
              <button
                onClick={() => void submit()}
                disabled={!readyToAsk}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold disabled:opacity-40 transition"
                style={{ background: "linear-gradient(120deg, #0ea5e9, #22d3ee)", color: "#06202a" }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Ask
              </button>
            </div>
            {mode === "sample" && (
              <div className="flex flex-wrap gap-2">
                {SAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuestion(q)}
                    className="text-[11px] px-2.5 py-1 rounded-full transition hover:bg-white/10"
                    style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {error && (
              <div className="flex items-start gap-2 text-[12px] text-amber-300/90">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {error}
              </div>
            )}
          </div>
        </div>

        {/* right: answer + retrieved passages */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="text-[12px] uppercase tracking-wider text-white/40">Answer</div>
            {answer && (
              <button onClick={reset} className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-white/45 hover:text-white/80">
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div
            className="rounded-2xl p-5 min-h-[140px]"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${answer && !grounded ? "rgba(251,191,36,0.35)" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Loader2 className="w-4 h-4 animate-spin" /> Retrieving passages and grounding the answer…
              </div>
            ) : answer ? (
              <>
                {!grounded && (
                  <div className="flex items-center gap-2 text-[12px] text-amber-300/90 mb-3">
                    <AlertTriangle className="w-3.5 h-3.5" /> Not found in the documents — Cortex refuses to guess.
                  </div>
                )}
                <Answer text={answer} onCite={setActiveCite} />
              </>
            ) : (
              <p className="text-sm text-white/35">
                Ask a question and Cortex will answer using only the passages it retrieves — every claim carries a citation you can open.
              </p>
            )}
          </div>

          {chunks.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-white/40">
                <Quote className="w-3.5 h-3.5" /> Retrieved passages
              </div>
              <div className="space-y-2">
                {chunks.map((c, i) => (
                  <Chunk key={c.id} n={i + 1} c={c} active={activeCite === i + 1} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
