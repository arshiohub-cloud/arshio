import { useState } from "react";
import { PROJECTS, ProjectCategory, ProjectItem } from "@/data/projects";
import { Play, ArrowRight, Sparkles, X, CheckCircle2, Layers, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";

const CATEGORIES: ProjectCategory[] = [
  "All",
  "Custom ERP & Software",
  "Web Development",
  "Mobile Apps",
  "UI/UX & Branding",
  "Video & Motion Reels",
  "Digital Growth Marketing",
];

export function PortfolioShowcase({ isPreview = false }: { isPreview?: boolean }) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeCaseStudy, setActiveCaseStudy] = useState<ProjectItem | null>(null);
  const [activeSliderIndex, setActiveSliderIndex] = useState<{ [key: string]: number }>({});

  const filteredProjects = PROJECTS.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  const displayProjects = isPreview ? filteredProjects.slice(0, 4) : filteredProjects;

  const handleSliderChange = (id: string, val: number) => {
    setActiveSliderIndex((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <section className="py-24 bg-[#0b132b]/60 border-b border-slate-800/80 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#27e2c4]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Proven Case Studies & Deliverables
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Real Work. <span className="bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] bg-clip-text text-transparent">Measurable Results.</span>
            </h2>
            <p className="mt-3 text-slate-300 max-w-xl text-base leading-relaxed">
              Explore how we engineer custom ERP software, high-converting Next.js web applications, mobile apps, viral video reels, and ROI-driven marketing campaigns.
            </p>
          </div>

          {!isPreview && (
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-950 bg-[#27e2c4] hover:bg-[#1fd6b9] px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-[#27e2c4]/20 hover:scale-105"
            >
              Start Your Project <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#27e2c4] text-slate-950 shadow-lg shadow-[#27e2c4]/25 scale-105"
                  : "bg-[#070d1e] text-slate-300 hover:text-white border border-slate-800 hover:border-[#27e2c4]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayProjects.map((item) => {
            const sliderVal = activeSliderIndex[item.id] ?? 50;

            return (
              <div
                key={item.id}
                className="group relative bg-[#070d1e]/90 backdrop-blur-2xl rounded-3xl border border-slate-800/80 overflow-hidden hover:border-[#27e2c4]/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                {/* Media Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#131f37]">
                  {/* Interactive Before / After Slider if provided */}
                  {item.beforeImage && item.afterImage ? (
                    <div className="relative w-full h-full select-none overflow-hidden">
                      {/* After Image */}
                      <img
                        src={item.afterImage}
                        alt="After Redesign"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Before Image clipped */}
                      <div
                        className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-[#27e2c4] shadow-xl"
                        style={{ width: `${sliderVal}%` }}
                      >
                        <img
                          src={item.beforeImage}
                          alt="Before Redesign"
                          className="absolute inset-0 w-full h-full object-cover max-w-none"
                          style={{ width: "100%", height: "100%" }}
                        />
                        <span className="absolute top-3 left-3 bg-[#070d1e]/90 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-rose-400 uppercase tracking-widest border border-rose-500/30">
                          Before
                        </span>
                      </div>
                      <span className="absolute top-3 right-3 bg-[#070d1e]/90 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-[#27e2c4] uppercase tracking-widest border border-[#27e2c4]/30">
                        After Redesign
                      </span>

                      {/* Slider Input */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderVal}
                        onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-10 w-8 h-8 rounded-full bg-[#27e2c4] text-slate-950 font-extrabold flex items-center justify-center shadow-lg -ml-4"
                        style={{ left: `${sliderVal}%` }}
                      >
                        ↔
                      </div>
                    </div>
                  ) : (
                    /* Standard Image / Video Showcase */
                    <>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070d1e] via-[#070d1e]/30 to-transparent opacity-80" />

                      {/* Video Modal Trigger */}
                      {item.videoUrl && (
                        <button
                          onClick={() => setSelectedVideo(item.videoUrl!)}
                          className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        >
                          <div className="w-14 h-14 rounded-full bg-[#27e2c4] text-slate-950 flex items-center justify-center shadow-lg shadow-[#27e2c4]/50 backdrop-blur-md">
                            <Play className="w-6 h-6 fill-slate-950 ml-1" />
                          </div>
                        </button>
                      )}
                    </>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#070d1e]/85 backdrop-blur-md text-[#27e2c4] border border-[#27e2c4]/30 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Client: <span className="text-slate-200">{item.client}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-[#27e2c4] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Metrics & Action */}
                  <div className="pt-5 border-t border-slate-800/80 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-5">
                        {item.metrics.map((m, idx) => (
                          <div key={idx} className="flex flex-col">
                            <span className="text-[11px] text-slate-400 font-medium">{m.label}</span>
                            <span className="text-lg font-black text-[#27e2c4]">{m.value}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setActiveCaseStudy(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#27e2c4] hover:text-[#5eead4] hover:underline"
                      >
                        View Case Study Breakdown <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] font-mono bg-[#131f37] text-slate-300 px-2.5 py-1 rounded-md border border-slate-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button if Preview */}
        {isPreview && (
          <div className="mt-14 text-center">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-base font-bold text-slate-950 bg-[#27e2c4] hover:bg-[#1fd6b9] px-8 py-3.5 rounded-xl shadow-lg shadow-[#27e2c4]/20 transition-all hover:scale-105"
            >
              Explore All Case Studies <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>

      {/* Case Study Detail Modal */}
      {activeCaseStudy && (
        <div className="fixed inset-0 z-50 bg-[#070d1e]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#0b132b] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-8 p-6 sm:p-10 space-y-6">
            <button
              onClick={() => setActiveCaseStudy(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white bg-[#131f37] p-2.5 rounded-full border border-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#27e2c4] bg-[#27e2c4]/10 px-3 py-1 rounded-md border border-[#27e2c4]/30">
                {activeCaseStudy.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {activeCaseStudy.title}
              </h3>
              <p className="text-sm text-slate-400">Client: {activeCaseStudy.client}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#070d1e] border border-slate-800">
              {activeCaseStudy.metrics.map((m, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-xs text-slate-400">{m.label}</span>
                  <span className="text-xl font-extrabold text-[#27e2c4]">{m.value}</span>
                </div>
              ))}
              <div className="flex flex-col">
                <span className="text-xs text-slate-400">Tech Stack</span>
                <span className="text-xs font-mono text-slate-200 mt-1">{activeCaseStudy.tags.join(", ")}</span>
              </div>
            </div>

            {activeCaseStudy.fullChallenge && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#27e2c4] uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4" /> The Challenge:
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">{activeCaseStudy.fullChallenge}</p>
              </div>
            )}

            {activeCaseStudy.fullSolution && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#27e2c4] uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Our Solution & Engineering:
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">{activeCaseStudy.fullSolution}</p>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between gap-4 border-t border-slate-800">
              <button
                onClick={() => setActiveCaseStudy(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#131f37]"
              >
                Close
              </button>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-[#27e2c4] hover:bg-[#1fd6b9]"
              >
                Build Similar Solution <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-[#070d1e]/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#0b132b] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 text-white bg-[#131f37] p-2.5 rounded-full hover:bg-slate-800 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full">
              <video src={selectedVideo} controls autoPlay className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
