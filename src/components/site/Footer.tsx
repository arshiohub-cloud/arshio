import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail, Phone, MapPin, Linkedin, Instagram, Youtube, Globe } from "lucide-react";
import { NAV_LINKS, SOCIAL_LINKS } from "@/data/navigation";
import { SERVICES } from "@/data/services";
import { Reveal } from "./Reveal";

const iconMap: Record<string, typeof Globe> = {
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  globe: Globe,
};

/**
 * Footer — Multi-column glass footer with newsletter, links, and giant wordmark.
 */
export function Footer() {
  return (
    <footer className="relative mt-0 overflow-hidden">
      {/* Top divider */}
      <div className="section-divider" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 pt-20 pb-12">
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Col 1: Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="inline-block">
                <span className="text-2xl font-extrabold font-display text-white">
                  arshio
                </span>
              </Link>
              <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-xs">
                Design-led digital products that scale your business. Senior talent,
                transparent pricing, real results.
              </p>
              {/* Newsletter */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-6 flex gap-2"
              >
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#2DE0C6]/40 focus:ring-1 focus:ring-[#2DE0C6]/20 transition-colors"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#2DE0C6] px-3 py-2 text-sm font-semibold text-[#050A18] hover:bg-[#2DE0C6]/90 transition-colors"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/50 hover:text-[#2DE0C6] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Services */}
            <div>
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
                Services
              </h3>
              <ul className="space-y-2.5">
                {SERVICES.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`/services`}
                      className="text-sm text-white/50 hover:text-[#2DE0C6] transition-colors"
                    >
                      {s.title.split(" & ")[0]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div>
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-white/50">
                  <Mail className="h-4 w-4 mt-0.5 text-[#2DE0C6]/60 shrink-0" />
                  <a href="mailto:hello@arshio.agency" className="hover:text-[#2DE0C6] transition-colors">
                    hello@arshio.agency
                  </a>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/50">
                  <Phone className="h-4 w-4 mt-0.5 text-[#2DE0C6]/60 shrink-0" />
                  <a href="tel:+8801700000000" className="hover:text-[#2DE0C6] transition-colors">
                    +880 1700-000-000
                  </a>
                </li>
                <li className="flex items-start gap-2 text-sm text-white/50">
                  <MapPin className="h-4 w-4 mt-0.5 text-[#2DE0C6]/60 shrink-0" />
                  <span>Dhaka, Bangladesh</span>
                </li>
              </ul>
              {/* Social Icons */}
              <div className="mt-5 flex gap-3">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = iconMap[social.icon] || Globe;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/5 border border-white/8 text-white/50 hover:text-[#2DE0C6] hover:border-[#2DE0C6]/30 transition-all"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Arshio Digital Agency. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-white/30">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Giant decorative wordmark */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none"
        aria-hidden="true"
      >
        <span
          className="block text-[12vw] sm:text-[10vw] font-extrabold font-display uppercase tracking-[0.15em] text-white/[0.02] leading-none whitespace-nowrap"
        >
          ARSHIO
        </span>
      </div>
    </footer>
  );
}
