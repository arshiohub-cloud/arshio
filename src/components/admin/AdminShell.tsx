import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Users,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  ChevronDown,
  X,
  Briefcase,
  UserCircle,
} from "lucide-react";
import logo from "@/assets/insightai-logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Home },
  { to: "/admin/leads", label: "Leads", icon: Users },
  { to: "/admin/engagements", label: "Projects", icon: Briefcase },
  { to: "/admin/users", label: "Users", icon: UserCircle },
  { to: "/admin/email", label: "Email", icon: Mail },
];

const footerNav = [
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export const glassCard = "rounded-xl border border-white/10 backdrop-blur-xl";
export const glassCardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  borderColor: "rgba(255,255,255,0.08)",
  borderWidth: "0.5px",
  backdropFilter: "blur(12px)",
};

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [status, setStatus] = useState<"checking" | "ok" | "denied">(
    "checking",
  );
  const [email, setEmail] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      const session = data.session;
      if (!session) {
        navigate({ to: "/admin/login", replace: true });
        return;
      }
      const { data: isAdmin, error } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });
      if (!alive) return;
      if (error || !isAdmin) {
        await supabase.auth.signOut();
        navigate({ to: "/admin/login", replace: true });
        return;
      }
      setEmail(session.user.email ?? null);
      setStatus("ok");
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/admin/login", replace: true });
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  if (status !== "ok") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#080B14", color: "#fff" }}
      >
        <div className="text-white/60 text-sm">Checking session…</div>
      </div>
    );
  }

  const isActive = (to: string) => pathname === to;

  return (
    <div
      className="min-h-screen flex text-white"
      style={{
        background: "#080B14",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[240px] border-r border-white/5 flex flex-col transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ background: "#080B14" }}
      >
        <div className="h-16 px-5 flex items-center gap-2 border-b border-white/5">
          <span className="w-8 h-8 rounded-md flex items-center justify-center overflow-hidden bg-white/5">
            <img src={logo.url} alt="InsightAI" className="w-7 h-7 object-contain" />
          </span>
          <span className="font-bold">InsightAI</span>
          <span
            className="ml-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(108,99,255,0.15)",
              color: "#00D4FF",
              border: "0.5px solid rgba(0,212,255,0.3)",
            }}
          >
            Admin
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {nav.map((item) => (
            <SidebarLink
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={isActive(item.to)}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
          <div className="my-3 border-t border-white/5" />
          {footerNav.map((item) => (
            <SidebarLink
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={isActive(item.to)}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </nav>

        <div className="p-4 border-t border-white/5 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{ background: "linear-gradient(135deg,#6C63FF,#00D4FF)" }}
          >
            {(email ?? "A").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">
              {email ?? "Admin"}
            </div>
            <div className="text-[11px] text-white/50 truncate">
              Administrator
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header
          className="h-16 px-4 lg:px-6 border-b border-white/5 flex items-center gap-3 sticky top-0 z-20"
          style={{
            background: "rgba(8,11,20,0.85)",
            backdropFilter: "blur(12px)",
          }}
        >
          <button
            className="lg:hidden text-white/80"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-base font-semibold text-white/90 truncate">
            {title}
          </h1>

          <div className="flex-1" />

          <a
            href="https://insightaiconsultancy.net"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-3 py-2 rounded-md border border-white/10 hover:border-white/20 transition"
          >
            View live site <ExternalLink className="w-3 h-3" />
          </a>

          <div className="relative">
            <button
              onClick={() => setUserMenu((v) => !v)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md hover:bg-white/5"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{
                  background: "linear-gradient(135deg,#6C63FF,#00D4FF)",
                }}
              >
                {(email ?? "A").charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="w-4 h-4 text-white/60" />
            </button>
            {userMenu && (
              <div
                className={`absolute right-0 mt-2 w-44 py-1 ${glassCard}`}
                style={{
                  ...glassCardStyle,
                  background: "rgba(15,18,30,0.95)",
                }}
                onMouseLeave={() => setUserMenu(false)}
              >
                <Link
                  to="/admin/settings"
                  className="block px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
                >
                  Settings
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarLink({
  to,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      to={to as "/admin/dashboard"}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
        active
          ? "text-white"
          : "text-white/70 hover:text-white hover:bg-white/5"
      }`}
      style={
        active
          ? {
              background:
                "linear-gradient(90deg, rgba(108,99,255,0.18), rgba(0,212,255,0.06))",
              boxShadow: "inset 0 0 0 0.5px rgba(108,99,255,0.35)",
            }
          : undefined
      }
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
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
