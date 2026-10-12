import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PROJECTS, type ProjectCategory } from "@/data/projects";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";

const CATEGORIES: ProjectCategory[] = [
  "All",
  "Custom ERP & Software",
  "Web Development",
  "Mobile Apps",
  "UI/UX & Branding",
  "Video & Motion Reels",
  "Digital Growth Marketing",
];

/**
 * SelectedWork — Horizontal scroll-snap carousel of featured projects
 * with category filters, device mockups, and hover tilt effect.
 */
export function SelectedWork() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = PROJECTS.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  return (
    <section className="relative py-24 sm:py-32 px-6 sm:px-8">
      <div className="section-divider mb-20" />

      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="Selected work"
          title="Real projects,"
          titleAccent="real results."
          subtitle="Concept projects crafted to showcase our capabilities. Each represents the quality and thinking we bring to every engagement."
        />

        {/* Filter tabs */}
        <Reveal className="mb-10">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#2DE0C6]/15 text-[#2DE0C6] border border-[#2DE0C6]/25"
                    : "bg-white/5 text-white/50 border border-white/8 hover:bg-white/8 hover:text-white/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Scroll-snap carousel */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              className="snap-start shrink-0 w-[85vw] sm:w-[420px] lg:w-[480px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="glass-card p-0 overflow-hidden group h-full">
                {/* Browser mockup */}
                <div className="relative overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border-b border-white/5">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-400/50" />
                      <span className="h-2 w-2 rounded-full bg-yellow-400/50" />
                      <span className="h-2 w-2 rounded-full bg-green-400/50" />
                    </div>
                    <span className="text-[10px] font-mono text-white/20 ml-2 truncate">
                      {project.id}.arshio.dev
                    </span>
                  </div>
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050A18]/60 to-transparent" />

                    {/* Concept label */}
                    <span className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-wider bg-black/40 backdrop-blur-sm text-white/50 px-2 py-0.5 rounded">
                      Concept Project
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-white/30 mb-2">
                    {project.client}
                  </p>
                  <h3 className="text-base sm:text-lg font-bold font-display text-white leading-snug mb-3">
                    {project.title}
                  </h3>

                  {/* Metrics */}
                  <div className="flex gap-3 mb-4">
                    {project.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1"
                      >
                        <span className="text-sm font-bold text-[#2DE0C6]">{m.value}</span>
                        <span className="text-[10px] text-white/40">{m.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/portfolio"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2DE0C6]/80 hover:text-[#2DE0C6] transition-colors"
                  >
                    View case study
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <Reveal className="mt-10 text-center">
          <Link
            to="/portfolio"
            className="btn-ghost text-sm py-2.5 px-6"
          >
            View All Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
