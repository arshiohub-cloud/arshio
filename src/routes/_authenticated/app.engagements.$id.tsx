import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { getEngagement, sendMessage } from "@/lib/engagements.functions";
import { ArrowLeft, Send, CheckCircle2, Circle, FileText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/engagements/$id")({
  head: () => ({
    meta: [{ title: "Project — InsightAI" }, { name: "robots", content: "noindex" }],
  }),
  component: EngagementDetail,
});

const serviceLabel: Record<string, string> = {
  audit: "Free AI Audit",
  consulting: "AI Consulting",
  rag: "RAG Knowledge Base",
  automation: "Workflow Automation",
  agent: "AI Agent",
  custom: "Custom Build",
};

const statusLabel: Record<string, string> = {
  pending: "Getting started",
  active: "In progress",
  delivered: "Delivered",
  closed: "Closed",
};

function EngagementDetail() {
  const { id } = useParams({ from: "/_authenticated/app/engagements/$id" });
  const fetchDetail = useServerFn(getEngagement);
  const send = useServerFn(sendMessage);
  const [data, setData] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  const refresh = () => fetchDetail({ data: { id } }).then(setData).catch(console.error);
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    setSending(true);
    try {
      await send({ data: { engagementId: id, body: msg } });
      setMsg("");
      await refresh();
    } finally {
      setSending(false);
    }
  };

  if (!data) return <AppShell title="Loading…"><div className="text-white/50">Loading…</div></AppShell>;

  const { engagement, updates, milestones, messages, files } = data;

  return (
    <AppShell title={engagement.title}>
      <div className="max-w-5xl">
        <Link to="/app" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/50">
            {serviceLabel[engagement.service_type]}
            <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 text-white/70 normal-case tracking-normal">
              {statusLabel[engagement.status] ?? engagement.status}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold">{engagement.title}</h1>
          {engagement.summary && <p className="mt-2 text-sm text-white/70">{engagement.summary}</p>}
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6">
            <Panel title="Updates from your team">
              {updates.length === 0 ? (
                <p className="text-sm text-white/50">No updates yet.</p>
              ) : (
                <ul className="space-y-3">
                  {updates.map((u: any) => (
                    <li key={u.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                      <div className="text-xs text-white/40">{new Date(u.created_at).toLocaleString()}</div>
                      <p className="mt-1 text-sm text-white/85 whitespace-pre-wrap">{u.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Messages">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {messages.length === 0 && (
                  <p className="text-sm text-white/50">Start the conversation with your team.</p>
                )}
                {messages.map((m: any) => (
                  <div key={m.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                    <div className="text-xs text-white/40">{new Date(m.created_at).toLocaleString()}</div>
                    <p className="mt-1 text-sm text-white/85 whitespace-pre-wrap">{m.body}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={onSend} className="mt-4 flex gap-2">
                <input
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium inline-flex items-center gap-1"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </Panel>
          </section>

          <aside className="space-y-6">
            <Panel title="Milestones">
              {milestones.length === 0 ? (
                <p className="text-sm text-white/50">No milestones yet.</p>
              ) : (
                <ul className="space-y-2">
                  {milestones.map((m: any) => (
                    <li key={m.id} className="flex items-start gap-2 text-sm">
                      {m.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-white/30 mt-0.5" />
                      )}
                      <span className={m.done ? "text-white/50 line-through" : "text-white/85"}>{m.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
            <Panel title="Documents">
              {files.length === 0 ? (
                <p className="text-sm text-white/50">No documents yet.</p>
              ) : (
                <ul className="space-y-2">
                  {files.map((f: any) => (
                    <li key={f.id} className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-white/50" />
                      <span className="truncate">{f.filename}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
