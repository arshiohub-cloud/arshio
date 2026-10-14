import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search,
  Mail,
  Phone,
  Building2,
  X,
  Trash2,
  RefreshCw,
  Download,
  Save,
  Reply,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Briefcase,
  CheckCircle2,
  Clock,
  MessageSquare,
} from "lucide-react";
import { AdminShell, AdminCard } from "@/components/admin/AdminShell";
import {
  getLeads,
  updateLeadStatus,
  updateLeadNotes,
  deleteLead,
  createEngagement,
  type Lead,
  type LeadStatus,
} from "@/lib/admin-api";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [
      { title: "Leads & CRM Pipeline — Arshio Studio Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LeadsPage,
});

const STATUS_TABS: { key: LeadStatus | "all"; label: string }[] = [
  { key: "all", label: "All Inquiries" },
  { key: "new", label: "New" },
  { key: "in_progress", label: "In Follow-up" },
  { key: "won", label: "Client Won" },
  { key: "lost", label: "Not a Fit" },
  { key: "spam", label: "Spam" },
];

const STATUS_BADGES: Record<LeadStatus, { label: string; bg: string; text: string; border: string }> = {
  new: { label: "New Lead", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  in_progress: { label: "Following up", bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  won: { label: "Client Won", bg: "bg-[#27e2c4]/15", text: "text-[#27e2c4]", border: "border-[#27e2c4]/40" },
  lost: { label: "Not a fit", bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
  spam: { label: "Spam", bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20" },
};

function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentTab, setCurrentTab] = useState<LeadStatus | "all">("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [noteSavedNotice, setNoteSavedNotice] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await getLeads({ status: currentTab, search });
      setLeads(res.leads);
      if (selectedLead) {
        const found = res.leads.find((l) => l.id === selectedLead.id);
        if (found) setSelectedLead(found);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();

    const onUpdate = () => fetchLeads();
    window.addEventListener("arshio_leads_updated", onUpdate);
    return () => window.removeEventListener("arshio_leads_updated", onUpdate);
  }, [currentTab, search]);

  const handleOpenDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setEditNotes(lead.notes || "");
    setNoteSavedNotice(false);
  };

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    await updateLeadStatus(id, newStatus);
    fetchLeads();
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setSavingNotes(true);
    await updateLeadNotes(selectedLead.id, editNotes);
    setSavingNotes(false);
    setNoteSavedNotice(true);
    setTimeout(() => setNoteSavedNotice(false), 2500);
    fetchLeads();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    await deleteLead(id);
    setSelectedLead(null);
    fetchLeads();
  };

  const handleConvertToProject = async (lead: Lead) => {
    await createEngagement({
      title: `${lead.company || lead.name} — Agency Engagement`,
      client_name: lead.name,
      client_email: lead.email,
      service_type: "custom_erp",
      summary: lead.message,
      budget: "$8,000",
    });
    await updateLeadStatus(lead.id, "won");
    alert("Lead successfully converted to an Active Client Project! View it in the Projects tab.");
    fetchLeads();
  };

  const exportCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Company", "Status", "Date", "Message", "Notes"];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${l.phone || ""}"`,
      `"${(l.company || "").replace(/"/g, '""')}"`,
      l.status,
      new Date(l.created_at).toISOString(),
      `"${l.message.replace(/"/g, '""')}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `arshio-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminShell title="Leads & CRM">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Client Inquiries & CRM Pipeline</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage incoming briefs, update customer stages, and convert leads into active projects.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0b132b] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#27e2c4]/50"
            />
          </div>

          <button
            onClick={exportCSV}
            title="Export CSV"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0b132b] border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-[#27e2c4]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={fetchLeads}
            disabled={loading}
            title="Refresh"
            className="p-2 rounded-xl bg-[#0b132b] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#27e2c4] ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {STATUS_TABS.map((tab) => {
          const active = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setCurrentTab(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? "bg-[#27e2c4] text-[#070d1e] shadow-[0_0_15px_rgba(39,226,196,0.2)]"
                  : "bg-[#0b132b] text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Leads Table Card */}
      <AdminCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070d1e]/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Client & Contact</th>
                <th className="px-5 py-3.5">Company</th>
                <th className="px-5 py-3.5">Message Brief</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const badge = STATUS_BADGES[lead.status] || STATUS_BADGES.new;
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-white/[0.02] transition cursor-pointer"
                      onClick={() => handleOpenDetail(lead)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#27e2c4]/20 to-[#38bdf8]/20 border border-[#27e2c4]/30 text-[#27e2c4] font-bold flex items-center justify-center shrink-0">
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{lead.name}</div>
                            <div className="text-slate-400 text-xs mt-0.5">{lead.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-300 font-medium">
                        {lead.company || "—"}
                      </td>

                      <td className="px-5 py-4 max-w-xs">
                        <p className="truncate text-slate-300" title={lead.message}>
                          {lead.message}
                        </p>
                      </td>

                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border bg-[#070d1e] focus:outline-none transition cursor-pointer ${badge.border} ${badge.text}`}
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Follow-up</option>
                          <option value="won">Client Won</option>
                          <option value="lost">Not a Fit</option>
                          <option value="spam">Spam</option>
                        </select>
                      </td>

                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenDetail(lead)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium text-xs transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Slide-over Detail Modal / Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg bg-[#070d1e] border-l border-slate-800 h-full overflow-y-auto p-6 sm:p-8 flex flex-col shadow-2xl relative"
            style={{ background: "#080c1d" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#27e2c4] to-[#38bdf8] text-[#070d1e] font-extrabold flex items-center justify-center text-lg font-display">
                  {selectedLead.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedLead.name}</h3>
                  <p className="text-xs text-slate-400">{selectedLead.company || "Independent Client"}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions (Email / WhatsApp / Convert) */}
            <div className="grid grid-cols-2 gap-3 my-6">
              <a
                href={`mailto:${selectedLead.email}?subject=Re: Your Project Inquiry with Arshio Agency`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#27e2c4] text-[#070d1e] text-xs font-bold hover:bg-[#27e2c4]/90 transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>

              {selectedLead.phone ? (
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              ) : (
                <button
                  onClick={() => handleConvertToProject(selectedLead)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/30 transition"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Convert to Project</span>
                </button>
              )}
            </div>

            {/* Contact Details */}
            <div className="space-y-4 mb-6 text-xs">
              <div className="p-4 rounded-xl bg-[#0b132b] border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Contact Info</div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-[#27e2c4]" />
                  <span>{selectedLead.email}</span>
                </div>
                {selectedLead.phone && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4 text-[#27e2c4]" />
                    <span>{selectedLead.phone}</span>
                  </div>
                )}
                {selectedLead.company && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Building2 className="w-4 h-4 text-[#27e2c4]" />
                    <span>{selectedLead.company}</span>
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div className="p-4 rounded-xl bg-[#0b132b] border border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-white">Lead Stage:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                  className="text-xs font-bold rounded-lg px-3 py-1.5 border border-[#27e2c4]/40 bg-[#070d1e] text-[#27e2c4] focus:outline-none"
                >
                  <option value="new">● New Inquiry</option>
                  <option value="in_progress">● In Follow-up</option>
                  <option value="won">● Client Won</option>
                  <option value="lost">● Not a Fit</option>
                  <option value="spam">● Junk / Spam</option>
                </select>
              </div>

              {/* Full Message Brief */}
              <div className="p-4 rounded-xl bg-[#0b132b] border border-slate-800">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Message Brief</div>
                <div className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap bg-[#070d1e] p-3 rounded-lg border border-slate-800/80">
                  {selectedLead.message}
                </div>
              </div>

              {/* Internal Admin Notepad */}
              <div className="p-4 rounded-xl bg-[#0b132b] border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Internal Notes</span>
                  {noteSavedNotice && <span className="text-[11px] text-emerald-400 font-bold">Saved!</span>}
                </div>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add private internal notes (call summaries, proposal amounts, client preferences)..."
                  rows={4}
                  className="w-full p-3 rounded-lg bg-[#070d1e] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#27e2c4]/50"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27e2c4] text-[#070d1e] text-xs font-bold hover:bg-[#27e2c4]/90 transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Notes</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer / Delete */}
            <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleConvertToProject(selectedLead)}
                className="text-xs font-bold text-[#27e2c4] hover:underline flex items-center gap-1"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Promote to Active Project</span>
              </button>

              <button
                onClick={() => handleDelete(selectedLead.id)}
                className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
