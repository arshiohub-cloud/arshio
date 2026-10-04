import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell, AdminCard } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { KeyRound, Save, User } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — InsightAI Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (pw.length < 8) {
      setMsg({ kind: "err", text: "Password must be at least 8 characters." });
      return;
    }
    if (pw !== pw2) {
      setMsg({ kind: "err", text: "Passwords do not match." });
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setSaving(false);
    if (error) {
      setMsg({ kind: "err", text: error.message });
    } else {
      setPw("");
      setPw2("");
      setMsg({ kind: "ok", text: "Password updated." });
    }
  };

  return (
    <AdminShell title="Settings">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl">
        <AdminCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-white/60" />
            <h2 className="text-sm font-semibold">Account</h2>
          </div>
          <div className="space-y-3 text-sm">
            <Row k="Email" v={email ?? "—"} />
            <Row k="Role" v="Administrator" />
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-4 h-4 text-white/60" />
            <h2 className="text-sm font-semibold">Change password</h2>
          </div>
          <form onSubmit={changePassword} className="space-y-3">
            <label className="block text-sm">
              <span className="text-xs text-white/60">New password</span>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-md border border-white/10 bg-white/[0.03] text-sm focus:outline-none focus:border-[#6C63FF]/60"
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs text-white/60">Confirm password</span>
              <input
                type="password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-md border border-white/10 bg-white/[0.03] text-sm focus:outline-none focus:border-[#6C63FF]/60"
                autoComplete="new-password"
              />
            </label>
            {msg && (
              <div
                className={`text-xs rounded-md px-3 py-2 border ${
                  msg.kind === "ok"
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : "text-red-400 bg-red-500/10 border-red-500/20"
                }`}
              >
                {msg.text}
              </div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-md text-white font-medium disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#6C63FF,#00D4FF)" }}
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving…" : "Update password"}
            </button>
          </form>
        </AdminCard>
      </div>
    </AdminShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <span className="text-white/50">{k}</span>
      <span className="text-white/90">{v}</span>
    </div>
  );
}
