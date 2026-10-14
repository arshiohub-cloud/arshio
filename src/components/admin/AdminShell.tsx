import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  Mail,
  ExternalLink,
  Menu,
  ChevronDown,
  X,
  LogOut,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Database,
  ArrowUpRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getLeadStats } from "@/lib/admin-api";

export const glassCard = "rounded-2xl border border-white/10 backdrop-blur-xl bg-[#0b132b]/80 shadow-2xl";
export const glassCardStyle: React.CSSProperties = {
  background: "rgba(11, 19, 43, 0.75)",
  borderColor: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(16px)",
};

const navItems = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/leads", label: "Leads & CRM", icon: Users, badgeKey: "newLeads" },
  { to: "/admin/engagements", label: "Client Projects", icon: Briefcase },
  { to: "/admin/email", label: "Email & Follow-Ups", icon: Mail },
  { to: "/admin/settings", label: "Site & CMS Settings", icon: Settings },
];

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [sessionEmail, setSessionEmail] = useState<string>("admin@arshio.agency");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [newCount, setNewCount] = useState<number>(0);

  useEffect(() => {
    // 1. Fetch lead stats for badge
    getLeadStats().then((s) => setNewCount(s.newLeads));

    // Listen to updates
    const onLeadsUpdated = () => {
      getLeadStats().then((s) => setNewCount(s.newLeads));
    };
    window.addEventListener("arshio_leads_updated", onLeadsUpdated);

    // 2. Auth check (permissive for local & demo access)
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user?.email) {
        setSessionEmail(data.session.user.email);
      } else {
        const storedDemo = localStorage.getItem("arshio_admin_logged_in");
        if (storedDemo === "true") {
          setSessionEmail("admin@arshio.agency");
        }
      }
    });

    return () => {
      window.removeEventListener("arshio_leads_updated", onLeadsUpdated);
    };
  }, []);

  const logout = async () => {
    localStorage.removeItem("arshio_admin_logged_in");
    await supabase.auth.signOut().catch(() => {});
    navigate({ to: "/admin/login", replace: true });
  };

  const isActive = (to: string) => pathname === to;

  return (
    <div
      className="min-h-screen flex bg-[#070d1e] text-slate-100 selection:bg-[#27e2c4]/20 selection:text-[#27e2c4]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Universal Ambient Aurora Glow */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 15% 20%, rgba(39,226,196,0.18), transparent 60%), radial-gradient(ellipse at 85% 80%, rgba(56,189,248,0.14), transparent 60%)",
        }}
      />

      {/* Sidebar Desktop & Mobile */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 border-r border-slate-800/80 bg-[#070d1e]/95 lg:bg-[#070d1e]/80 backdrop-blur-2xl flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#27e2c4]/20 to-[#38bdf8]/20 border border-[#27e2c4]/40 flex items-center justify-center shadow-[0_0_15px_rgba(39,226,196,0.2)]">
              <span className="font-extrabold text-xl text-[#27e2c4] font-display">A</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white font-display">arshio</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#27e2c4]/15 text-[#27e2c4] border border-[#27e2c4]/30">
                  Studio
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Control System v2.6</p>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Health Pill */}
        <div className="px-4 py-3 mx-4 mt-4 rounded-xl bg-[#0b132b] border border-slate-800 flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27e2c4] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#27e2c4]"></span>
          </span>
          <span className="text-xs font-medium text-slate-300">Live Database Ready</span>
          <Database className="w-3.5 h-3.5 text-[#27e2c4] ml-auto" />
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.to);
            const Icon = item.icon;
            const badgeVal = item.badgeKey === "newLeads" ? newCount : 0;

            return (
              <Link
                key={item.to}
                to={item.to as any}
                onClick={() => setMobileOpen(false)}
                className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "text-[#27e2c4] bg-[#27e2c4]/10 border border-[#27e2c4]/30 shadow-[0_0_20px_rgba(39,226,196,0.1)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? "text-[#27e2c4]" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {badgeVal > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#27e2c4] text-[#070d1e]">
                    {badgeVal}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Current User Bottom Card */}
        <div className="p-4 border-t border-slate-800/80 bg-[#070d1e]/50">
          <div className="p-3 rounded-xl bg-[#0b132b] border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#27e2c4] to-[#38bdf8] text-[#070d1e] font-bold flex items-center justify-center text-sm">
              {sessionEmail.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">{sessionEmail}</div>
              <div className="text-[10px] text-[#27e2c4] flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3" /> Senior Admin
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Area */}
      <div className="flex-1 min-w-0 flex flex-col relative z-10">
        {/* Top Navbar */}
        <header className="h-20 px-4 sm:px-8 border-b border-slate-800/80 bg-[#070d1e]/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[#0b132b] border border-slate-800 text-slate-300"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                {title}
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Arshio Studio Agency Operations & CMS Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-[#27e2c4] px-3.5 py-2 rounded-xl bg-[#0b132b] border border-slate-800 hover:border-[#27e2c4]/40 transition"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#27e2c4]" />
            </a>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#0b132b] border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-[#27e2c4]/20 border border-[#27e2c4]/40 text-[#27e2c4] flex items-center justify-center text-xs font-bold font-mono">
                  {sessionEmail.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 py-1.5 rounded-2xl bg-[#0b132b] border border-slate-800 shadow-2xl z-50"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 text-xs text-slate-400 truncate">
                    Signed in as <br />
                    <span className="text-white font-medium">{sessionEmail}</span>
                  </div>
                  <Link
                    to="/admin/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/5 hover:text-[#27e2c4]"
                  >
                    Agency & Site Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`${glassCard} ${className}`}
      style={{ ...glassCardStyle, ...style }}
    >
      {children}
    </div>
  );
}

export { X as CloseIcon };
