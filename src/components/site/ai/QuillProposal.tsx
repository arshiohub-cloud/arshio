import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Copy, Loader2, PenLine, RotateCcw } from "lucide-react";
import { generateProposal } from "@/lib/quill-proposal.functions";

type Brief = {
  company: string;
  industry: string;
  requirements: string;
  budget: string;
  timeline: string;
};

const EMPTY: Brief = { company: "", industry: "", requirements: "", budget: "", timeline: "" };

const EXAMPLES: { label: string; brief: Brief }[] = [
  {
    label: "Clinic — patient call handling",
    brief: {
      company: "Northside Family Clinic",
      industry: "Healthcare",
      requirements:
        "Front desk is overwhelmed by inbound calls. We want an AI voice and chat agent that books appointments, verifies insurance details, sends reminders and escalates anything clinical to staff. Must integrate with our scheduling system.",
      budget: "$25,000 – $40,000",
      timeline: "Live within 10 weeks",
    },
  },
  {
    label: "Logistics — document processing",
    brief: {
      company: "Harbor Freight Lines",
      industry: "Logistics & Transportation",
      requirements:
        "We process about 4,000 invoices, bills of lading and customs documents a month by hand. We need automated extraction into structured data, validation against our ERP, and an approval queue for exceptions.",
      budget: "$50,000 – $80,000",
      timeline: "Phase 1 in one quarter",
    },
  },
  {
    label: "SaaS — support copilot",
    brief: {
      company: "Bright Ledger",
      industry: "B2B SaaS / FinTech",
      requirements:
        "Support team of 6 handles 3,000 tickets a month. We want an AI agent grounded in our help centre and product docs that resolves tier-1 tickets, drafts replies for tier-2, and hands billing issues to a human with full context.",
      budget: "around $35,000",
      timeline: "8 weeks",
    },
  },
];

const COOLDOWN_MS = 20000;

/** Minimal markdown renderer for the proposal document (headings, bullets, tables, bold, italics). */
function inline(text: string, keyBase: string) {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${keyBase}-b${i++}`} className="text-white font-semibold">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      nodes.push(
        <em key={`${keyBase}-i${i++}`} className="text-[#a1a1aa]">
          {token.slice(1, -1)}
        </em>,
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function ProposalDoc({ markdown }: { markdown: string }) {
  const lines = markdown.replace(/^```(?:markdown)?\s*$/gm, "").split("\n");
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  let table: string[][] = [];

  const flushBullets = (k: string) => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={k} className="my-3 space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-[#cfcfd6] leading-relaxed">
            <span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#a78bfa" }} />
            <span>{inline(b, `${k}-${i}`)}</span>
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  const flushTable = (k: string) => {
    if (!table.length) return;
    const [head, ...rows] = table;
    blocks.push(
      <div key={k} className="my-4 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "rgba(167,139,250,0.10)" }}>
              {head.map((c, i) => (
                <th key={i} className="text-left px-4 py-2.5 text-[11px] uppercase tracking-wider text-[#c4b5fd] font-semibold whitespace-nowrap">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="border-t border-white/5">
                {r.map((c, ci) => (
                  <td key={ci} className="px-4 py-2.5 text-[#cfcfd6] align-top">
                    {inline(c, `${k}-${ri}-${ci}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    table = [];
  };

  lines.forEach((raw, idx) => {
    const line = raw.trim();
    const isTableRow = line.startsWith("|") && line.endsWith("|");
    const isDivider = /^\|[\s:|-]+\|$/.test(line);

    if (isTableRow) {
      flushBullets(`ul-${idx}`);
      if (!isDivider) {
        table.push(
          line
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim()),
        );
      }
      return;
    }
    flushTable(`tbl-${idx}`);

    if (/^[-*•]\s+/.test(line)) {
      bullets.push(line.replace(/^[-*•]\s+/, ""));
      return;
    }
    if (/^\d+[.)]\s+/.test(line)) {
      bullets.push(line.replace(/^\d+[.)]\s+/, ""));
      return;
    }
    flushBullets(`ul-${idx}`);

    if (!line) return;

    if (/^#{1,6}\s+/.test(line)) {
      const text = line.replace(/^#{1,6}\s+/, "");
      blocks.push(
        <h3
          key={`h-${idx}`}
          className="mt-7 mb-1 text-base md:text-lg font-bold tracking-tight"
          style={{ color: "#fff" }}
        >
          <span className="mr-2" style={{ color: "#67e8f9" }}>
            §
          </span>
          {text}
        </h3>,
      );
      return;
    }

    blocks.push(
      <p key={`p-${idx}`} className="my-2.5 text-sm text-[#cfcfd6] leading-relaxed">
        {inline(line, `p-${idx}`)}
      </p>,
    );
  });

  flushBullets("ul-end");
  flushTable("tbl-end");

  return <div>{blocks}</div>;
}

const field =
  "w-full rounded-lg bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#a78bfa] transition";
const label = "block text-[11px] uppercase tracking-[0.18em] text-[#a78bfa] mb-2";

export function QuillProposal() {
  const run = useServerFn(generateProposal);
  const [brief, setBrief] = useState<Brief>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const outRef = useRef<HTMLDivElement | null>(null);

  const set = (k: keyof Brief) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setBrief((b) => ({ ...b, [k]: e.target.value }));

  const valid = brief.company.trim() && brief.industry.trim() && brief.requirements.trim().length >= 10;

  const onGenerate = async () => {
    if (!valid || loading || cooldown) return;
    setLoading(true);
    setError(null);
    setProposal("");
    try {
      const res = await run({
        data: {
          company: brief.company.trim().slice(0, 120),
          industry: brief.industry.trim().slice(0, 120),
          requirements: brief.requirements.trim().slice(0, 2000),
          budget: brief.budget.trim().slice(0, 120),
          timeline: brief.timeline.trim().slice(0, 120),
        },
      });
      if (res.error) setError(res.error);
      else {
        setProposal(res.proposal);
        setTimeout(() => outRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setCooldown(true);
      setTimeout(() => setCooldown(false), COOLDOWN_MS);
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(proposal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const onReset = () => {
    setBrief(EMPTY);
    setProposal("");
    setError(null);
  };

  return (
    <div
      className="rounded-2xl border border-white/10 p-6 md:p-8"
      style={{ background: "linear-gradient(180deg, #0a0a14 0%, #050505 100%)" }}
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: "rgba(167,139,250,0.14)", border: "1px solid rgba(167,139,250,0.35)" }}
        >
          <PenLine className="w-5 h-5" style={{ color: "#c4b5fd" }} />
        </span>
        <div>
          <div className="text-white font-semibold">Quill — Proposal &amp; Quotation Agent</div>
          <div className="text-[12px] text-[#888]">
            Live demonstration · nothing is saved · pricing is indicative
          </div>
        </div>
      </div>

      {/* Example briefs */}
      <div className="mb-6">
        <div className={label}>Try an example brief</div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => {
                setBrief(ex.brief);
                setProposal("");
                setError(null);
              }}
              disabled={loading}
              className="text-sm px-3 py-1.5 rounded-full border transition disabled:opacity-50"
              style={{
                background: "rgba(103,232,249,0.08)",
                borderColor: "rgba(103,232,249,0.35)",
                color: "#a5f3fc",
              }}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brief form */}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="quill-company">
            Client or company name
          </label>
          <input id="quill-company" className={field} value={brief.company} onChange={set("company")} placeholder="Northside Family Clinic" maxLength={120} />
        </div>
        <div>
          <label className={label} htmlFor="quill-industry">
            Industry
          </label>
          <input id="quill-industry" className={field} value={brief.industry} onChange={set("industry")} placeholder="Healthcare" maxLength={120} />
        </div>
      </div>

      <div className="mt-5">
        <label className={label} htmlFor="quill-req">
          What do they need?
        </label>
        <textarea
          id="quill-req"
          rows={5}
          className={field}
          value={brief.requirements}
          onChange={set("requirements")}
          maxLength={2000}
          placeholder="Describe the problem, the systems involved, and what success looks like."
        />
        <div className="mt-1 text-right text-[11px] text-[#666]">{brief.requirements.length}/2000</div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-2">
        <div>
          <label className={label} htmlFor="quill-budget">
            Budget range <span className="text-[#666] normal-case tracking-normal">(optional)</span>
          </label>
          <input id="quill-budget" className={field} value={brief.budget} onChange={set("budget")} placeholder="$25,000 – $40,000" maxLength={120} />
        </div>
        <div>
          <label className={label} htmlFor="quill-timeline">
            Desired timeline <span className="text-[#666] normal-case tracking-normal">(optional)</span>
          </label>
          <input id="quill-timeline" className={field} value={brief.timeline} onChange={set("timeline")} placeholder="Live within 10 weeks" maxLength={120} />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button
          onClick={onGenerate}
          disabled={!valid || loading || cooldown}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm transition disabled:opacity-50"
          style={{
            background: "linear-gradient(120deg, #7c3aed, #4f46e5)",
            color: "#fff",
            boxShadow: "0 0 30px rgba(124,58,237,0.4)",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Quill is drafting…
            </>
          ) : (
            <>
              <PenLine className="w-4 h-4" /> Generate proposal <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        {(proposal || error) && !loading && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border border-white/15 text-[#bbb] hover:text-white hover:border-white/30 transition"
          >
            <RotateCcw className="w-4 h-4" /> Start over
          </button>
        )}
        {cooldown && !loading && (
          <span className="text-[12px] text-[#777]">One proposal at a time — try another in a few seconds.</span>
        )}
      </div>

      {loading && (
        <div className="mt-6 rounded-xl border border-[#a78bfa]/25 p-5" style={{ background: "rgba(124,58,237,0.05)" }}>
          <div className="text-[12px] uppercase tracking-[0.2em] text-[#a78bfa] mb-3 animate-pulse">
            Writing scope, timeline and pricing…
          </div>
          <div className="space-y-2.5">
            {[90, 75, 82, 60, 70].map((w, i) => (
              <div
                key={i}
                className="h-3 rounded animate-pulse"
                style={{ width: `${w}%`, background: "rgba(255,255,255,0.07)", animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="mt-6 rounded-xl border border-[#f87171]/30 p-4 text-sm text-[#fca5a5]" style={{ background: "rgba(248,113,113,0.06)" }}>
          {error}
        </div>
      )}

      {proposal && !loading && (
        <div ref={outRef} className="mt-7">
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "rgba(167,139,250,0.28)", background: "rgba(10,10,20,0.75)" }}
          >
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-white/10 bg-black/50">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#a78bfa]">Draft proposal</span>
              <button
                onClick={onCopy}
                className="inline-flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg border border-white/15 text-[#bbb] hover:text-white hover:border-white/30 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy proposal"}
              </button>
            </div>
            <div className="p-5 md:p-7">
              <ProposalDoc markdown={proposal} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-indigo-700 font-semibold text-sm hover:bg-white/90 transition">
              Book a free AI audit <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-[12px] text-[#777]">
              Quill drafted this in seconds — we turn it into a firm quote after a 30-minute call.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
