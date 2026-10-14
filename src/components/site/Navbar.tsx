import { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { label: "Services", to: "/services" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Our Process", to: "/process" },
  { label: "Pricing", to: "/pricing" },
  { label: "About Us", to: "/about" },
];

export function Navbar() {
  const [mobile, setMobile] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Prevent background scroll when mobile menu is active
  useEffect(() => {
    if (mobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#070d1e]/95 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Official Arshio Brand Logo — Prominent & Sharp */}
        <Link to="/" className="flex items-center group py-2">
          <img
            src="/arshio-logo.png"
            alt="Arshio Creative Agency"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_0_12px_rgba(39,226,196,0.2)]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#0b132b]/90 p-1.5 rounded-full border border-slate-800 shadow-inner">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white rounded-full transition-all duration-200"
              activeProps={{
                className: "px-4 py-2 text-sm font-bold text-[#27e2c4] bg-[#131f37] border border-[#27e2c4]/40 shadow-sm",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#27e2c4] hover:text-white px-3.5 py-2.5 rounded-xl border border-[#27e2c4]/30 bg-[#27e2c4]/10 hover:bg-[#27e2c4]/20 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" /> Pricing & Tiers
          </Link>
          {signedIn ? (
            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-200 hover:text-white px-4 py-2.5 rounded-xl border border-slate-800 bg-[#0b132b] hover:bg-[#131f37] transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-[#27e2c4]" /> Client Portal
            </Link>
          ) : (
            <Link
              to="/auth"
              className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
          )}
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-extrabold text-slate-950 bg-[#27e2c4] hover:bg-[#1fd6b9] px-5 py-2.5 rounded-xl shadow-lg shadow-[#27e2c4]/25 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Start Project <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2.5 text-slate-300 hover:text-white rounded-xl bg-[#0b132b] border border-slate-800 cursor-pointer"
          onClick={() => setMobile(!mobile)}
          aria-label={mobile ? "Close Menu" : "Open Menu"}
        >
          {mobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu with max-height and scrolling */}
      {mobile && (
        <div className="lg:hidden border-t border-slate-800 bg-[#070d1e]/98 backdrop-blur-2xl px-5 sm:px-6 py-5 space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setMobile(false)}
              className="block text-base font-semibold text-slate-200 hover:text-[#27e2c4] py-3 border-b border-slate-800/60 transition-colors"
              activeProps={{ className: "text-[#27e2c4] font-bold" }}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 space-y-2.5">
            <Link
              to="/pricing"
              onClick={() => setMobile(false)}
              className="flex items-center justify-center gap-2 text-sm font-bold text-[#27e2c4] py-3 rounded-xl border border-[#27e2c4]/30 bg-[#27e2c4]/10"
            >
              <Sparkles className="w-4 h-4" /> Pricing & Scope Guide
            </Link>
            <Link
              to={signedIn ? "/app" : "/auth"}
              onClick={() => setMobile(false)}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-white py-3 rounded-xl border border-slate-800 bg-[#0b132b]"
            >
              {signedIn ? "Client Portal" : "Sign In to Client Portal"}
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobile(false)}
              className="flex items-center justify-center gap-2 text-sm font-extrabold text-slate-950 bg-[#27e2c4] py-3.5 rounded-xl shadow-lg"
            >
              Start Project <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
