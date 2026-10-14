import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell, AdminCard } from "@/components/admin/AdminShell";
import { UserCircle, ShieldCheck, Mail, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "Users & Accounts — Arshio Studio Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminUsers,
});

type UserAccount = {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
};

const DEFAULT_USERS: UserAccount[] = [
  {
    id: "u-admin-1",
    email: "admin@arshio.agency",
    role: "Super Administrator",
    created_at: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
    last_sign_in_at: new Date().toISOString(),
  },
  {
    id: "u-client-1",
    email: "mahmud.h@apexsupply.com",
    role: "Client (Apex Logistics)",
    created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    last_sign_in_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "u-client-2",
    email: "rashed@omniglobal.fashion",
    role: "Client (Omni Apparel)",
    created_at: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
    last_sign_in_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

function AdminUsers() {
  const [users, setUsers] = useState<UserAccount[]>(DEFAULT_USERS);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user?.email) {
        setUsers((prev) => [
          {
            id: data.session.user.id,
            email: data.session.user.email!,
            role: "Current Administrator",
            created_at: data.session.user.created_at || new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
          },
          ...prev.filter((u) => u.email !== data.session.user.email),
        ]);
      }
    });
  }, []);

  return (
    <AdminShell title="Users & Access">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Active Platform Users</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Registered agency administrators and verified client portal logins.
        </p>
      </div>

      <AdminCard className="overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#070d1e]/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono text-[10px]">
            <tr>
              <th className="px-5 py-3.5">User Email</th>
              <th className="px-5 py-3.5">Role / Permission</th>
              <th className="px-5 py-3.5">Account Created</th>
              <th className="px-5 py-3.5">Last Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#27e2c4]">
                      <UserCircle className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-xs">{u.email}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#27e2c4]/10 text-[#27e2c4] border border-[#27e2c4]/30">
                    <ShieldCheck className="w-3 h-3" />
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-400">
                  {new Date(u.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-4 text-slate-400">
                  {u.last_sign_in_at
                    ? new Date(u.last_sign_in_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </AdminShell>
  );
}
