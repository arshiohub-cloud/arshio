import { useState } from "react";
import { Check, Send, Sparkles } from "lucide-react";
import { useFadeIn } from "@/hooks/use-fade-in";
import { supabase } from "@/integrations/supabase/client";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section
      id="contact"
      className="relative py-24 bg-[#070d1e] border-b border-slate-800/80 overflow-hidden"
    >
      {/* Brand Ambient Glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(39,226,196,0.15), transparent 60%), radial-gradient(ellipse at 80% 60%, rgba(56,189,248,0.12), transparent 60%)",
        }}
      />

      <div
        ref={ref}
        className="fade-up relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Let's Work Together
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Ready to Start Your <br />
            <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">
              Next Big Project?
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-base leading-relaxed max-w-md">
            Schedule a free consultation call or send us your brief. We'll analyze your requirements and get back within 24 hours.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              "Guaranteed response within 24 hours",
              "Free initial consultation & cost estimate",
              "Direct access to Senior Creative Director & Engineers",
              "100% IP ownership & NDA security",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-slate-200 text-sm">
                <span className="w-5 h-5 rounded-full bg-[#27e2c4]/15 border border-[#27e2c4]/40 flex items-center justify-center shrink-0 p-0.5">
                  <Check className="w-3.5 h-3.5 text-[#27e2c4] stroke-[3]" />
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (submitting) return;
            setErrorMsg(null);
            const fd = new FormData(e.currentTarget);
            if (String(fd.get("website") || "").trim()) {
              setSent(true);
              (e.target as HTMLFormElement).reset();
              return;
            }
            setSubmitting(true);
            const first = String(fd.get("firstName") || "").trim();
            const last = String(fd.get("lastName") || "").trim();
            const email = String(fd.get("email") || "").trim();
            const phone = String(fd.get("phone") || "").trim();
            const message = String(fd.get("message") || "").trim();
            const source =
              typeof window !== "undefined"
                ? window.location.pathname
                : "/contact";
            const { error } = await supabase.from("leads").insert({
              name: `${first} ${last}`.trim() || "Anonymous",
              email,
              phone: phone || null,
              message,
              type: "contact",
              source_page: source,
            });
            setSubmitting(false);
            if (error) {
              setErrorMsg("Something went wrong. Please try again.");
              return;
            }
            setSent(true);
            (e.target as HTMLFormElement).reset();
          }}

          className="relative p-8 space-y-5 rounded-2xl bg-[#0b132b] border border-slate-800/80 shadow-2xl"
        >
          <div className="text-xl font-bold text-white mb-2">Send Us a Message</div>

          <div className="grid grid-cols-2 gap-4">
            <Input name="firstName" placeholder="First Name" />
            <Input name="lastName" placeholder="Last Name" />
          </div>
          <Input name="email" type="email" placeholder="Email Address" />
          <Input name="phone" placeholder="Phone Number (Optional)" required={false} />
          
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <textarea
            required
            name="message"
            rows={4}
            placeholder="Tell us about your project requirements or budget..."
            className="w-full bg-[#131f37] border border-slate-700/60 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-[#27e2c4] focus:ring-1 focus:ring-[#27e2c4] transition"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-950 bg-[#27e2c4] hover:bg-[#1fd6b9] py-3.5 rounded-xl shadow-lg shadow-[#27e2c4]/20 transition-all hover:scale-[1.01] disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Submit Inquiry"} <Send className="w-4 h-4" />
          </button>

          {sent && (
            <p className="text-sm font-semibold text-[#27e2c4] text-center pt-2">
              ✓ Thanks for reaching out! We will be in touch within 24 hours.
            </p>
          )}
          {errorMsg && (
            <p className="text-sm font-semibold text-red-400 text-center pt-2">{errorMsg}</p>
          )}
        </form>
      </div>
    </section>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      required
      {...props}
      className="w-full bg-[#131f37] border border-slate-700/60 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-[#27e2c4] focus:ring-1 focus:ring-[#27e2c4] transition"
    />
  );
}
