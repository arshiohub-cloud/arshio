import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Sparkles,
  PhoneCall,
  ExternalLink,
  Shield,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { AdminShell, AdminCard } from "@/components/admin/AdminShell";
import {
  getLeadStats,
  getLeads,
  getEngagements,
  updateLeadStatus,
  type Lead,
  type Engagement,
  type LeadStatus,
} from "@/lib/admin-api";
import { useSiteSettings } from "@/lib/cms-store";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Arshio Studio Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Dashboard,
});

const STATUS_BADGES: Record<LeadStatus, { label: string; bg: string; text: string; border: string }> = {
  new: { label: "New Lead", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  in_progress: { label: "In Follow-up", bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  won: { label: "Client Won", bg: "bg-[#27e2c4]/15", text: "text-[#27e2c4]", border: "border-[#27e2c4]/40" },
  lost: { label: "Closed / Lost", bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
  spam: { label: "Spam", bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20" },
};

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    newLeads: 0,
    inProgress: 0,
    won: 0,
    conversionRate: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [activeProjects, setActiveProjects] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useSiteSettings();

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, l, e] = await Promise.all([
        getLeadStats(),
        getLeads(),
        getEngagements(),
      ]);
      setStats(s);
      setRecentLeads(l.leads.slice(0, 5));
      setActiveProjects(e.slice(0, 3));
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const onUpdate = () => loadData();
    window.addEventListener("arshio_leads_updated", onUpdate);
    window.addEventListener("arshio_engagements_updated", onUpdate);

    return () => {
      window.removeEventListener("arshio_leads_updated", onUpdate);
      window.removeEventListener("arshio_engagements_updated", onUpdate);
    };
  }, []);

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    await updateLeadStatus(id, newStatus);
    loadData();
  };

  return (
    <AdminShell title="Agency Overview">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#27e2c4]/30 bg-[#27e2c4]/10 text-[#27e2c4] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Arshio Agency Intelligence
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome back to Mission Control
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time status of your client inquiries, ongoing project milestones, and live site controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0b132b] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#27e2c4] ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            to="/admin/leads"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#27e2c4] text-[#070d1e] text-xs font-bold hover:bg-[#27e2c4]/90 transition shadow-[0_0_20px_rgba(39,226,196,0.25)]"
          >
            <span>Manage All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Inquiries */}
        <AdminCard className="p-5 relative overflow-hidden group hover:border-[#27e2c4]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">Total Leads</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight font-display">{stats.total}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              +24% vs last mo
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">Inbound inquiries across all web pages</div>
        </AdminCard>

        {/* New Unread */}
        <AdminCard className="p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">Awaiting Response</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight font-display">{stats.newLeads}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              Action Required
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">Target response SLA: &lt; 24 hours</div>
        </AdminCard>

        {/* Active Projects */}
        <AdminCard className="p-5 relative overflow-hidden group hover:border-[#27e2c4]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">Active Delivery</span>
            <div className="w-9 h-9 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/20 text-[#27e2c4] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#27e2c4] tracking-tight font-display">{activeProjects.length}</span>
            <span className="text-xs font-medium text-slate-300">Live Client Builds</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">ERP, Web & Motion sprints running</div>
        </AdminCard>

        {/* Won / Conversion Rate */}
        <AdminCard className="p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">Conversion Rate</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-300 tracking-tight font-display">{stats.conversionRate}%</span>
            <span className="text-xs font-medium text-emerald-400">High Qualified</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">{stats.won} deals successfully converted</div>
        </AdminCard>
      </div>

      {/* Quick Action Portals: Page Sections CMS & Portfolio CRUD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          to="/admin/settings"
          className="p-5 rounded-2xl bg-gradient-to-br from-[#0b132b] to-[#070d1e] border border-slate-800 hover:border-[#27e2c4]/40 transition group flex items-start gap-4"
        >
          <div className="w-11 h-11 rounded-xl bg-[#27e2c4]/10 border border-[#27e2c4]/30 text-[#27e2c4] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Customize Page Sections (Hero, Services, Why Us)</span>
              <ArrowUpRight className="w-4 h-4 text-[#27e2c4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Edit hero headlines, badges, subtitles, call-to-actions, and manifesto text without editing code.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/settings"
          className="p-5 rounded-2xl bg-gradient-to-br from-[#0b132b] to-[#070d1e] border border-slate-800 hover:border-cyan-500/40 transition group flex items-start gap-4"
        >
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Portfolio Projects Manager (Full CRUD)</span>
              <ArrowUpRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Add new projects, edit titles, clients, metrics, images, or delete existing portfolio case studies.
            </p>
          </div>
        </Link>
      </div>

      {/* Main Grid: Recent Inquiries + Agency Live Controller */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Inquiries Feed (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Recent Inquiries</span>
                <span className="text-xs font-normal text-slate-400">({recentLeads.length} latest)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Click any status pill to transition lead state.</p>
            </div>
            <Link
              to="/admin/leads"
              className="text-xs font-semibold text-[#27e2c4] hover:underline flex items-center gap-1"
            >
              View Pipeline <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentLeads.map((lead) => {
              const badge = STATUS_BADGES[lead.status] || STATUS_BADGES.new;
              return (
                <AdminCard key={lead.id} className="p-5 hover:border-slate-700 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#27e2c4]/20 to-[#38bdf8]/20 border border-[#27e2c4]/30 text-[#27e2c4] font-bold flex items-center justify-center shrink-0">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">{lead.name}</span>
                          {lead.company && (
                            <span className="text-xs text-slate-400 font-medium">
                              — {lead.company}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                          <span>{lead.email}</span>
                          {lead.phone && <span>{lead.phone}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Status Pill with Dropdown */}
                    <div className="flex items-center gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border bg-[#070d1e] cursor-pointer focus:outline-none transition ${badge.border} ${badge.text}`}
                      >
                        <option value="new">● New</option>
                        <option value="in_progress">● In Follow-up</option>
                        <option value="won">● Won / Closed</option>
                        <option value="lost">● Not a Fit</option>
                        <option value="spam">● Junk / Spam</option>
                      </select>
                      <Link
                        to="/admin/leads"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition"
                        title="View Full Details"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Message Snippet */}
                  <div className="mt-3 text-xs text-slate-300 leading-relaxed bg-[#070d1e]/60 rounded-xl p-3 border border-slate-800/60">
                    &ldquo;{lead.message}&rdquo;
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono">Source: {lead.source_page || "/contact"}</span>
                    <span>{new Date(lead.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </AdminCard>
              );
            })}
          </div>
        </div>

        {/* Right Column: Site Content Quick Controller & Active Projects */}
        <div className="space-y-6">
          {/* Live Website Controller Card */}
          <AdminCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#27e2c4]" /> Live Site Controls
              </h3>
              <span className="text-[10px] font-mono text-[#27e2c4] bg-[#27e2c4]/10 border border-[#27e2c4]/20 px-2 py-0.5 rounded">
                Instant Sync
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Toggle intake capacity and update primary contact channels across the public frontend in real-time.
            </p>

            <div className="space-y-4 text-xs">
              {/* Toggle Accepting Projects */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#070d1e] border border-slate-800">
                <div>
                  <div className="font-semibold text-white">Accepting New Projects</div>
                  <div className="text-[11px] text-slate-400">Display intake availability badge</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSiteSettings({
                      isAcceptingProjects: !siteSettings.isAcceptingProjects,
                      availabilityBadge: !siteSettings.isAcceptingProjects
                        ? "Accepting New Projects & ERP Audits"
                        : "Fully Booked for Current Quarter",
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    siteSettings.isAcceptingProjects ? "bg-[#27e2c4]" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-[#070d1e] transition-transform ${
                      siteSettings.isAcceptingProjects ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Contact Phone & Email */}
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-slate-400">Direct Agency Phone</label>
                <input
                  type="text"
                  value={siteSettings.phone}
                  onChange={(e) => setSiteSettings({ phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#070d1e] border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-[#27e2c4]/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-medium text-slate-400">Official Agency Email</label>
                <input
                  type="email"
                  value={siteSettings.email}
                  onChange={(e) => setSiteSettings({ email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#070d1e] border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-[#27e2c4]/50"
                />
              </div>

              <Link
                to="/admin/settings"
                className="w-full block text-center py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-semibold transition"
              >
                More CMS & Content Settings
              </Link>
            </div>
          </AdminCard>

          {/* Active Client Projects Preview */}
          <AdminCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" /> Active Sprints
              </h3>
              <Link to="/admin/engagements" className="text-xs text-cyan-400 hover:underline">
                All Projects
              </Link>
            </div>

            <div className="space-y-3">
              {activeProjects.map((proj) => {
                const doneCount = proj.milestones.filter((m) => m.done).length;
                const pct = Math.round((doneCount / (proj.milestones.length || 1)) * 100);

                return (
                  <div key={proj.id} className="p-3.5 rounded-xl bg-[#070d1e] border border-slate-800">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-white text-xs leading-snug">{proj.title}</div>
                      <span className="text-[10px] font-bold text-[#27e2c4] px-1.5 py-0.5 rounded bg-[#27e2c4]/10 shrink-0">
                        {proj.budget || "$5,000"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Client: {proj.client_name}</div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>Milestones: {doneCount}/{proj.milestones.length}</span>
                        <span className="font-mono text-white font-bold">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#27e2c4] to-[#38bdf8] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminShell>
  );
}
