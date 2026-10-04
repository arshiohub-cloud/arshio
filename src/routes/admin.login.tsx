import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Copy, Lock, Mail, Sparkles } from "lucide-react";
import logo from "@/assets/insightai-logo.png.asset.json";
import { NeuralNetworkBG } from "@/components/site/ai/NeuralNetworkBG";
import { supabase } from "@/integrations/supabase/client";
import { seedDemoAdmin } from "@/lib/admin-auth.functions";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — InsightAI" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

const DEMO_EMAIL = "admin@insightaiconsultancy.com";
const DEMO_PASSWORD = "InsightAI2025!";

function AdminLogin() {
  const navigate = useNavigate();
  const seed = useServerFn(seedDemoAdmin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function doSignIn(em: string, pw: string) {
    const { data, error: signInErr } = await supabase.auth.signInWithPassword({
      email: em.trim().toLowerCase(),
      password: pw,
    });
    if (signInErr || !data.session) {
      throw new Error(signInErr?.message ?? "Sign in failed");
    }
    // Verify admin role
    const { data: isAdmin, error: roleErr } = await supabase.rpc("has_role", {
      _user_id: data.session.user.id,
      _role: "admin",
    });
    if (roleErr) throw new Error(roleErr.message);
    if (!isAdmin) {
      await supabase.auth.signOut();
      throw new Error("This account does not have admin access.");
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setInfo(null);
    setLoading(true);
    const isDemo =
      email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
    try {
      await doSignIn(email, password);
      navigate({ to: "/admin/dashboard", replace: true });
    } catch (err) {
      // Auto-seed on first demo login
      if (
        isDemo &&
        err instanceof Error &&
        /invalid.*credential/i.test(err.message)
      ) {
        try {
          setInfo("First-time setup: provisioning demo admin…");
          await seed();
          await doSignIn(DEMO_EMAIL, DEMO_PASSWORD);
          navigate({ to: "/admin/dashboard", replace: true });
          return;
        } catch (seedErr) {
          setError(
            seedErr instanceof Error ? seedErr.message : "Setup failed",
          );
          setLoading(false);
          return;
        }
      }
      setError(err instanceof Error ? err.message : "Sign in failed");
      setLoading(false);
    }
  };

  const seedAndSignIn = async () => {
    setError(null);
    setInfo(null);
    setSeeding(true);
    try {
      await seed();
      setInfo("Demo admin ready. Signing you in…");
      await doSignIn(DEMO_EMAIL, DEMO_PASSWORD);
      navigate({ to: "/admin/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Seed failed");
      setSeeding(false);
    }
  };

  const copy = async (val: string, key: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopied(key);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
      style={{
        background: "#080B14",
        color: "#fff",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div className="absolute inset-0">
        <NeuralNetworkBG />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 30%, rgba(108,99,255,0.18), transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(0,212,255,0.14), transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-4 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white/90"
          >
            <ArrowLeft className="w-3 h-3" /> Back to site
          </Link>
        </div>

        <div
          className="rounded-2xl border p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex flex-col items-center mb-6">
            <span className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-white/5 border border-white/10 overflow-hidden">
              <img src={logo.url} alt="InsightAI" className="w-10 h-10 object-contain" />
            </span>
            <h1 className="text-xl font-semibold">Admin Sign In</h1>
            <p className="text-xs text-white/50 mt-1">InsightAI Console</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-xs text-white/60">Email</span>
              <div className="mt-1 relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-white/10 bg-white/[0.04] text-sm focus:outline-none focus:border-[#6C63FF]/60"
                  placeholder="you@company.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs text-white/60">Password</span>
              <div className="mt-1 relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-white/10 bg-white/[0.04] text-sm focus:outline-none focus:border-[#6C63FF]/60"
                  placeholder="••••••••"
                />
              </div>
            </label>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
                {error}
              </div>
            )}
            {info && (
              <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-3 py-2">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || seeding}
              className="w-full py-2.5 rounded-md text-sm font-semibold text-white disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg,#6C63FF,#00D4FF)",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="text-[11px] uppercase tracking-wider text-white/40 mb-2">
              Demo account
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2 bg-white/[0.03] rounded-md px-3 py-2 border border-white/5">
                <span className="text-white/80 truncate">{DEMO_EMAIL}</span>
                <button
                  onClick={() => copy(DEMO_EMAIL, "e")}
                  className="text-white/50 hover:text-white"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {copied === "e" && (
                  <span className="text-emerald-400">copied</span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 bg-white/[0.03] rounded-md px-3 py-2 border border-white/5">
                <span className="text-white/80 truncate">{DEMO_PASSWORD}</span>
                <button
                  onClick={() => copy(DEMO_PASSWORD, "p")}
                  className="text-white/50 hover:text-white"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {copied === "p" && (
                  <span className="text-emerald-400">copied</span>
                )}
              </div>
            </div>
            <button
              onClick={seedAndSignIn}
              disabled={loading || seeding}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 py-2 text-xs rounded-md border border-white/10 hover:border-white/25 hover:bg-white/5 text-white/80 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {seeding
                ? "Preparing demo admin…"
                : "First time? Create demo admin & sign in"}
            </button>
            <p className="mt-3 text-[11px] text-white/40 leading-relaxed">
              First click provisions a real admin account with the credentials
              above and signs you in. Change the password later in Settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
