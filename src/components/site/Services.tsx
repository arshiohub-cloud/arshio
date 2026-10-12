import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { SERVICES } from "@/data/services";
import { SectionHeader } from "./SectionHeader";
import { GlassCard } from "./GlassCard";
import { StaggerContainer, staggerItem } from "./Reveal";

/**
 * Services — Asymmetric bento grid with 2 large + 4 small cards.
 * Each card has unique deliverables and an animated icon.
 */
export function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32 px-6 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="What we do"
          title="End-to-end digital services,"
          titleAccent="one team."
          subtitle="From first sketch to final deploy. Every discipline under one roof, so nothing gets lost in translation."
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {SERVICES.map((service, i) => {
            const isLarge = i < 2;
            const Icon = service.Icon;

            return (
              <GlassCard
                key={service.slug}
                className={`group ${
                  isLarge ? "md:col-span-1 lg:row-span-1" : ""
                } ${i === 0 ? "lg:col-span-2" : ""} ${i === 1 ? "lg:col-span-1 lg:row-span-2" : ""}`}
                padding={isLarge ? "p-7 sm:p-8" : "p-6"}
              >
                <motion.div variants={staggerItem}>
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center h-12 w-12 rounded-xl mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${service.accent}20, ${service.accent}08)`,
                      border: `1px solid ${service.accent}25`,
                    }}
                  >
                    <Icon
                      className="h-5 w-5 transition-colors"
                      style={{ color: service.accent }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-2 tracking-tight">
                    {service.title}
                  </h3>

                  {/* One-line outcome */}
                  <p className="text-sm text-white/55 leading-relaxed mb-4">
                    {service.desc}
                  </p>

                  {/* Deliverables (show 3 max for small cards) */}
                  <ul className="space-y-1.5 mb-5">
                    {service.bullets.slice(0, isLarge ? 4 : 3).map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-white/45">
                        <span
                          className="mt-1.5 h-1 w-1 rounded-full shrink-0"
                          style={{ background: service.accent }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors group/link"
                    style={{ color: `${service.accent}cc` }}
                  >
                    Learn more
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                </motion.div>
              </GlassCard>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
