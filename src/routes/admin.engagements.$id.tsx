import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  getEngagement,
  adminAddUpdate,
  adminAddMilestone,
  adminToggleMilestone,
  adminUpdateEngagement,
  sendMessage,
} from "@/lib/engagements.functions";
import { ArrowLeft, Plus, CheckCircle2, Circle } from "lucide-react";

export const Route = createFileRoute("/admin/engagements/$id")({
  head: () => ({ meta: [{ title: "Project — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminEngagementDetail,
});

function AdminEngagementDetail() {
  const { id } = useParams({ from: "/admin/engagements/$id" });
  const fetchDetail = useServerFn(getEngagement);
  const addUpdate = useServerFn(adminAddUpdate);
  const addMilestone = useServerFn(adminAddMilestone);
  const toggleMs = useServerFn(adminToggleMilestone);
  const updateEng = useServerFn(adminUpdateEngagement);
  const send = useServerFn(sendMessage);
  const [data, setData] = useState<any>(null);
  const [update, setUpdate] = useState("");
  const [milestone, setMilestone] = useState("");
  const [reply, setReply] = useState("");

  const refresh = () => fetchDetail({ data: { id } }).then(setData);
  useEffect(() => {
    refresh().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!data)
    return <AdminShell title="Loading…"><div className="text-white/50">Loading…</div></AdminShell>;

  const { engagement, updates, milestones, messages } = data;

  return (
    <AdminShell title={engagement.title}>
      <Link to="/admin/engagements" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to projects
      </Link>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex items-center gap-4">
        <div className="flex-1">
          <div className="text-xs uppercase text-white/50">{engagement.service_type}</div>
          <h1 className="text-xl font-bold">{engagement.title}</h1>
        </div>
        <select
          value={engagement.status}
          onChange={async (e) => {
            await updateEng({ data: { id, status: e.target.value as any } });
            refresh();
          }}
          className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm"
        >
          {[
            ["pending", "Getting started"],
            ["active", "In progress"],
            ["delivered", "Delivered"],
            ["closed", "Closed"],
          ].map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-semibold">Post an update</h2>
          <form
            className="mt-3 space-y-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!update.trim()) return;
              await addUpdate({ data: { engagementId: id, body: update } });
              setUpdate("");
              refresh();
            }}
          >
            <textarea
              value={update}
              onChange={(e) => setUpdate(e.target.value)}
              rows={3}
              placeholder="What did you do / what's next?"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
            />
            <button className="h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm">Post update</button>
          </form>
          <ul className="mt-4 space-y-2 max-h-72 overflow-y-auto">
            {updates.map((u: any) => (
              <li key={u.id} className="rounded-lg border border-white/10 p-3 text-sm">
                <div className="text-xs text-white/40">{new Date(u.created_at).toLocaleString()}</div>
                <p className="mt-1 whitespace-pre-wrap">{u.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-semibold">Milestones</h2>
          <form
            className="mt-3 flex gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!milestone.trim()) return;
              await addMilestone({
                data: { engagementId: id, label: milestone, sort_order: milestones.length },
              });
              setMilestone("");
              refresh();
            }}
          >
            <input
              value={milestone}
              onChange={(e) => setMilestone(e.target.value)}
              placeholder="Add milestone…"
              className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm"
            />
            <button className="h-9 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-sm inline-flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>
          <ul className="mt-4 space-y-2">
            {milestones.map((m: any) => (
              <li key={m.id} className="flex items-start gap-2 text-sm">
                <button
                  onClick={async () => {
                    await toggleMs({ data: { id: m.id, done: !m.done } });
                    refresh();
                  }}
                >
                  {m.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-white/30" />
                  )}
                </button>
                <span className={m.done ? "text-white/50 line-through" : ""}>{m.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-semibold">Messages with client</h2>
          <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
            {messages.map((m: any) => (
              <div key={m.id} className="rounded-lg border border-white/10 p-3 text-sm">
                <div className="text-xs text-white/40">
                  {m.author_id === engagement.user_id ? "Client" : "You"} ·{" "}
                  {new Date(m.created_at).toLocaleString()}
                </div>
                <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
              </div>
            ))}
            {messages.length === 0 && <p className="text-sm text-white/50">No messages yet.</p>}
          </div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!reply.trim()) return;
              await send({ data: { engagementId: id, body: reply } });
              setReply("");
              refresh();
            }}
          >
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Reply to client…"
              className="flex-1 h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm"
            />
            <button className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm">Send</button>
          </form>
        </section>
      </div>
    </AdminShell>
  );
}
