import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Lock, User, Copy, Sparkles, Shield, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { seedDemoAdmin } from "@/lib/admin-auth.functions";
import { seedDemoClient } from "@/lib/client-auth.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — InsightAI" },
      { name: "description", content: "Sign in to your InsightAI dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const CLIENT_DEMO = { email: "client@demo.com", password: "ClientDemo2025!" };
const ADMIN_DEMO = {
  email: "admin@insightaiconsultancy.com",
  password: "InsightAI2025!",
};

type Panel = "client" | "admin";

function AuthPage() {
  const navigate = useNavigate();
  const seedAdmin = useServerFn(seedDemoAdmin);
  const seedClient = useServerFn(seedDemoClient);

  const [panel, setPanel] = useState<Panel>("client");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return;
      supabase
        .rpc("has_role", { _user_id: data.session.user.id, _role: "admin" })
        .then(({ data: isAdmin }) => {
          navigate({ to: isAdmin ? "/admin/dashboard" : "/app" });
        });
    });
  }, [navigate]);

  const switchPanel = (next: Panel) => {
    setPanel(next);
    setMode("signin");
    setError(null);
    setInfo(null);
    setEmail("");
    setPassword("");
    setName("");
  };

  async function adminSignIn(em: string, pw: string) {
    const { data, error: signInErr } = await supabase.auth.signInWithPassword({
      email: em.trim().toLowerCase(),
      password: pw,
    });
    if (signInErr || !data.session) {
      throw new Error(signInErr?.message ?? "Sign in failed");
    }
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
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      if (panel === "admin") {
        const isDemo =
          email.trim().toLowerCase() === ADMIN_DEMO.email &&
          password === ADMIN_DEMO.password;
        try {
          await adminSignIn(email, password);
          navigate({ to: "/admin/dashboard", replace: true });
        } catch (err) {
          if (
            isDemo &&
            err instanceof Error &&
            /invalid.*credential/i.test(err.message)
          ) {
            setInfo("Provisioning demo admin…");
            await seedAdmin();
            await adminSignIn(ADMIN_DEMO.email, ADMIN_DEMO.password);
            navigate({ to: "/admin/dashboard", replace: true });
            return;
          }
          throw err;
        }
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: window.location.origin + "/app",
            data: { full_name: name },
          },
        });
        if (error) throw error;
        setInfo("Account created. Signing you in…");
        const { error: sErr } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (sErr) {
          setInfo("Account created. Please sign in.");
          setMode("signin");
        } else {
          navigate({ to: "/app" });
        }
      } else {
        const isDemo =
          email.trim().toLowerCase() === CLIENT_DEMO.email &&
          password === CLIENT_DEMO.password;
        // Idempotent — makes sure demo engagement/milestones/updates exist
        // even for a demo user that was created before seeding included them.
        if (isDemo) {
          try { await seedClient(); } catch { /* non-fatal */ }
        }
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
          });
          if (error) throw error;
          navigate({ to: "/app" });
        } catch (err) {
          if (
            isDemo &&
            err instanceof Error &&
            /invalid.*credential/i.test(err.message)
          ) {
            setInfo("Provisioning demo client…");
            await seedClient();
            const { error: e2 } = await supabase.auth.signInWithPassword({
              email: CLIENT_DEMO.email,
              password: CLIENT_DEMO.password,
            });
            if (e2) throw e2;
            navigate({ to: "/app" });
            return;
          }
          throw err;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const useDemo = () => {
    if (panel === "admin") {
      setEmail(ADMIN_DEMO.email);
      setPassword(ADMIN_DEMO.password);
    } else {
      setMode("signin");
      setEmail(CLIENT_DEMO.email);
      setPassword(CLIENT_DEMO.password);
    }
    setError(null);
    setInfo(null);
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

  const demo = panel === "admin" ? ADMIN_DEMO : CLIENT_DEMO;

  const isAdmin = panel === "admin";
  const accentFrom = isAdmin ? "#00D4FF" : "#6366F1";
  const accentTo = isAdmin ? "#6366F1" : "#A855F7";

  return (
    <div
      className="min-h-screen w-full flex bg-black text-zinc-100 selection:bg-indigo-500/30"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Left: atmospheric visual */}
      <div className="hidden lg:flex relative w-1/2 items-center justify-center bg-zinc-950 overflow-hidden border-r border-white/5">
        {/* radial base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.1) 40%, transparent 70%)",
          }}
        />
        {/* floating aura blobs */}
        <div
          className="absolute w-96 h-96 rounded-full auth-float"
          style={{
            top: "18%",
            left: "18%",
            background: `${accentFrom}33`,
            filter: "blur(120px)",
            transition: "background 600ms ease",
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full auth-float"
          style={{
            bottom: "18%",
            right: "10%",
            background: `${accentTo}33`,
            filter: "blur(110px)",
            animationDelay: "-5s",
            transition: "background 600ms ease",
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full auth-float"
          style={{
            top: "55%",
            left: "40%",
            background: "rgba(59,130,246,0.18)",
            filter: "blur(100px)",
            animationDelay: "-2s",
          }}
        />

        {/* dot grid */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* content */}
        <div className="relative z-10 p-14 max-w-lg">
          <div className="mb-10 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
                boxShadow: `0 10px 40px -10px ${accentFrom}80`,
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              InsightAI
            </span>
          </div>

          <h2 className="text-4xl font-light leading-[1.15] tracking-tight mb-5">
            The next evolution of{" "}
            <span
              className="bg-clip-text text-transparent font-medium"
              style={{
                backgroundImage: `linear-gradient(90deg, ${accentFrom}, ${accentTo})`,
              }}
            >
              intelligent automation
            </span>{" "}
            is here.
          </h2>
          <p className="text-zinc-400 leading-relaxed text-[15px]">
            Sign in to your workspace to orchestrate AI agents, monitor
            engagements, and turn workflows into measurable outcomes.
          </p>

          {/* status pill */}
          <div className="mt-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            All systems online · Models responding
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 relative">
        <Link
          to="/"
          className="absolute top-6 left-6 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          ← Back to site
        </Link>

        <div className="w-full max-w-md space-y-7">
          <div className="text-left">
            <h1 className="text-2xl font-medium tracking-tight">
              {isAdmin
                ? "Admin sign in"
                : mode === "signin"
                  ? "Welcome back"
                  : "Create your account"}
            </h1>
            <p className="text-zinc-500 mt-2 text-sm">
              {isAdmin
                ? "InsightAI operations console."
                : mode === "signin"
                  ? "Enter your credentials to access your workspace."
                  : "Get a dashboard for every AI service you take with us."}
            </p>
          </div>

          {/* Role tabs */}
          <div className="p-1 bg-zinc-900/80 border border-white/10 rounded-xl flex">
            <button
              onClick={() => switchPanel("client")}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                !isAdmin
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <UserRound className="w-4 h-4" /> Client
            </button>
            <button
              onClick={() => switchPanel("admin")}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                isAdmin
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Shield className="w-4 h-4" /> Admin
            </button>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {!isAdmin && mode === "signup" && (
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider ml-1">
                  Full name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider ml-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={8}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            {info && (
              <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md px-3 py-2">
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-medium rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
                boxShadow: `0 10px 30px -10px ${accentFrom}80`,
              }}
            >
              {loading
                ? "Please wait…"
                : isAdmin
                  ? "Sign in to admin"
                  : mode === "signin"
                    ? "Sign in to account"
                    : "Create account"}
            </button>
          </form>

          {!isAdmin && (
            <button
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setInfo(null);
              }}
              className="w-full text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              {mode === "signin"
                ? "Don't have an account? Create one"
                : "Already have an account? Sign in"}
            </button>
          )}

          {/* Demo credentials */}
          <div className="pt-6 border-t border-white/5">
            <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                  Demo {panel} access
                </span>
                <button
                  type="button"
                  onClick={useDemo}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300 hover:text-indigo-200 py-1 px-2 rounded-md hover:bg-indigo-500/5 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  Use demo
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-tighter mb-1">
                    Email
                  </p>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm text-zinc-300 font-mono truncate">
                      {demo.email}
                    </p>
                    <button
                      type="button"
                      onClick={() => copy(demo.email, "e")}
                      className="text-zinc-500 hover:text-zinc-200 shrink-0"
                      aria-label="Copy email"
                    >
                      {copied === "e" ? (
                        <span className="text-emerald-400 text-[10px]">
                          copied
                        </span>
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-tighter mb-1">
                    Password
                  </p>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm text-zinc-300 font-mono truncate">
                      {demo.password}
                    </p>
                    <button
                      type="button"
                      onClick={() => copy(demo.password, "p")}
                      className="text-zinc-500 hover:text-zinc-200 shrink-0"
                      aria-label="Copy password"
                    >
                      {copied === "p" ? (
                        <span className="text-emerald-400 text-[10px]">
                          copied
                        </span>
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[11px] text-zinc-500 leading-relaxed">
                First sign-in with demo credentials auto-provisions the account.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes auth-float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.85; }
          50% { transform: translateY(-24px) scale(1.06); opacity: 1; }
        }
        .auth-float { animation: auth-float 10s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
