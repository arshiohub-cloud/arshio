import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calculator } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

const SERVICE_CHIPS = [
  { label: "UI/UX Design", min: 2000, max: 5000 },
  { label: "Web App", min: 4000, max: 15000 },
  { label: "Mobile App", min: 5000, max: 20000 },
  { label: "Video & Motion", min: 1500, max: 4000 },
  { label: "Digital Marketing", min: 1000, max: 3000 },
  { label: "Custom Software", min: 8000, max: 30000 },
];

/**
 * EstimatorTeaser — Compact interactive teaser for the cost estimator.
 * Shows service chips + animated price range preview.
 * Deep-links to /pricing#estimator for the full calculator.
 */
export function EstimatorTeaser() {
  const [selected, setSelected] = useState<Set<number>>(new Set([0, 1]));

  const toggleChip = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const totalMin = Array.from(selected).reduce(
    (sum, i) => sum + SERVICE_CHIPS[i].min,
    0
  );
  const totalMax = Array.from(selected).reduce(
    (sum, i) => sum + SERVICE_CHIPS[i].max,
    0
  );

  return (
    <section className="relative py-24 sm:py-32 px-6 sm:px-8">
      <div className="section-divider mb-20" />

      <div className="mx-auto max-w-3xl">
        <SectionHeader
          badge="Quick estimate"
          title="What's your project"
          titleAccent="going to cost?"
          subtitle="Select the services you need for an instant ballpark range. For a detailed quote, use our full estimator."
        />

        {/* Service chips */}
        <Reveal>
          <div className="flex flex-wrap gap-2.5 justify-center mb-10">
            {SERVICE_CHIPS.map((chip, i) => (
              <button
                key={chip.label}
                onClick={() => toggleChip(i)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selected.has(i)
                    ? "bg-[#2DE0C6]/12 text-[#2DE0C6] border border-[#2DE0C6]/30 shadow-[0_0_20px_rgba(45,224,198,0.1)]"
                    : "bg-white/5 text-white/50 border border-white/8 hover:bg-white/8 hover:text-white/70"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Animated price range */}
        <Reveal>
          <div className="glass-card p-6 sm:p-8 text-center">
            <p className="text-xs font-mono uppercase tracking-wider text-white/30 mb-3">
              Estimated investment range
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${totalMin}-${totalMax}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-3xl sm:text-4xl font-bold font-display"
              >
                {selected.size === 0 ? (
                  <span className="text-white/30">Select services above</span>
                ) : (
                  <>
                    <span className="text-white">${totalMin.toLocaleString()}</span>
                    <span className="text-white/30 mx-2">&mdash;</span>
                    <span className="text-[#2DE0C6]">${totalMax.toLocaleString()}</span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6">
              <Link
                to="/pricing"
                className="btn-primary text-sm py-3 px-6"
              >
                <Calculator className="h-4 w-4" />
                Get Detailed Estimate
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
