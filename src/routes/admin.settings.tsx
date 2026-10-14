import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminShell, AdminCard } from "@/components/admin/AdminShell";
import { useSiteSettings, type SiteSettings } from "@/lib/cms-store";
import { usePortfolioProjects } from "@/lib/projects-store";
import { supabase } from "@/integrations/supabase/client";
import { type ProjectItem, type ProjectCategory } from "@/data/projects";
import {
  Save,
  CheckCircle2,
  Sliders,
  Building,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  KeyRound,
  Database,
  Globe,
  Plus,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Layers,
  Layout,
  RefreshCw,
  Search,
  Eye,
  FileText,
} from "lucide-react";

type SettingsTab = "cms" | "projects" | "contact" | "security" | "database";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "CMS & Projects Manager — Arshio Studio Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SettingsAndCMSPage,
});

const CATEGORIES: ProjectCategory[] = [
  "Custom ERP & Software",
  "Web Development",
  "Mobile Apps",
  "UI/UX & Branding",
  "Video & Motion Reels",
  "Digital Growth Marketing",
];

function SettingsAndCMSPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("cms");
  const [settings, saveSettings] = useSiteSettings();
  const [projects, { createProject, updateProject, deleteProject, resetToDefaults }] = usePortfolioProjects();

  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [savedNotice, setSavedNotice] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Project Modal State (Create or Edit)
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectFormData, setProjectFormData] = useState<Omit<ProjectItem, "id">>({
    title: "",
    client: "",
    category: "Custom ERP & Software",
    description: "",
    fullChallenge: "",
    fullSolution: "",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { label: "Performance Lag", value: "-65%" },
      { label: "Accuracy", value: "99.8%" },
    ],
    tags: ["Node.js", "PostgreSQL", "React"],
    featured: true,
  });

  // Password state
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwMsg, setPwMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pwSaving, setPwSaving] = useState(false);

  // Sync formData with settings when loaded
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleOpenAddProject = () => {
    setEditingProjectId(null);
    setProjectFormData({
      title: "",
      client: "",
      category: "Custom ERP & Software",
      description: "",
      fullChallenge: "",
      fullSolution: "",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      metrics: [
        { label: "Turnaround Time", value: "-50%" },
        { label: "Efficiency Boost", value: "2.4x" },
      ],
      tags: ["React", "TypeScript", "Tailwind"],
      featured: true,
    });
    setProjectModalOpen(true);
  };

  const handleOpenEditProject = (item: ProjectItem) => {
    setEditingProjectId(item.id);
    setProjectFormData({
      title: item.title,
      client: item.client,
      category: item.category,
      description: item.description,
      fullChallenge: item.fullChallenge || "",
      fullSolution: item.fullSolution || "",
      image: item.image,
      videoUrl: item.videoUrl,
      metrics: item.metrics?.length ? item.metrics : [{ label: "Impact", value: "+100%" }],
      tags: item.tags || [],
      featured: item.featured ?? true,
    });
    setProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectFormData.title || !projectFormData.client) {
      alert("Please provide a project title and client name.");
      return;
    }

    if (editingProjectId) {
      updateProject(editingProjectId, projectFormData);
    } else {
      createProject(projectFormData);
    }
    setProjectModalOpen(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}" from the public portfolio?`)) {
      deleteProject(id);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.length < 8) {
      setPwMsg({ kind: "err", text: "Password must be at least 8 characters long." });
      return;
    }
    if (pw !== pw2) {
      setPwMsg({ kind: "err", text: "Passwords do not match." });
      return;
    }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setPwSaving(false);
    if (error) {
      setPwMsg({ kind: "err", text: error.message });
    } else {
      setPw("");
      setPw2("");
      setPwMsg({ kind: "ok", text: "Admin password successfully updated." });
    }
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch =
      !projectSearch ||
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.client.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(projectSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <AdminShell title="CMS & Projects Suite">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight font-display">
            Arshio Studio Control Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize page section copy, manage the public portfolio case studies (CRUD), and control live agency settings.
          </p>
        </div>

        {savedNotice && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Changes Published Live!</span>
          </div>
        )}
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-slate-800">
        {[
          { key: "cms", label: "Page Sections Content", icon: Layout },
          { key: "projects", label: "Portfolio Projects (CRUD)", icon: Layers, count: projects.length },
          { key: "contact", label: "Agency Contact & Intake", icon: Phone },
          { key: "security", label: "Admin Password", icon: KeyRound },
          { key: "database", label: "Cloud Database", icon: Database },
        ].map((tab) => {
          const active = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as SettingsTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                active
                  ? "bg-[#27e2c4] text-[#070d1e] shadow-[0_0_20px_rgba(39,226,196,0.25)]"
                  : "bg-[#0b132b] text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    active ? "bg-[#070d1e] text-[#27e2c4]" : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PAGE SECTIONS CMS (HERO, SERVICES, WHY US, ABOUT, PRICING)           */}
      {/* ========================================================================= */}
      {activeTab === "cms" && (
        <form onSubmit={handleSaveCMS} className="space-y-8 animate-fade-in">
          {/* Section 1: Homepage Hero Section */}
          <AdminCard className="p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#27e2c4]/10 border border-[#27e2c4]/30 flex items-center justify-center text-[#27e2c4]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Homepage Hero Section</h3>
                  <p className="text-xs text-slate-400">Controls the primary hero typography, callouts, and action buttons</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#27e2c4] bg-[#27e2c4]/10 px-2 py-0.5 rounded border border-[#27e2c4]/20">
                Above the Fold
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Studio Pill / Badge Text</label>
                <input
                  type="text"
                  value={formData.hero.badge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, badge: e.target.value },
                    })
                  }
                  placeholder="e.g. SENIOR FULL-CYCLE DIGITAL STUDIO"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d1e] border border-slate-800 text-white font-mono focus:outline-none focus:border-[#27e2c4]/50"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Headline First Line</label>
                  <input
                    type="text"
                    value={formData.hero.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, title: e.target.value },
                      })
                    }
                    placeholder="e.g. Design-Led Digital Products That"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d1e] border border-slate-800 text-white font-bold focus:outline-none focus:border-[#27e2c4]/50"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Headline Glowing Accent Words</label>
                  <input
                    type="text"
                    value={formData.hero.titleAccent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, titleAccent: e.target.value },
                      })
                    }
                    placeholder="e.g. Scale Your Business Fast."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d1e] border border-slate-800 text-[#27e2c4] font-bold focus:outline-none focus:border-[#27e2c4]/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Hero Subtitle Paragraph</label>
                <textarea
                  rows={3}
                  value={formData.hero.subtitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, subtitle: e.target.value },
                    })
                  }
                  className="w-full p-3.5 rounded-xl bg-[#070d1e] border border-slate-800 text-slate-200 leading-relaxed focus:outline-none focus:border-[#27e2c4]/50"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Primary Button Text & Target</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.hero.primaryBtnText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, primaryBtnText: e.target.value },
                        })
                      }
                      placeholder="Start Your Project"
                      className="flex-1 px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white font-medium"
                    />
                    <input
                      type="text"
                      value={formData.hero.primaryBtnLink}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, primaryBtnLink: e.target.value },
                        })
                      }
                      placeholder="/contact"
                      className="w-32 px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-[#27e2c4] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Secondary Button Text & Target</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.hero.secondaryBtnText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, secondaryBtnText: e.target.value },
                        })
                      }
                      placeholder="Explore Case Studies"
                      className="flex-1 px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white font-medium"
                    />
                    <input
                      type="text"
                      value={formData.hero.secondaryBtnLink}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, secondaryBtnLink: e.target.value },
                        })
                      }
                      placeholder="/portfolio"
                      className="w-32 px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-[#27e2c4] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Browser Mockup Chrome details */}
              <div className="p-4 rounded-xl bg-[#070d1e] border border-slate-800/80 mt-4 space-y-3">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Studio Browser Chrome Mockup
                </span>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 block mb-1 text-[11px]">Mockup Browser URL</label>
                    <input
                      type="text"
                      value={formData.hero.mockupUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, mockupUrl: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0b132b] border border-slate-800 text-slate-200 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1 text-[11px]">Live Status Badge</label>
                    <input
                      type="text"
                      value={formData.hero.mockupStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, mockupStatus: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0b132b] border border-slate-800 text-emerald-400 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Section 2: Services Section CMS */}
          <AdminCard className="p-6 sm:p-8">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-6">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Services Section Header</h3>
                <p className="text-xs text-slate-400">Section heading and description above the asymmetric bento grid</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={formData.servicesSection.badge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        servicesSection: { ...formData.servicesSection, badge: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.servicesSection.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        servicesSection: { ...formData.servicesSection, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Title Accent Words</label>
                  <input
                    type="text"
                    value={formData.servicesSection.titleAccent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        servicesSection: { ...formData.servicesSection, titleAccent: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-[#27e2c4] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Subtitle Description</label>
                <textarea
                  rows={2}
                  value={formData.servicesSection.subtitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      servicesSection: { ...formData.servicesSection, subtitle: e.target.value },
                    })
                  }
                  className="w-full p-3 rounded-xl bg-[#070d1e] border border-slate-800 text-slate-300 leading-relaxed"
                />
              </div>
            </div>
          </AdminCard>

          {/* Section 3: Why Choose Us Section CMS */}
          <AdminCard className="p-6 sm:p-8">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 mb-6">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Why Choose Us & Editorial Manifesto</h3>
                <p className="text-xs text-slate-400">The left-side bold statement and operating guarantee</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Statement Title</label>
                  <input
                    type="text"
                    value={formData.whyChooseUsSection.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whyChooseUsSection: { ...formData.whyChooseUsSection, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Statement Accent</label>
                  <input
                    type="text"
                    value={formData.whyChooseUsSection.titleAccent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whyChooseUsSection: { ...formData.whyChooseUsSection, titleAccent: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-[#27e2c4] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Manifesto Body</label>
                <textarea
                  rows={3}
                  value={formData.whyChooseUsSection.subtitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whyChooseUsSection: { ...formData.whyChooseUsSection, subtitle: e.target.value },
                    })
                  }
                  className="w-full p-3 rounded-xl bg-[#070d1e] border border-slate-800 text-slate-300 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Operating Guarantee Copy</label>
                <input
                  type="text"
                  value={formData.whyChooseUsSection.guarantee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whyChooseUsSection: { ...formData.whyChooseUsSection, guarantee: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white"
                />
              </div>
            </div>
          </AdminCard>

          {/* Submit Button */}
          <div className="flex justify-end sticky bottom-6 z-20">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#27e2c4] text-[#070d1e] text-sm font-extrabold hover:bg-[#27e2c4]/90 transition shadow-[0_0_30px_rgba(39,226,196,0.35)]"
            >
              <Save className="w-5 h-5" />
              <span>Save & Publish All Section Content</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PORTFOLIO PROJECTS CRUD MANAGER                                    */}
      {/* ========================================================================= */}
      {activeTab === "projects" && (
        <div className="space-y-6 animate-fade-in">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b132b] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#27e2c4]/50"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#0b132b] border border-slate-800 text-xs text-slate-300 focus:outline-none"
              >
                <option value="All">All Disciplines</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetToDefaults}
                className="px-3 py-2 rounded-xl bg-[#0b132b] border border-slate-800 text-slate-400 hover:text-white text-xs font-medium"
                title="Reset to 12 curated projects"
              >
                Reset Default 12
              </button>
              <button
                onClick={handleOpenAddProject}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#27e2c4] text-[#070d1e] text-xs font-extrabold hover:bg-[#27e2c4]/90 transition shadow-[0_0_20px_rgba(39,226,196,0.25)]"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>
          </div>

          {/* Projects Table / Cards */}
          <AdminCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#070d1e]/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Project Thumbnail & Title</th>
                    <th className="px-5 py-3.5">Client & Category</th>
                    <th className="px-5 py-3.5">Metrics</th>
                    <th className="px-5 py-3.5">Featured</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-16 h-11 object-cover rounded-lg border border-slate-800 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <div className="font-bold text-white text-sm truncate">{p.title}</div>
                            <div className="text-slate-400 text-xs truncate mt-0.5">{p.description}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-200">{p.client}</div>
                        <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#27e2c4]">
                          {p.category}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {p.metrics?.slice(0, 2).map((m, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-[#27e2c4]/10 border border-[#27e2c4]/20 text-[10px] text-[#27e2c4] font-bold"
                            >
                              {m.value} {m.label}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.featured
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {p.featured ? "Featured" : "Standard"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditProject(p)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id, p.title)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CONTACT & INTAKE CAPACITY                                          */}
      {/* ========================================================================= */}
      {activeTab === "contact" && (
        <form onSubmit={handleSaveCMS} className="space-y-6 animate-fade-in max-w-4xl">
          <AdminCard className="p-6 sm:p-8">
            <h3 className="text-base font-bold text-white mb-4">Live Agency Availability</h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#070d1e] border border-slate-800">
                <div>
                  <div className="font-bold text-white text-sm">Accepting New Client Projects</div>
                  <div className="text-slate-400 mt-0.5">Controls availability badges shown to visitors across all pages</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      isAcceptingProjects: !formData.isAcceptingProjects,
                      availabilityBadge: !formData.isAcceptingProjects
                        ? "Accepting New Projects & ERP Audits"
                        : "Fully Booked for Current Quarter",
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    formData.isAcceptingProjects ? "bg-[#27e2c4]" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-[#070d1e] transition-transform ${
                      formData.isAcceptingProjects ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Availability Badge Copy</label>
                  <input
                    type="text"
                    value={formData.availabilityBadge}
                    onChange={(e) => setFormData({ ...formData, availabilityBadge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Guaranteed Response SLA</label>
                  <input
                    type="text"
                    value={formData.responseTimeSLA}
                    onChange={(e) => setFormData({ ...formData, responseTimeSLA: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white"
                  />
                </div>
              </div>
            </div>
          </AdminCard>

          <AdminCard className="p-6 sm:p-8">
            <h3 className="text-base font-bold text-white mb-4">Official Contact Channels</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Official Agency Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-medium">WhatsApp Number (e.g. 8801700000000)</label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Global Locations & Offices</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white"
                />
              </div>
            </div>
          </AdminCard>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#27e2c4] text-[#070d1e] font-extrabold text-xs hover:bg-[#27e2c4]/90 shadow-lg"
            >
              Save Contact Settings
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SECURITY & ADMIN PASSWORD                                          */}
      {/* ========================================================================= */}
      {activeTab === "security" && (
        <AdminCard className="p-6 sm:p-8 max-w-lg animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-4 h-4 text-[#27e2c4]" />
            <h3 className="text-sm font-bold text-white">Change Admin Password</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">New Password</label>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white focus:outline-none focus:border-[#27e2c4]/50"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Confirm Password</label>
              <input
                type="password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white focus:outline-none focus:border-[#27e2c4]/50"
              />
            </div>

            {pwMsg && (
              <div
                className={`p-2.5 rounded-lg border text-xs ${
                  pwMsg.kind === "ok"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}
              >
                {pwMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={pwSaving}
              className="w-full py-2.5 rounded-xl bg-[#27e2c4] text-[#070d1e] font-bold text-xs hover:bg-[#27e2c4]/90 transition"
            >
              {pwSaving ? "Updating..." : "Update Administrator Password"}
            </button>
          </form>
        </AdminCard>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DATABASE & SYNC DIAGNOSTICS                                        */}
      {/* ========================================================================= */}
      {activeTab === "database" && (
        <AdminCard className="p-6 sm:p-8 max-w-xl animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#27e2c4]" />
              <h3 className="text-sm font-bold text-white">Supabase Cloud Engine Status</h3>
            </div>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27e2c4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#27e2c4]"></span>
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
            <div className="p-3 rounded-xl bg-[#070d1e] border border-slate-800">
              <div className="font-mono text-[10px] uppercase text-slate-500">Architecture</div>
              <div className="text-white font-mono text-xs mt-0.5">PostgreSQL / Supabase + Local Mirror Sync</div>
              <div className="text-[11px] text-[#27e2c4] mt-1">100% Offline-Resilient & Instant UI Reactivity</div>
            </div>

            <div className="p-3 rounded-xl bg-[#070d1e] border border-slate-800 font-mono text-[11px] truncate">
              <div className="text-slate-500 text-[10px] uppercase">Supabase Endpoint</div>
              <div className="text-slate-300 mt-0.5">https://crnxteiwdkruuwfhxkni.supabase.co</div>
            </div>
          </div>
        </AdminCard>
      )}

      {/* ========================================================================= */}
      {/* PROJECT CREATE / EDIT MODAL                                               */}
      {/* ========================================================================= */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#080c1d] border border-slate-800 p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#27e2c4]" />
                <span>{editingProjectId ? "Edit Portfolio Project" : "Add New Portfolio Project"}</span>
              </h3>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={projectFormData.title}
                    onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                    placeholder="e.g. Apex Enterprise ERP & Supply Chain Engine"
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white focus:outline-none focus:border-[#27e2c4]/50"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Client Name / Organization</label>
                  <input
                    type="text"
                    required
                    value={projectFormData.client}
                    onChange={(e) => setProjectFormData({ ...projectFormData, client: e.target.value })}
                    placeholder="e.g. Apex Global Logistics"
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white focus:outline-none focus:border-[#27e2c4]/50"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Service Discipline / Category</label>
                  <select
                    value={projectFormData.category}
                    onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Image Thumbnail URL</label>
                  <input
                    type="url"
                    required
                    value={projectFormData.image}
                    onChange={(e) => setProjectFormData({ ...projectFormData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Brief Description / Hook</label>
                <textarea
                  rows={2}
                  required
                  value={projectFormData.description}
                  onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                  placeholder="Architected a unified cloud ERP platform synchronizing 4 regional warehouses..."
                  className="w-full p-3 rounded-xl bg-[#070d1e] border border-slate-800 text-slate-200 leading-relaxed"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Full Challenge (Case Study modal)</label>
                  <textarea
                    rows={2}
                    value={projectFormData.fullChallenge}
                    onChange={(e) => setProjectFormData({ ...projectFormData, fullChallenge: e.target.value })}
                    placeholder="Client suffered 15+ hours weekly in manual spreadsheet reconciliations..."
                    className="w-full p-3 rounded-xl bg-[#070d1e] border border-slate-800 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Full Solution (Case Study modal)</label>
                  <textarea
                    rows={2}
                    value={projectFormData.fullSolution}
                    onChange={(e) => setProjectFormData({ ...projectFormData, fullSolution: e.target.value })}
                    placeholder="Engineered high-concurrency Node.js + PostgreSQL ERP with automated barcode scanning..."
                    className="w-full p-3 rounded-xl bg-[#070d1e] border border-slate-800 text-slate-200"
                  />
                </div>
              </div>

              {/* Metrics (2 items) */}
              <div className="p-3.5 rounded-xl bg-[#070d1e] border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Proof Metrics
                </span>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Value (e.g. -68%)"
                      value={projectFormData.metrics[0]?.value || ""}
                      onChange={(e) => {
                        const m = [...projectFormData.metrics];
                        m[0] = { ...m[0], value: e.target.value };
                        setProjectFormData({ ...projectFormData, metrics: m });
                      }}
                      className="w-1/2 px-2.5 py-1.5 rounded-lg bg-[#0b132b] border border-slate-800 text-white font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Label (e.g. Operational Lag)"
                      value={projectFormData.metrics[0]?.label || ""}
                      onChange={(e) => {
                        const m = [...projectFormData.metrics];
                        m[0] = { ...m[0], label: e.target.value };
                        setProjectFormData({ ...projectFormData, metrics: m });
                      }}
                      className="w-1/2 px-2.5 py-1.5 rounded-lg bg-[#0b132b] border border-slate-800 text-slate-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Value (e.g. 99.9%)"
                      value={projectFormData.metrics[1]?.value || ""}
                      onChange={(e) => {
                        const m = [...projectFormData.metrics];
                        m[1] = { ...m[1], value: e.target.value };
                        setProjectFormData({ ...projectFormData, metrics: m });
                      }}
                      className="w-1/2 px-2.5 py-1.5 rounded-lg bg-[#0b132b] border border-slate-800 text-white font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Label (e.g. Accuracy)"
                      value={projectFormData.metrics[1]?.label || ""}
                      onChange={(e) => {
                        const m = [...projectFormData.metrics];
                        m[1] = { ...m[1], label: e.target.value };
                        setProjectFormData({ ...projectFormData, metrics: m });
                      }}
                      className="w-1/2 px-2.5 py-1.5 rounded-lg bg-[#0b132b] border border-slate-800 text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Tags & Featured Checkbox */}
              <div className="grid sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Tech Stack Tags (comma separated)</label>
                  <input
                    type="text"
                    value={projectFormData.tags.join(", ")}
                    onChange={(e) =>
                      setProjectFormData({
                        ...projectFormData,
                        tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="React, Node.js, PostgreSQL"
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white font-mono text-xs"
                  />
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={projectFormData.featured}
                    onChange={(e) => setProjectFormData({ ...projectFormData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#27e2c4] bg-[#070d1e] border-slate-800"
                  />
                  <label htmlFor="featured" className="text-slate-300 font-medium cursor-pointer">
                    Show as Featured Project on Homepage Preview
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#27e2c4] text-[#070d1e] font-extrabold hover:bg-[#27e2c4]/90"
                >
                  {editingProjectId ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
