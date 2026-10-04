import { Linkedin, Facebook, MessageCircle, Lock, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-[#070d1e] border-t border-slate-800/80 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-10">
        <div>
          <Link to="/" className="inline-block mb-4">
            <img src="/arshio-logo.png" alt="Arshio" className="h-11 sm:h-12 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(39,226,196,0.2)]" />
          </Link>
          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            Full-service digital agency specializing in UI/UX Design, Motion Reels, Web & Mobile App Development, and Performance Marketing.
          </p>
          <div className="flex items-center gap-3 mt-6">
            {[Linkedin, Facebook, MessageCircle].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-xl border border-slate-800 bg-[#0b132b] flex items-center justify-center text-slate-400 hover:text-[#27e2c4] hover:border-[#27e2c4]/40 hover:bg-[#131f37] transition-all"
              >
                <Icon className="w-4.5 h-4.5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-[#27e2c4] font-extrabold mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm font-medium text-slate-400">
            <li><Link to="/services" className="hover:text-[#27e2c4] transition-colors">Our Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-[#27e2c4] transition-colors">Selected Portfolio</Link></li>
            <li><Link to="/pricing" className="hover:text-[#27e2c4] transition-colors">Pricing & Packages</Link></li>
            <li><Link to="/estimator" className="hover:text-[#27e2c4] transition-colors">Cost Estimator</Link></li>
            <li><Link to="/process" className="hover:text-[#27e2c4] transition-colors">Working Process</Link></li>
            <li><Link to="/about" className="hover:text-[#27e2c4] transition-colors">About Us</Link></li>
            <li><Link to="/careers" className="hover:text-[#27e2c4] transition-colors font-bold text-[#27e2c4]">Careers (We're Hiring!)</Link></li>
            <li><Link to="/contact" className="hover:text-[#27e2c4] transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-[#27e2c4] font-extrabold mb-4">Get In Touch</h4>
          <ul className="space-y-3.5 text-sm font-medium text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#27e2c4] shrink-0 mt-1" />
              <span>Dhaka, Bangladesh & USA</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#27e2c4] shrink-0" />
              <span>contact@arshio.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#27e2c4] shrink-0" />
              <span>+880 1700-000000</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-14 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>©2026 Arshio Digital Agency · All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-[#27e2c4] transition-colors font-medium">Get Free Quote</Link>
            <span>·</span>
            <Link to="/admin/login" className="inline-flex items-center gap-1 hover:text-[#27e2c4] transition-colors font-medium">
              <Lock className="w-3 h-3" /> Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
