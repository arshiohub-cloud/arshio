import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { generateAgentSpec } from "@/lib/agent-spec.functions";

const TYPES = ["Support", "Research", "Sales", "Inbox", "Risk", "Voice", "Data", "Custom"];
const INTEGRATIONS = ["Slack", "HubSpot", "Salesforce", "Gmail", "Notion", "WhatsApp", "Jira", "Stripe", "Zendesk"];

export function AgentBuilder() {
  const run = useServerFn(generateAgentSpec);
  const [type, setType] = useState<string>("Support");
  const [picked, setPicked] = useState<string[]>(["Slack", "Gmail"]);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [spec, setSpec] = useState<string>("");

  const toggle = (i: string) =>
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  const onGenerate = async () => {
    if (!desc.trim()) return;
    setLoading(true);
    setSpec("");
    try {
      const res = await run({ data: { agentType: type, integrations: picked, description: desc.trim() } });
      setSpec(res.spec);
    } catch (e) {
      setSpec(`Error: ${e instanceof Error ? e.message : "Unknown"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 p-6 md:p-8" style={{ background: "linear-gradient(180deg, #0a0a14 0%, #050505 100%)" }}>
      {/* Step 1 */}
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#a78bfa] mb-2">Step 1 — Choose agent type</div>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => {
            const active = type === t;
            return (
              <button
                key={t}
                onClick={() => setType(t)}
                className="text-sm px-4 py-2 rounded-lg border transition"
                style={{
                  background: active ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.03)",
                  borderColor: active ? "#a78bfa" : "rgba(255,255,255,0.1)",
                  color: active ? "#fff" : "#bbb",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2 */}
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#a78bfa] mb-2">Step 2 — Choose integrations</div>
        <div className="flex flex-wrap gap-2">
          {INTEGRATIONS.map((i) => {
            const active = picked.includes(i);
            return (
              <button
                key={i}
                onClick={() => toggle(i)}
                className="text-sm px-3 py-1.5 rounded-full border transition"
                style={{
                  background: active ? "rgba(103,232,249,0.18)" : "rgba(255,255,255,0.03)",
                  borderColor: active ? "#67e8f9" : "rgba(255,255,255,0.1)",
                  color: active ? "#fff" : "#bbb",
                }}
              >
                {active ? "✓ " : "+ "}{i}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3 */}
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#a78bfa] mb-2">Step 3 — Describe what this agent should do</div>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={4}
          placeholder="e.g. Triage inbound support emails, draft replies in our brand voice, escalate billing issues to Stripe, and log every interaction in HubSpot."
          className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#a78bfa] transition"
        />
      </div>

      {/* Step 4 */}
      <button
        onClick={onGenerate}
        disabled={loading || !desc.trim()}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm transition disabled:opacity-50"
        style={{ background: "linear-gradient(120deg, #7c3aed, #4f46e5)", color: "#fff", boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Generating spec...</>
        ) : (
          <><Sparkles className="w-4 h-4" /> Generate Agent Spec <ArrowRight className="w-4 h-4" /></>
        )}
      </button>

      {/* Output */}
      {spec && (
        <div className="mt-6 rounded-xl border border-[#a78bfa]/30 p-5" style={{ background: "rgba(124,58,237,0.06)" }}>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#a78bfa] mb-3">Generated Agent Specification</div>
          <pre className="whitespace-pre-wrap text-sm text-[#ddd] leading-relaxed font-sans">{spec}</pre>
          <div className="mt-5">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-indigo-700 font-semibold text-sm hover:bg-white/90 transition"
            >
              Deploy This Agent <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
