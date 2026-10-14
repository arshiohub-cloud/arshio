import { Star, ShieldCheck, CheckCircle2, Quote, Sparkles } from "lucide-react";

export type TestimonialItem = {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  highlight: string;
  service: string;
};

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    name: "Marcus Vance",
    role: "VP of Product",
    company: "Nexus Analytics",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    content: "Arshio completely transformed our web app UI/UX. The new workflow reduced onboarding drop-off from 62% to under 18%, and our trial-to-paid conversion rate jumped by 140% within 3 weeks of launch.",
    rating: 5,
    highlight: "+140% Trial-to-Paid Lift",
    service: "UI/UX & Web Dev",
  },
  {
    id: "2",
    name: "Elena Rostova",
    role: "Head of Growth",
    company: "HyperGlow Brands",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    content: "Their video and motion team operates on a completely different level. The creative reels they storyboarded and produced for our Meta and TikTok campaigns generated 4.2 million organic views with an extraordinary 4.5x ROAS.",
    rating: 5,
    highlight: "4.2M Views & 4.5x ROAS",
    service: "Video & Motion Reels",
  },
  {
    id: "3",
    name: "Sarah Mitchell",
    role: "Head of Operations",
    company: "Apex Global Supply",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    content: "We replaced a clunky legacy system with Arshio's custom ERP portal. Real-time warehouse synchronization and automated dispatch cut our daily administrative overhead by 68%.",
    rating: 5,
    highlight: "68% Operational Overhead Cut",
    service: "Custom ERP & Software",
  },
  {
    id: "4",
    name: "David Sterling",
    role: "Founder & CEO",
    company: "FitPulse App",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    content: "Arshio engineered our React Native mobile app from scratch. Sub-second API performance, butter-smooth 60fps animations, and published to both App Store and Play Store in 8 weeks flat.",
    rating: 5,
    highlight: "85K Downloads in 60 Days",
    service: "Mobile App Dev",
  },
  {
    id: "5",
    name: "Priya Sharma",
    role: "E-Commerce Director",
    company: "Aurelia London",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    content: "Our storefront TTFB dropped from 2.8s to 380ms after Arshio rebuilt our headless Shopify architecture. Mobile bounce rate plummeted and our checkout completion surged by +210%.",
    rating: 5,
    highlight: "+210% Checkout Completion",
    service: "Headless E-Commerce",
  },
  {
    id: "6",
    name: "Liam O'Connor",
    role: "Founder & CTO",
    company: "ScribeFlow AI",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    content: "The engineering speed and attention to micro-interactions blown us away. They shipped our full Next.js AI editor with real-time webhooks on schedule with zero breaking bugs.",
    rating: 5,
    highlight: "100/100 Core Web Vitals",
    service: "SaaS Full-Stack Dev",
  },
  {
    id: "7",
    name: "Dr. Julian Weiss",
    role: "Chief Medical Officer",
    company: "VitalSync Telehealth",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80",
    content: "Designing for clinical compliance and elderly patients is notoriously tough. Arshio delivered an intuitive, accessible portal that scored 98% in patient ease-of-use audits.",
    rating: 5,
    highlight: "98% Patient Accessibility Score",
    service: "UI/UX & Product Design",
  },
  {
    id: "8",
    name: "Tariq Al-Mansoor",
    role: "Managing Partner",
    company: "Kestrel Capital Group",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    content: "Arshio gave our private equity firm the institutional digital presence we needed. The bespoke client portal handles high-net-worth reporting seamlessly with bank-grade encryption.",
    rating: 5,
    highlight: "$45M+ Investor Capital Tracked",
    service: "FinTech Web Portal",
  },
  {
    id: "9",
    name: "Chloe Dupont",
    role: "Creative Director",
    company: "Lumière Paris",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    content: "Their aesthetic taste is rare. Most agencies either code well or design well. Arshio does both effortlessly. Our rebrand was featured on Awwwards within two weeks of launch.",
    rating: 5,
    highlight: "Awwwards Site of the Day Nominee",
    service: "Branding & 3D Motion",
  },
  {
    id: "10",
    name: "James Chen",
    role: "VP of Engineering",
    company: "Orbit Freight Tech",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    content: "Direct senior access from day one. No account manager telephone games. When our backend had complex websocket edge cases, their team resolved them within 24 hours.",
    rating: 5,
    highlight: "24-Hour Resolution SLA",
    service: "Full-Cycle Engineering",
  },
];

export function TestimonialsSection() {
  // Duplicate for continuous seamless infinite marquee loop
  const marqueeList = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-24 bg-transparent border-b border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[#27e2c4]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-3.5 h-3.5" /> Client Proof & Verified Outcomes
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Trusted by Growth Brands <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">Worldwide.</span>
        </h2>
        <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
          Over 50+ high-growth startups and established brands rely on Arshio for senior digital execution, high-retention products, and proven business ROI.
        </p>

        {/* Live Ratings Banner */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> 4.9 / 5.0 Average Client Score
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="text-[#27e2c4] bg-[#27e2c4]/10 px-3 py-1 rounded-full border border-[#27e2c4]/20 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 100% Verified Founder & Exec Reviews
          </span>
        </div>
      </div>

      {/* Infinite Smooth Marquee Showcase */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Soft Edge Fade Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-40 bg-gradient-to-r from-[#070d1e] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-40 bg-gradient-to-l from-[#070d1e] to-transparent z-20 pointer-events-none" />

        {/* Marquee Track with CSS Pause on Hover */}
        <div className="flex animate-marquee hover:[animation-play-state:paused] gap-6 px-4">
          {marqueeList.map((t, idx) => (
            <div
              key={`${t.id}-${idx}`}
              className="w-[340px] sm:w-[420px] shrink-0 bg-[#0b132b]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 sm:p-7 shadow-xl flex flex-col justify-between hover:border-[#27e2c4]/50 hover:shadow-[0_0_30px_rgba(39,226,196,0.15)] transition-all duration-300 group"
            >
              <div>
                {/* Header: Rating & Service Pill */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#27e2c4] text-[#27e2c4]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold font-mono text-[#27e2c4] bg-[#27e2c4]/10 px-2.5 py-0.5 rounded-full border border-[#27e2c4]/30">
                    {t.service}
                  </span>
                </div>

                {/* Quote Content */}
                <p className="text-slate-300 text-sm leading-relaxed mb-5 group-hover:text-white transition-colors">
                  &ldquo;{t.content}&rdquo;
                </p>

                {/* Verified Metric Pill */}
                <div className="bg-[#131f37]/90 rounded-xl px-3 py-2 border border-slate-800 mb-5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#27e2c4] shrink-0" />
                  <span className="text-xs font-bold text-white font-mono">{t.highlight}</span>
                </div>
              </div>

              {/* Author Profile Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#27e2c4]/40"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white group-hover:text-[#27e2c4] transition-colors truncate">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {t.role} · <strong className="text-slate-300 font-semibold">{t.company}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-xs font-mono text-slate-500">
        Hover over any client story to pause and inspect metrics.
      </div>
    </section>
  );
}
