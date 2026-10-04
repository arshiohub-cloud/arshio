import { useState } from "react";
import { ArrowRight, CalendarCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function AuditBooking() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    challenge: "",
    time: "Flexible",
    website: "", // honeypot
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot: bots fill the hidden field
    if (form.website.trim()) {
      toast.success("Request received — we'll confirm within 24 hours.");
      setForm({ name: "", email: "", company: "", challenge: "", time: "Flexible", website: "" });
      return;
    }
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Please add your name and email.");
      return;
    }
    const message = [
      `Preferred time: ${form.time}`,
      form.challenge.trim() ? `Challenge: ${form.challenge.trim()}` : null,
    ].filter(Boolean).join("\n") || "Requested a free 30-minute AI audit.";

    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || null,
      message,
      type: "audit",
      source_page: typeof window !== "undefined" ? window.location.pathname : "/contact",
    });
    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast.success("Request received — we'll confirm within 24 hours.");
    setForm({ name: "", email: "", company: "", challenge: "", time: "Flexible", website: "" });
  };


  return (
    <section className="py-20 border-b border-white/5" style={{ background: "#000" }}>
      <div className="max-w-5xl mx-auto px-4">
        <div
          className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #312e81 0%, #4338ca 45%, #6366f1 100%)",
            border: "1px solid rgba(167,139,250,0.35)",
            boxShadow: "0 20px 60px -20px rgba(99,102,241,0.45)",
          }}
        >
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(34,211,238,0.35), transparent 70%)" }}
          />

          <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-cyan-200 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-5">
                <CalendarCheck className="w-3.5 h-3.5" /> Free Consultation
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Book a Free 30-Minute AI Audit
              </h2>
              <p className="mt-4 text-white/85 leading-relaxed text-base max-w-lg">
                No commitment. We review your workflows, identify your top AI opportunities,
                and deliver a quick-win roadmap on the call.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {[
                  "✓ No contract required",
                  "✓ Response within 24 hours",
                  "✓ Dedicated AI specialist",
                ].map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-white/12 border border-white/20 text-white rounded-full px-3 py-1.5 backdrop-blur"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-3 bg-black/30 border border-white/15 rounded-xl p-5 backdrop-blur">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input placeholder="Name" value={form.name} onChange={update("name")} required />
                <Input type="email" placeholder="Email" value={form.email} onChange={update("email")} required />
              </div>
              <Input placeholder="Company" value={form.company} onChange={update("company")} />
              {/* Honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.website}
                onChange={update("website")}
                className="hidden"
              />

              <textarea
                placeholder="What's your biggest workflow challenge?"
                value={form.challenge}
                onChange={update("challenge")}
                rows={3}
                className="w-full text-sm rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/55 px-3 py-2.5 focus:outline-none focus:border-cyan-300/70 focus:bg-white/15 transition"
              />
              <select
                value={form.time}
                onChange={update("time")}
                className="w-full text-sm rounded-lg bg-white/10 border border-white/20 text-white px-3 py-2.5 focus:outline-none focus:border-cyan-300/70 transition"
              >
                <option className="bg-[#0a0a0a]">Morning EST</option>
                <option className="bg-[#0a0a0a]">Afternoon EST</option>
                <option className="bg-[#0a0a0a]">Evening EST</option>
                <option className="bg-[#0a0a0a]">Flexible</option>
              </select>
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-indigo-700 font-semibold text-sm hover:bg-white/90 disabled:opacity-60 transition shadow-lg"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Book My Free AI Audit <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full text-sm rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/55 px-3 py-2.5 focus:outline-none focus:border-cyan-300/70 focus:bg-white/15 transition"
    />
  );
}
