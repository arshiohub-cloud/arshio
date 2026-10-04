import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminListUsers } from "@/lib/engagements.functions";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminUsers,
});

function AdminUsers() {
  const listFn = useServerFn(adminListUsers);
  const [users, setUsers] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    listFn().then(setUsers).catch((e) => setErr(e.message));
  }, [listFn]);

  return (
    <AdminShell title="Users">
      <p className="text-sm text-white/60">Every signed-up account. Create a project for a client from the Projects page.</p>
      {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
      <div className="mt-6 rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Joined</th>
              <th className="text-left px-4 py-2">Last sign-in</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/5">
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 text-white/60">{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-2 text-white/60">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
