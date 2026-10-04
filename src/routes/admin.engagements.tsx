import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminListEngagements, adminListUsers, adminCreateEngagement } from "@/lib/engagements.functions";
import { Plus, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/engagements")({
  head: () => ({ meta: [{ title: "Projects — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminEngagements,
});

const serviceLabel: Record<string, string> = {
  audit: "Audit",
  consulting: "Consulting",
  rag: "RAG",
  automation: "Automation",
  agent: "Agent",
  custom: "Custom",
};

function AdminEngagements() {
  const listFn = useServerFn(adminListEngagements);
  const usersFn = useServerFn(adminListUsers);
  const createFn = useServerFn(adminCreateEngagement);
  const [list, setList] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ userId: "", serviceType: "consulting", title: "", summary: "" });

  const refresh = () => Promise.all([listFn().then(setList), usersFn().then(setUsers)]).catch(console.error);
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userId || !form.title) return;
    await createFn({
      data: {
        userId: form.userId,
        serviceType: form.serviceType as any,
        title: form.title,
        summary: form.summary || undefined,
      },
    });
    setCreating(false);
    setForm({ userId: "", serviceType: "consulting", title: "", summary: "" });
    refresh();
  };

  const userEmail = (id: string) => users.find((u) => u.id === id)?.email ?? id.slice(0, 8);

  return (
    <AdminShell title="Projects">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/60">All active and past client projects.</p>
        <button
          onClick={() => setCreating(!creating)}
          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-2 text-sm"
        >
          <Plus className="w-4 h-4" /> New project
        </button>
      </div>

      {creating && (
        <form onSubmit={submit} className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
          <select
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            required
            className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm"
          >
            <option value="">Select client…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.email}</option>
            ))}
          </select>
          <select
            value={form.serviceType}
            onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
            className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm"
          >
            {Object.entries(serviceLabel).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            required
            className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm"
          />
          <textarea
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            placeholder="Short summary (optional)"
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
          />
          <button className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm">Create</button>
        </form>
      )}

      <div className="mt-6 space-y-2">
        {list.map((e) => (
          <Link
            key={e.id}
            to="/admin/engagements/$id"
            params={{ id: e.id }}
            className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
          >
            <div>
              <div className="text-xs text-white/50 uppercase">{serviceLabel[e.service_type]}</div>
              <div className="font-medium">{e.title}</div>
              <div className="text-xs text-white/50">{userEmail(e.user_id)}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs rounded-full border border-white/10 px-2 py-0.5">{e.status}</span>
              <ArrowRight className="w-4 h-4 text-white/40" />
            </div>
          </Link>
        ))}
        {list.length === 0 && <p className="text-sm text-white/50">No projects yet.</p>}
      </div>
    </AdminShell>
  );
}
