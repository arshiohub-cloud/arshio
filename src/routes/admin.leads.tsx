import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
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
  UserPlus,
} from "lucide-react";

import { AdminShell, AdminCard } from "@/components/admin/AdminShell";
import {
  listLeads,
  updateLead,
  deleteLead,
  type LeadStatus,
} from "@/lib/admin-leads.functions";
import { adminConvertLead } from "@/lib/engagements.functions";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [
      { title: "Leads — InsightAI Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LeadsPage,
});

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  type: string;
  status: LeadStatus;
  source_page: string | null;
  created_at: string;
  read_at: string | null;
  notes: string | null;
  converted_engagement_id: string | null;
};

const STATUS_META: Record<
  LeadStatus,
  { label: string; color: string; bg: string }
> = {
  new: {
    label: "New inquiry",
    color: "#8B85FF",
    bg: "rgba(108,99,255,0.15)",
  },
  in_progress: {
    label: "Following up",
    color: "#00D4FF",
    bg: "rgba(0,212,255,0.15)",
  },
  won: {
    label: "Client won",
    color: "#22C58A",
    bg: "rgba(29,158,117,0.15)",
  },
  lost: {
    label: "Not a fit",
    color: "#F87171",
    bg: "rgba(239,68,68,0.15)",
  },
  spam: { label: "Junk", color: "#94A3B8", bg: "rgba(148,163,184,0.15)" },
};
const STATUSES: LeadStatus[] = ["new", "in_progress", "won", "lost", "spam"];

function LeadsPage() {
  const load = useServerFn(listLeads);
  const update = useServerFn(updateLead);
  const del = useServerFn(deleteLead);

  const [rows, setRows] = useState<LeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [selected, setSelected] = useState<LeadRow | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await load({
        data: { status: statusFilter, search, limit: 100, offset: 0 },
      });
      setRows(res.rows as LeadRow[]);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(refresh, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const s of STATUSES) c[s] = 0;
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  const onStatusChange = async (id: string, status: LeadStatus) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
    if (selected?.id === id) setSelected({ ...selected, status });
    try {
      await update({ data: { id, status, markRead: true } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
      refresh();
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    try {
      await del({ data: { id } });
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const exportCsv = () => {
    const header = [
      "created_at",
      "name",
      "email",
      "phone",
      "company",
      "type",
      "status",
      "source_page",
      "message",
    ];
    const escape = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [header.join(",")];
    for (const r of rows) {
      lines.push(
        header
          .map((k) => escape((r as unknown as Record<string, unknown>)[k]))
          .join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminShell title="Leads">
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, company…"
            className="w-full pl-9 pr-3 py-2 rounded-md border border-white/10 bg-white/[0.03] text-sm focus:outline-none focus:border-[#6C63FF]/60"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FilterChip
            label={`All (${total})`}
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />
          {STATUSES.map((s) => (
            <FilterChip
              key={s}
              label={`${STATUS_META[s].label} (${counts[s] ?? 0})`}
              active={statusFilter === s}
              onClick={() => setStatusFilter(s)}
              color={STATUS_META[s].color}
            />
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={exportCsv}
            disabled={rows.length === 0}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-md border border-white/10 hover:border-white/25 hover:bg-white/5 text-white/80 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-md border border-white/10 hover:border-white/25 hover:bg-white/5 text-white/80 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <AdminCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-white/50 border-b border-white/5">
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-white/40">
                    {search || statusFilter !== "all"
                      ? "No leads match your filters."
                      : "No leads yet. Submissions from the contact form will appear here."}
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                const unread = !r.read_at;
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="font-medium truncate">{r.name}</div>
                          <div className="text-[11px] text-white/50 truncate">
                            {r.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/70">
                      {r.company ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-white/70 capitalize">
                      {r.type}
                    </td>
                    <td className="px-4 py-3 text-white/60 whitespace-nowrap">
                      {relative(r.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect
                        value={r.status}
                        onChange={(v) => onStatusChange(r.id, v)}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(r.id);
                        }}
                        className="text-white/40 hover:text-red-400 p-1"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onSaved={(patch) => {
            setRows((prev) =>
              prev.map((r) => (r.id === selected.id ? { ...r, ...patch } : r)),
            );
            setSelected({ ...selected, ...patch });
          }}
        />
      )}
    </AdminShell>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-2.5 py-1.5 rounded-full border transition"
      style={{
        background: active
          ? color
            ? `${color}22`
            : "rgba(108,99,255,0.15)"
          : "rgba(255,255,255,0.02)",
        borderColor: active
          ? color ?? "#6C63FF"
          : "rgba(255,255,255,0.08)",
        color: active ? color ?? "#fff" : "rgba(255,255,255,0.7)",
      }}
    >
      {label}
    </button>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: LeadStatus;
  onChange: (v: LeadStatus) => void;
}) {
  const meta = STATUS_META[value];
  return (
    <select
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value as LeadStatus)}
      className="text-[11px] px-2 py-1 rounded-full border cursor-pointer focus:outline-none appearance-none"
      style={{
        background: meta.bg,
        color: meta.color,
        borderColor: `${meta.color}55`,
      }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} style={{ background: "#0F121E", color: "#fff" }}>
          {STATUS_META[s].label}
        </option>
      ))}
    </select>
  );
}

function LeadDrawer({
  lead,
  onClose,
  onSaved,
}: {
  lead: LeadRow;
  onClose: () => void;
  onSaved: (patch: Partial<LeadRow>) => void;
}) {
  const update = useServerFn(updateLead);
  const navigate = useNavigate();
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => setNotes(lead.notes ?? ""), [lead.id, lead.notes]);

  // Auto mark-as-read on open
  useEffect(() => {
    if (lead.read_at) return;
    update({ data: { id: lead.id, markRead: true } })
      .then(() => onSaved({ read_at: new Date().toISOString() }))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead.id]);

  const save = async () => {
    setSaving(true);
    try {
      await update({ data: { id: lead.id, notes, markRead: true } });
      onSaved({ notes, read_at: lead.read_at ?? new Date().toISOString() });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  };

  const composeReply = () => {
    navigate({
      to: "/admin/email",
      search: {
        to: lead.email,
        name: lead.name,
        context: lead.message,
      } as never,
    });
  };


  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-md h-full overflow-y-auto border-l border-white/10"
        style={{ background: "#0B0F1B" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/5 bg-[#0B0F1B]/95 backdrop-blur">
          <h3 className="text-sm font-semibold">Lead detail</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <div className="text-lg font-semibold">{lead.name}</div>
            <div className="text-xs text-white/50">
              {new Date(lead.created_at).toLocaleString()}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <Row icon={<Mail className="w-3.5 h-3.5" />}>
              <a
                href={`mailto:${lead.email}`}
                className="text-[#00D4FF] hover:underline"
              >
                {lead.email}
              </a>
            </Row>
            {lead.phone && (
              <Row icon={<Phone className="w-3.5 h-3.5" />}>
                <a
                  href={`tel:${lead.phone}`}
                  className="text-white/80 hover:text-white"
                >
                  {lead.phone}
                </a>
              </Row>
            )}
            {lead.company && (
              <Row icon={<Building2 className="w-3.5 h-3.5" />}>
                {lead.company}
              </Row>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <Meta label="Type" value={lead.type} />
            <Meta label="Source" value={lead.source_page ?? "—"} />
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-white/50 mb-1.5">
              Message
            </div>
            <div className="text-sm text-white/85 whitespace-pre-wrap bg-white/[0.03] border border-white/5 rounded-md p-3">
              {lead.message}
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-white/50 mb-1.5">
              Internal notes
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Add context, next steps, call summary…"
              className="w-full text-sm rounded-md border border-white/10 bg-white/[0.03] p-3 focus:outline-none focus:border-[#6C63FF]/60"
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-md text-white font-medium disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg,#6C63FF,#00D4FF)",
                }}
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? "Saving…" : saved ? "Saved" : "Save notes"}
              </button>
              <button
                onClick={composeReply}
                className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-md border border-white/15 hover:border-[#00D4FF]/60 hover:bg-[#00D4FF]/10 text-white/85"
              >
                <Reply className="w-3.5 h-3.5" />
                Compose reply with AI
              </button>
            </div>
          </div>

          <ConvertPanel lead={lead} onConverted={onSaved} />
        </div>
      </div>
    </div>
  );
}

const SERVICE_TYPES = [
  { value: "audit", label: "AI Audit" },
  { value: "consulting", label: "Consulting" },
  { value: "rag", label: "RAG / Knowledge base" },
  { value: "automation", label: "Automation" },
  { value: "agent", label: "AI Agent" },
  { value: "custom", label: "Custom build" },
] as const;

function ConvertPanel({
  lead,
  onConverted,
}: {
  lead: LeadRow;
  onConverted: (patch: Partial<LeadRow>) => void;
}) {
  const convert = useServerFn(adminConvertLead);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [serviceType, setServiceType] =
    useState<(typeof SERVICE_TYPES)[number]["value"]>("audit");
  const [title, setTitle] = useState(
    `${lead.company ?? lead.name} — AI Audit`,
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<{
    engagementId: string;
    email: string;
    tempPassword: string | null;
    accountCreated: boolean;
  } | null>(null);

  if (lead.converted_engagement_id && !result) {
    return (
      <div className="rounded-md border border-[#22C58A]/30 bg-[#22C58A]/10 p-3 text-xs text-[#22C58A]">
        Already converted to a client project.{" "}
        <button
          className="underline"
          onClick={() =>
            navigate({
              to: "/admin/engagements/$id",
              params: { id: lead.converted_engagement_id! },
            })
          }
        >
          Open project
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="rounded-md border border-[#22C58A]/30 bg-[#22C58A]/10 p-3 space-y-2 text-xs">
        <div className="text-[#22C58A] font-medium">Client project created</div>
        <div className="text-white/70">Login email: {result.email}</div>
        {result.tempPassword && (
          <div className="text-white/70">
            Temporary password:{" "}
            <span className="font-mono text-white">{result.tempPassword}</span>
            <div className="text-white/40 mt-1">
              Share this with the client — they can change it after signing in
              at /auth.
            </div>
          </div>
        )}
        {!result.accountCreated && (
          <div className="text-white/50">
            Existing account — project added to it.
          </div>
        )}
        <button
          className="underline text-[#00D4FF]"
          onClick={() =>
            navigate({
              to: "/admin/engagements/$id",
              params: { id: result.engagementId },
            })
          }
        >
          Open project
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-white/10 bg-white/[0.02] p-3">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-md border border-white/15 hover:border-[#22C58A]/60 hover:bg-[#22C58A]/10 text-white/85"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Convert to client
        </button>
      ) : (
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wider text-white/50">
            Create client project
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project title"
            className="w-full text-sm rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 focus:outline-none focus:border-[#6C63FF]/60"
          />
          <select
            value={serviceType}
            onChange={(e) =>
              setServiceType(
                e.target.value as (typeof SERVICE_TYPES)[number]["value"],
              )
            }
            className="w-full text-sm rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 focus:outline-none"
          >
            {SERVICE_TYPES.map((s) => (
              <option
                key={s.value}
                value={s.value}
                style={{ background: "#0F121E", color: "#fff" }}
              >
                {s.label}
              </option>
            ))}
          </select>
          {err && <div className="text-xs text-red-400">{err}</div>}
          <div className="flex items-center gap-2">
            <button
              disabled={busy || !title.trim()}
              onClick={async () => {
                setBusy(true);
                setErr(null);
                try {
                  const r = await convert({
                    data: { leadId: lead.id, serviceType, title: title.trim() },
                  });
                  setResult(r);
                  onConverted({
                    converted_engagement_id: r.engagementId,
                    status: "won",
                  });
                } catch (e) {
                  setErr(e instanceof Error ? e.message : "Conversion failed");
                } finally {
                  setBusy(false);
                }
              }}
              className="text-xs px-3 py-2 rounded-md text-white font-medium disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#6C63FF,#00D4FF)" }}
            >
              {busy ? "Creating…" : "Create client project"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-xs px-3 py-2 rounded-md border border-white/10 text-white/70"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-white/80">
      <span className="text-white/40">{icon}</span>
      <span className="truncate">{children}</span>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/5 bg-white/[0.02] px-3 py-2">
      <div className="text-white/40 uppercase tracking-wider">{label}</div>
      <div className="text-white/85 mt-0.5 truncate">{value}</div>
    </div>
  );
}

function relative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
