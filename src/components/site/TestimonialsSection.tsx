import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";

type TestimonialItem = {
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

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    name: "Marcus Vance",
    role: "VP of Product",
    company: "Nexus Analytics",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    content: "Arshio completely transformed our web app UI/UX. The new design increased our trial conversion rate by 140% within 3 weeks of launching. They operate at Silicon Valley standards.",
    rating: 5,
    highlight: "+140% Trial Conversions",
    service: "UI/UX & Web Dev",
  },
  {
    id: "2",
    name: "Elena Rostova",
    role: "Head of Growth",
    company: "HyperGlow Brands",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    content: "Their video editing team is incredible. The motion reels they edited for our Meta and TikTok campaigns generated over 4.2 million views and delivered a 4.5x ROAS.",
    rating: 5,
    highlight: "4.2M Organic Views & 4.5x ROAS",
    service: "Video Editing & Ads",
  },
  {
    id: "3",
    name: "David Sterling",
    role: "Founder & CEO",
    company: "FitPulse App",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    content: "Arshio built our React Native mobile app from scratch. Flawless execution, sub-second API performance, and published to App Store in record time.",
    rating: 5,
    highlight: "85K App Downloads in 60 Days",
    service: "Mobile App Dev",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#0b132b] border-b border-slate-800/80 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#27e2c4]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Client Proof & Results
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Trusted by Growth Brands <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">Worldwide.</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            Don't just take our word for it. Here is what product leaders and founders say about working with Arshio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-[#070d1e] rounded-2xl border border-slate-800/80 p-8 shadow-xl flex flex-col justify-between hover:border-[#27e2c4]/40 transition-all duration-300 group"
            >
              <div>
                {/* Rating & Highlight badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#27e2c4] text-[#27e2c4]" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-[#27e2c4] bg-[#27e2c4]/10 px-2.5 py-1 rounded-md border border-[#27e2c4]/30">
                    {t.service}
                  </span>
                </div>

                {/* Content */}
                <p className="text-slate-200 text-sm leading-relaxed italic mb-6">
                  "{t.content}"
                </p>

                {/* Impact Metric Badge */}
                <div className="bg-[#131f37] rounded-xl p-3 border border-slate-800 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#27e2c4] shrink-0" />
                  <span className="text-xs font-extrabold text-white">{t.highlight}</span>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#27e2c4]/40"
                />
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-[#27e2c4] transition-colors">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {t.role} · <strong className="text-slate-300">{t.company}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
