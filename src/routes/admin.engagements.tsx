import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Briefcase,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  User,
  Mail,
  DollarSign,
  Calendar,
  X,
} from "lucide-react";
import { AdminShell, AdminCard } from "@/components/admin/AdminShell";
import {
  getEngagements,
  createEngagement,
  toggleEngagementMilestone,
  type Engagement,
} from "@/lib/admin-api";

export const Route = createFileRoute("/admin/engagements")({
  head: () => ({
    meta: [
      { title: "Client Projects & Delivery — Arshio Studio Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EngagementsPage,
});

const SERVICE_TAGS: Record<Engagement["service_type"], { label: string; color: string }> = {
  custom_erp: { label: "Custom ERP & Software", color: "text-[#27e2c4] bg-[#27e2c4]/10 border-[#27e2c4]/30" },
  web_app: { label: "Web App & Storefront", color: "text-[#38bdf8] bg-[#38bdf8]/10 border-[#38bdf8]/30" },
  mobile_app: { label: "Mobile App (iOS/Android)", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  ui_ux: { label: "UI/UX & Design System", color: "text-pink-400 bg-pink-500/10 border-pink-500/30" },
  video_motion: { label: "3D & Motion Reels", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  growth: { label: "Growth & Performance PPC", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
};

function EngagementsPage() {
  const [projects, setProjects] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    client_name: "",
    client_email: "",
    service_type: "custom_erp" as Engagement["service_type"],
    summary: "",
    budget: "$6,500",
  });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getEngagements();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();

    const onUpdate = () => loadProjects();
    window.addEventListener("arshio_engagements_updated", onUpdate);
    return () => window.removeEventListener("arshio_engagements_updated", onUpdate);
  }, []);

  const handleToggle = async (engId: string, milestoneId: string) => {
    await toggleEngagementMilestone(engId, milestoneId);
    loadProjects();
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.client_name) return;
    await createEngagement(formData);
    setShowCreateModal(false);
    setFormData({
      title: "",
      client_name: "",
      client_email: "",
      service_type: "custom_erp",
      summary: "",
      budget: "$6,500",
    });
    loadProjects();
  };

  return (
    <AdminShell title="Client Projects">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Active Client Deliverables</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track agile sprints, milestone completions, and deliverables handover for every signed client.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0b132b] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-semibold transition"
          >
            <span>Public Portfolio (CRUD)</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#27e2c4]" />
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#27e2c4] text-[#070d1e] text-xs font-bold hover:bg-[#27e2c4]/90 transition shadow-[0_0_20px_rgba(39,226,196,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>New Client Engagement</span>
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.map((project) => {
          const serviceTag = SERVICE_TAGS[project.service_type] || SERVICE_TAGS.custom_erp;
          const completedCount = project.milestones.filter((m) => m.done).length;
          const percent = Math.round((completedCount / (project.milestones.length || 1)) * 100);

          return (
            <AdminCard key={project.id} className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-slate-800/80 pb-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${serviceTag.color}`}>
                      {serviceTag.label}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      ● Active Sprint
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight font-display">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 bg-[#070d1e] p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400">Client Contact</div>
                    <div className="text-xs font-bold text-white mt-0.5">{project.client_name}</div>
                    <div className="text-[11px] text-slate-400">{project.client_email}</div>
                  </div>
                  <div className="h-8 w-px bg-slate-800" />
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400">Budget</div>
                    <div className="text-sm font-extrabold text-[#27e2c4] font-display">
                      {project.budget || "$6,500"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestones & Progress */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <span>Sprint Milestones</span>
                    <span className="text-[11px] font-normal text-slate-400">
                      ({completedCount} of {project.milestones.length} completed)
                    </span>
                  </div>
                  <span className="font-mono text-xs font-extrabold text-[#27e2c4]">{percent}%</span>
                </div>

                {/* Progress track */}
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
                  <div
                    className="h-full bg-gradient-to-r from-[#27e2c4] via-[#5eead4] to-[#38bdf8] rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Milestone Checklist */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {project.milestones.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleToggle(project.id, m.id)}
                      className={`text-left p-3 rounded-xl border transition flex items-start gap-3 ${
                        m.done
                          ? "bg-emerald-500/5 border-emerald-500/20 text-slate-200"
                          : "bg-[#070d1e] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {m.done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <div className="text-xs font-medium leading-relaxed">
                        <span className={m.done ? "line-through text-slate-400" : ""}>{m.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </AdminCard>
          );
        })}
      </div>

      {/* New Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#080c1d] border border-slate-800 p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#27e2c4]" /> Create New Engagement
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Logistics Dashboard"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white focus:outline-none focus:border-[#27e2c4]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white focus:outline-none focus:border-[#27e2c4]/50"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Client Email</label>
                  <input
                    type="email"
                    required
                    placeholder="john@acme.com"
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white focus:outline-none focus:border-[#27e2c4]/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Service Discipline</label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white focus:outline-none focus:border-[#27e2c4]/50"
                  >
                    <option value="custom_erp">Custom ERP & Software</option>
                    <option value="web_app">Web App Development</option>
                    <option value="mobile_app">Mobile App (Flutter/React Native)</option>
                    <option value="ui_ux">UI/UX & Design System</option>
                    <option value="video_motion">3D & Motion Reels</option>
                    <option value="growth">Digital Growth Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Budget / Retainer</label>
                  <input
                    type="text"
                    placeholder="e.g. $8,500"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white focus:outline-none focus:border-[#27e2c4]/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Project Scope Summary</label>
                <textarea
                  rows={3}
                  placeholder="Summary of project deliverables and timelines..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#070d1e] border border-slate-800 text-white focus:outline-none focus:border-[#27e2c4]/50"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#27e2c4] text-[#070d1e] font-bold hover:bg-[#27e2c4]/90"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
