import { Mail, Phone, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function TopBar() {
  return (
    <div className="w-full bg-[#070d1e] border-b border-white/5 text-[11px] sm:text-[12px] text-slate-300 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
        {/* Left: Contact info */}
        <div className="hidden sm:flex items-center gap-6">
          <a
            href="mailto:contact@arshio.com"
            className="inline-flex items-center gap-2 hover:text-[#27e2c4] transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#27e2c4]" /> contact@arshio.com
          </a>
          <a
            href="tel:+8801700000000"
            className="inline-flex items-center gap-2 hover:text-[#27e2c4] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#27e2c4]" /> +880 1700-000000
          </a>
        </div>

        {/* Right / Center: Announcement Badge */}
        <div className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 text-center flex-wrap">
          <span className="inline-flex items-center gap-1 font-bold text-[#27e2c4]">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Q4 Project Slots Open:
          </span>
          <span className="text-slate-300 font-medium">Free Discovery Audit & Architecture Proposal</span>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1 font-bold text-[#27e2c4] hover:underline ml-1"
          >
            Book Now <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
