import { Shield, Users, DollarSign, Eye } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { GlassCard } from "./GlassCard";
import { StaggerContainer, staggerItem } from "./Reveal";
import { motion } from "framer-motion";

const PROOF_POINTS = [
  {
    icon: Shield,
    title: "100% IP Ownership",
    desc: "Every line of code, every design file — yours from day one. No lock-in, no strings.",
  },
  {
    icon: Users,
    title: "Direct Senior Access",
    desc: "Talk to the people actually doing the work. No account managers in between.",
  },
  {
    icon: DollarSign,
    title: "Fixed Transparent Pricing",
    desc: "Know your investment upfront. No surprise invoices, no scope-creep billing.",
  },
  {
    icon: Eye,
    title: "Weekly Live Previews",
    desc: "See real progress every week. Click, test, and give feedback on working builds.",
  },
];

/**
 * WhyArshio — Split layout: big statement left, 4 compact proof points right.
 */
export function WhyArshio() {
  return (
    <section className="relative py-24 sm:py-32 px-6 sm:px-8">
      <div className="section-divider mb-20" />

      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Big Statement */}
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#2DE0C6] mb-4 block">
                Why Arshio
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight leading-[1.1]">
                Senior talent.
                <br />
                Direct access.
                <br />
                <span className="text-gradient-teal">Zero lock-in.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-base text-white/55 leading-relaxed max-w-md">
                We’re not a body shop or a faceless outsourcing factory. We’re a
                tight crew of senior designers and engineers who care deeply about
                craft and outcomes.
              </p>
            </Reveal>
          </div>

          {/* Right: Proof Points */}
          <StaggerContainer className="grid gap-4">
            {PROOF_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <GlassCard key={point.title} padding="p-5 sm:p-6">
                  <motion.div variants={staggerItem} className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#2DE0C6]/8 border border-[#2DE0C6]/15 shrink-0">
                      <Icon className="h-5 w-5 text-[#2DE0C6]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-display text-white mb-1">
                        {point.title}
                      </h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  </motion.div>
                </GlassCard>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
