import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PROCESS_STEPS } from "@/data/process";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/**
 * ProcessTimeline — Horizontal 4-step timeline that animates
 * a progress line as the user scrolls. Compact single-sentence steps.
 */
export function ProcessTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.7], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 px-6 sm:px-8">
      <div className="section-divider mb-20" />

      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Our process"
          title="From idea to launch,"
          titleAccent="in weeks."
          subtitle="A proven 4-step methodology that keeps projects on time and on budget."
        />

        {/* Timeline container */}
        <div className="relative">
          {/* Progress line background */}
          <div className="hidden sm:block absolute top-6 left-0 right-0 h-[2px] bg-white/5" />
          {/* Animated progress line */}
          <motion.div
            className="hidden sm:block absolute top-6 left-0 h-[2px] bg-gradient-to-r from-[#2DE0C6] to-[#22B8F0]"
            style={{ width: lineWidth }}
          />

          {/* Steps grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.1}>
                <div className="relative pt-12 sm:pt-14">
                  {/* Step number dot */}
                  <div className="absolute top-0 sm:top-3 left-0 sm:left-1/2 sm:-translate-x-1/2">
                    <div className="h-6 w-6 rounded-full bg-[#050A18] border-2 border-[#2DE0C6]/40 flex items-center justify-center">
                      <span className="text-[10px] font-bold font-mono text-[#2DE0C6]">
                        {step.step}
                      </span>
                    </div>
                  </div>

                  {/* Timeline chip */}
                  <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-[#2DE0C6]/60 bg-[#2DE0C6]/8 px-2 py-0.5 rounded mb-3">
                    {step.timeline}
                  </span>

                  <h3 className="text-lg font-bold font-display text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* See full process link */}
        <Reveal className="mt-12 text-center">
          <Link
            to="/process"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2DE0C6]/70 hover:text-[#2DE0C6] transition-colors"
          >
            See our full process
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
