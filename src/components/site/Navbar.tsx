import { useState, useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/data/navigation";

/**
 * Navbar — Floating glass nav that condenses on scroll.
 * Includes announcement bar, navigation links, and CTAs.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const router = useRouter();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement Bar */}
      <AnimatePresence>
        {announcementVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-[#2DE0C6]/10 via-[#22B8F0]/10 to-[#5B5BF0]/10 border-b border-white/5 overflow-hidden"
          >
            <div className="flex items-center justify-center gap-3 px-4 py-2 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1.5 text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2DE0C6] animate-pulse" />
                Q4 slots open — <Link to="/contact" className="text-[#2DE0C6] hover:underline font-medium">book a free discovery audit</Link>
              </span>
              <button
                onClick={() => setAnnouncementVisible(false)}
                className="ml-2 text-white/40 hover:text-white/70 transition-colors"
                aria-label="Dismiss announcement"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Nav */}
      <nav
        className={`mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all duration-500 ${
          scrolled
            ? "glass-nav-condensed shadow-lg shadow-black/20 mx-4 sm:mx-6 lg:mx-auto"
            : "glass-nav mx-4 sm:mx-6 lg:mx-auto"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" aria-label="Arshio home">
          <div className="relative">
            <span className="text-2xl sm:text-[28px] font-extrabold font-display tracking-tight text-white">
              arshio
            </span>
            <span className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-gradient-to-r from-[#2DE0C6] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "text-[#2DE0C6]"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-[#2DE0C6]/8 border border-[#2DE0C6]/20"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/pricing"
            className="text-sm font-medium text-white/60 hover:text-[#2DE0C6] transition-colors"
          >
            Get Instant Quote
          </Link>
          <Link
            to="/contact"
            className="btn-primary text-sm py-2 px-5"
          >
            Start a Project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg text-white/80 hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#050A18]/98 backdrop-blur-xl lg:hidden"
            style={{ top: 0 }}
          >
            <div className="flex flex-col items-center justify-center min-h-screen gap-2 px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-3xl font-bold font-display text-white/80 hover:text-[#2DE0C6] py-3 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-8"
              >
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary text-lg py-4 px-10"
                >
                  Start a Project
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
