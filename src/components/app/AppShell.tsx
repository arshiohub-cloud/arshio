import { type ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, MessageSquare, Files, Settings, LogOut, Menu, X } from "lucide-react";
import logo from "@/assets/insightai-logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/messages", label: "Messages", icon: MessageSquare },
  { to: "/app/documents", label: "Documents", icon: Files },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside
        className={`${open ? "block" : "hidden"} lg:block fixed lg:static inset-y-0 left-0 z-40 w-64 bg-black/95 border-r border-white/10 p-4`}
      >
        <Link to="/" className="flex items-center gap-2 font-bold text-white pb-6 border-b border-white/10">
          <span className="w-8 h-8 rounded-md flex items-center justify-center overflow-hidden">
            <img src={logo.url} alt="InsightAI" className="w-8 h-8 object-contain" />
          </span>
          InsightAI
        </Link>
        <nav className="mt-6 space-y-1">
          {nav.map((n) => {
            const active = pathname === n.to || (n.to !== "/app" && pathname.startsWith(n.to));
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <n.icon className="w-4 h-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="text-xs text-white/50 truncate">{email}</div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white border border-white/10"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 lg:px-8 sticky top-0 bg-black/80 backdrop-blur-xl z-30">
          <button className="lg:hidden text-white" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
          <h1 className="text-lg font-semibold">{title}</h1>
          <div />
        </header>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
