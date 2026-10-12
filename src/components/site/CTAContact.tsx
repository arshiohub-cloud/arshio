import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Send, CheckCircle, Loader2, MessageCircle } from "lucide-react";
import { Reveal } from "./Reveal";

const SERVICE_OPTIONS = [
  "UI/UX Design",
  "Web Development",
  "Mobile App",
  "Custom Software / ERP",
  "Video & Motion",
  "Digital Marketing",
  "Other",
];

const BUDGET_OPTIONS = [
  "< $2,000",
  "$2,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $30,000",
  "$30,000+",
  "Not sure yet",
];

type FormState = "idle" | "loading" | "success" | "error";

/**
 * CTAContact — Cinematic CTA banner with adjacent contact form.
 * Includes inline validation, loading/success states, and WhatsApp link.
 */
export function CTAContact() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    message: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid email";
    if (!formData.service) e.service = "Please select a service";
    if (!formData.message.trim()) e.message = "Tell us about your project";
    return e;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return; // bot trap

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setFormState("loading");

    // Simulate submission (replace with Supabase or API call)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFormState("success");
    } catch {
      setFormState("error");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <section className="relative py-24 sm:py-32 px-6 sm:px-8">
      <div className="section-divider mb-20" />

      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Cinematic CTA */}
          <Reveal className="lg:sticky lg:top-32">
            <div className="relative rounded-2xl p-8 sm:p-10 overflow-hidden">
              {/* Glowing gradient border */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(45,224,198,0.15), rgba(34,184,240,0.1), rgba(91,91,240,0.08))",
                  padding: "1px",
                }}
              />
              <div className="absolute inset-[1px] rounded-2xl bg-[#050A18]/95" />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight leading-[1.1] mb-5">
                  Let&apos;s build something{" "}
                  <span className="text-gradient-teal">remarkable.</span>
                </h2>
                <p className="text-base text-white/55 leading-relaxed mb-8 max-w-md">
                  Whether it&apos;s a full product build or a quick design sprint,
                  we&apos;re ready to talk. Average response time: under 24 hours.
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://wa.me/8801700000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-sm py-2.5 px-5"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Us
                  </a>
                </div>

                {/* Small proof points */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { label: "Avg. response", value: "< 24h" },
                    { label: "Free discovery call", value: "30 min" },
                    { label: "No commitment", value: "100%" },
                    { label: "NDA ready", value: "Day 1" },
                  ].map((p) => (
                    <div key={p.label} className="text-sm">
                      <span className="text-[#2DE0C6] font-bold font-display">{p.value}</span>
                      <span className="text-white/40 ml-2">{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: Contact Form */}
          <Reveal delay={0.15}>
            <div className="glass-card p-6 sm:p-8">
              {formState === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="h-12 w-12 text-[#2DE0C6] mx-auto mb-4" />
                  <h3 className="text-xl font-bold font-display text-white mb-2">
                    Message sent!
                  </h3>
                  <p className="text-sm text-white/50">
                    We&apos;ll get back to you within 24 hours. Check your inbox.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={(e) => handleChange("honeypot", e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={`w-full rounded-xl bg-white/5 border px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#2DE0C6]/20 focus:border-[#2DE0C6]/40 transition-all ${
                        errors.name ? "border-red-400/50" : "border-white/8"
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-1.5">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`w-full rounded-xl bg-white/5 border px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#2DE0C6]/20 focus:border-[#2DE0C6]/40 transition-all ${
                        errors.email ? "border-red-400/50" : "border-white/8"
                      }`}
                      placeholder="john@company.com"
                    />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>

                  {/* Service */}
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-white/60 mb-1.5">
                      Service Needed
                    </label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => handleChange("service", e.target.value)}
                      className={`w-full rounded-xl bg-white/5 border px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#2DE0C6]/20 focus:border-[#2DE0C6]/40 transition-all appearance-none ${
                        errors.service ? "border-red-400/50" : "border-white/8"
                      } ${!formData.service ? "text-white/25" : ""}`}
                    >
                      <option value="" disabled>Select a service</option>
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0b132b] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.service && <p className="text-xs text-red-400 mt-1">{errors.service}</p>}
                  </div>

                  {/* Budget */}
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-white/60 mb-1.5">
                      Budget Range <span className="text-white/30">(optional)</span>
                    </label>
                    <select
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => handleChange("budget", e.target.value)}
                      className="w-full rounded-xl bg-white/5 border border-white/8 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#2DE0C6]/20 focus:border-[#2DE0C6]/40 transition-all appearance-none"
                    >
                      <option value="" className="bg-[#0b132b] text-white/25">Select budget range</option>
                      {BUDGET_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0b132b] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/60 mb-1.5">
                      Project Details
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      rows={4}
                      className={`w-full rounded-xl bg-white/5 border px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#2DE0C6]/20 focus:border-[#2DE0C6]/40 transition-all resize-none ${
                        errors.message ? "border-red-400/50" : "border-white/8"
                      }`}
                      placeholder="Tell us about your project goals, timeline, and any specific requirements..."
                    />
                    {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={formState === "loading"}
                    className="btn-primary w-full justify-center text-base py-3.5"
                  >
                    {formState === "loading" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  {formState === "error" && (
                    <p className="text-xs text-red-400 text-center">
                      Something went wrong. Please try again or email us directly.
                    </p>
                  )}
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
