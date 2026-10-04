import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app/settings")({
  head: () => ({ meta: [{ title: "Settings — InsightAI" }, { name: "robots", content: "noindex" }] }),
  component: Settings,
});

function Settings() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  const updatePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const { error } = await supabase.auth.updateUser({ password });
    setMsg(error ? error.message : "Password updated.");
    setPassword("");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <AppShell title="Settings">
      <div className="max-w-xl space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-semibold">Account</h2>
          <p className="mt-2 text-sm text-white/70">{email}</p>
        </div>
        <form onSubmit={updatePw} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3">
          <h2 className="font-semibold">Change password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (min 8 chars)"
            minLength={8}
            required
            className="w-full h-11 px-3 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30"
          />
          {msg && <p className="text-sm text-white/70">{msg}</p>}
          <button className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium">Update</button>
        </form>
        <button
          onClick={signOut}
          className="h-10 px-4 rounded-lg border border-white/15 hover:bg-white/5 text-sm"
        >
          Sign out
        </button>
      </div>
    </AppShell>
  );
}
