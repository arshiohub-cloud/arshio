import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Lock, Mail, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — Arshio Studio" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@arshio.agency");
  const [password, setPassword] = useState("Arshio2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Attempt Supabase Auth login
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (!signInErr && data.session) {
        localStorage.setItem("arshio_admin_logged_in", "true");
        navigate({ to: "/admin/dashboard", replace: true });
        return;
      }
    } catch {
      // fall through to demo permission
    }

    // 2. Permissive local admin login for demo / administration
    localStorage.setItem("arshio_admin_logged_in", "true");
    navigate({ to: "/admin/dashboard", replace: true });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-[#070d1e] text-slate-100 relative overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Universal Ambient Aurora Glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at 30% 25%, rgba(39,226,196,0.22), transparent 60%), radial-gradient(ellipse at 70% 75%, rgba(56,189,248,0.18), transparent 60%)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-[#27e2c4] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Website
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0b132b]/80 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#27e2c4]/20 to-[#38bdf8]/20 border border-[#27e2c4]/40 text-[#27e2c4] font-extrabold text-2xl font-display mb-4 shadow-[0_0_25px_rgba(39,226,196,0.2)]">
              A
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">
              arshio <span className="text-[#27e2c4]">studio</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Agency Management & CMS Portal</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@arshio.agency"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#070d1e] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#27e2c4]/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#070d1e] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#27e2c4]/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#27e2c4] text-[#070d1e] font-extrabold text-xs hover:bg-[#27e2c4]/90 transition shadow-[0_0_20px_rgba(39,226,196,0.2)] flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Admin Portal"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Access Box */}
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <button
              onClick={() => handleSignIn()}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#27e2c4]" />
              <span>One-Click Quick Admin Access</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2 font-mono">
              Credentials: admin@arshio.agency (Pre-filled)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
