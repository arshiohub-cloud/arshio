import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ContactForm } from "@/components/site/ContactForm";
import { AmbientBackground } from "@/components/site/AmbientBackground";
import { Sparkles, Mail, Phone, MapPin, MessageSquare, Clock, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Book a Free Discovery Call | Arshio Digital Agency" },
      { name: "description", content: "Get in touch with Arshio Digital Agency. Book a free 30-minute discovery call for Custom ERP, Web Development, Mobile Apps, UI/UX, and Digital Marketing." },
      { property: "og:title", content: "Contact Arshio Digital Agency" },
      { property: "og:description", content: "Let's build your next digital asset. Fast 24-hour response." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="relative min-h-screen bg-[#070d1e] text-white overflow-hidden">
      {/* Universal Floating Ambient Mesh Gradient Aurora */}
      <AmbientBackground />

      <div className="relative z-10">
        <TopBar />
        <Navbar />

        <main>
          {/* Page Hero */}
          <section className="relative py-20 md:py-28 bg-[#070d1e] border-b border-slate-800/80 overflow-hidden text-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" /> Fast 24-Hour Response Time
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Let's Build Something <br />
                <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">
                  Extraordinary Together.
                </span>
              </h1>
              <p className="mt-5 text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                Have a new project, custom ERP software inquiry, web redesign, or marketing campaign? Drop us a message or schedule a free 30-minute discovery call.
              </p>
            </div>
          </section>

          {/* Contact Details Cards */}
          <section className="py-12 bg-[#0b132b]/60 border-b border-slate-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-3 gap-6">
              <div className="bg-[#070d1e]/90 backdrop-blur-2xl rounded-2xl border border-slate-800/80 p-6 flex items-start gap-4 hover:border-[#27e2c4]/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4] shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Email Us Directly</div>
                  <div className="text-base font-bold text-white mt-1">hello@arshio.com</div>
                  <div className="text-xs text-[#27e2c4] mt-0.5">Response within 4 hours</div>
                </div>
              </div>

              <div className="bg-[#070d1e]/90 backdrop-blur-2xl rounded-2xl border border-slate-800/80 p-6 flex items-start gap-4 hover:border-[#27e2c4]/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4] shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Call or WhatsApp</div>
                  <div className="text-base font-bold text-white mt-1">+880 1700-000000</div>
                  <div className="text-xs text-[#27e2c4] mt-0.5">Mon–Fri, 9am – 8pm</div>
                </div>
              </div>

              <div className="bg-[#070d1e]/90 backdrop-blur-2xl rounded-2xl border border-slate-800/80 p-6 flex items-start gap-4 hover:border-[#27e2c4]/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Global Locations</div>
                  <div className="text-base font-bold text-white mt-1">Dhaka & New York</div>
                  <div className="text-xs text-slate-400 mt-0.5">Remote & In-Person Strategy</div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Contact Form Component */}
          <ContactForm />
        </main>

        <Footer />
      </div>
    </div>
  );
}
