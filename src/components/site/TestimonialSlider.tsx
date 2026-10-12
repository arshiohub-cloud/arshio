import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonials";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/**
 * TestimonialSlider — Large single-quote auto-advancing slider.
 * Pausable with avatar, name, role, company, and result metric.
 */
export function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  const testimonial = TESTIMONIALS[current];

  return (
    <section
      className="relative py-24 sm:py-32 px-6 sm:px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="section-divider mb-20" />

      <div className="mx-auto max-w-4xl">
        <SectionHeader
          badge="Testimonials"
          title="What our clients say"
        />

        {/* Quote */}
        <div className="relative min-h-[280px] sm:min-h-[240px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <Quote className="h-8 w-8 text-[#2DE0C6]/20 mx-auto mb-6" />

              <blockquote className="text-lg sm:text-xl lg:text-2xl text-white/80 leading-relaxed font-display font-medium max-w-3xl mx-auto">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="mt-8 flex flex-col items-center gap-3">
                {/* Avatar placeholder */}
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#2DE0C6]/20 to-[#22B8F0]/20 flex items-center justify-center text-lg font-bold text-[#2DE0C6] font-display">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-white/40">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>

                {/* Metric chip */}
                <div className="inline-flex items-center gap-2 rounded-full bg-[#2DE0C6]/8 border border-[#2DE0C6]/15 px-4 py-1.5 mt-2">
                  <span className="text-sm font-bold text-[#2DE0C6]">{testimonial.metric.value}</span>
                  <span className="text-xs text-white/40">{testimonial.metric.label}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white/5 border border-white/8 text-white/50 hover:text-[#2DE0C6] hover:border-[#2DE0C6]/30 transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-[#2DE0C6]"
                    : "w-2 bg-white/15 hover:bg-white/25"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white/5 border border-white/8 text-white/50 hover:text-[#2DE0C6] hover:border-[#2DE0C6]/30 transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
