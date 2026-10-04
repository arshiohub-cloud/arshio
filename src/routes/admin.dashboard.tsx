import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Users,
  TrendingUp,
  Trophy,
  Percent,
  ArrowRight,
  RefreshCw,
  Mail,
} from "lucide-react";
import { AdminShell, AdminCard } from "@/components/admin/AdminShell";
import { leadStats, listAuditBookings } from "@/lib/admin-leads.functions";
import { CalendarCheck } from "lucide-react";


export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — InsightAI Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Dashboard,
});

const INDIGO = "#6C63FF";
const CYAN = "#00D4FF";
const TEAL = "#1D9E75";
const AMBER = "#F59E0B";

type Stats = Awaited<ReturnType<typeof leadStats>>;

function Dashboard() {
  const load = useServerFn(leadStats);
  const loadBookings = useServerFn(listAuditBookings);
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState<
    Array<{
      id: string;
      created_at: string;
      name: string;
      email: string;
      company: string | null;
      requested_slot: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await load();
      setStats(s);
      try {
        const b = await loadBookings();
        setBookings(b.rows);
      } catch {
        setBookings([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminShell title="Dashboard">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Overview</h2>
          <p className="text-xs text-white/50 mt-0.5">
            Real-time snapshot of your lead pipeline.
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-md border border-white/10 hover:border-white/25 hover:bg-white/5 text-white/80 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Kpi
          icon={<Users className="w-4 h-4" />}
          label="Total leads"
          value={stats?.total ?? 0}
          color={INDIGO}
        />
        <Kpi
          icon={<TrendingUp className="w-4 h-4" />}
          label="New this week"
          value={stats?.newThisWeek ?? 0}
          color={CYAN}
        />
        <Kpi
          icon={<Trophy className="w-4 h-4" />}
          label="Won"
          value={stats?.won ?? 0}
          color={TEAL}
        />
        <Kpi
          icon={<Percent className="w-4 h-4" />}
          label="Conversion"
          value={stats?.conversion ?? 0}
          suffix="%"
          color={AMBER}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AdminCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Leads · last 30 days</h3>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer>
              <AreaChart data={stats?.trend ?? []}>
                <defs>
                  <linearGradient id="leadGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={INDIGO} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={INDIGO} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  tickFormatter={(d: string) => d.slice(5)}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,18,30,0.95)",
                    border: "0.5px solid rgba(255,255,255,0.12)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={INDIGO}
                  strokeWidth={2}
                  fill="url(#leadGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <h3 className="text-sm font-semibold mb-4">By status</h3>
          <div className="space-y-3">
            {Object.entries(stats?.byStatus ?? {}).map(([status, count]) => (
              <StatusBar
                key={status}
                label={status}
                count={count}
                total={stats?.total ?? 0}
              />
            ))}
            {!stats && (
              <div className="text-xs text-white/40">No data yet.</div>
            )}
          </div>
        </AdminCard>
      </div>

      <AdminCard className="p-5 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Latest leads</h3>
          <Link
            to="/admin/leads"
            className="text-xs text-[#00D4FF] hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {stats && stats.latest.length > 0 ? (
          <div className="divide-y divide-white/5">
            {stats.latest.map((l) => (
              <div
                key={l.created_at}
                className="py-3 flex items-center gap-3 text-sm"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#6C63FF,#00D4FF)",
                  }}
                >
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate">
                    <span className="font-medium">
                      {(l as { name?: string }).name ?? "—"}
                    </span>
                    <span className="text-white/40">
                      {" · "}
                      {(l as { type?: string }).type ?? "contact"}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/50">
                    {new Date(l.created_at as string).toLocaleString()}
                  </div>
                </div>
                <StatusPill status={(l as { status: string }).status} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-white/40 py-6 text-center">
            No leads yet. Submissions from the contact form will appear here.
          </div>
        )}
      </AdminCard>

      <AdminCard className="p-5 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">AI audit calls booked by Aria</h3>
          <span className="text-[11px] text-white/40">Voice concierge</span>
        </div>
        {bookings.length > 0 ? (
          <div className="divide-y divide-white/5">
            {bookings.map((b) => (
              <div key={b.id} className="py-3 flex items-start gap-3 text-sm">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg,#1D9E75,#00D4FF)" }}
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate">
                    <span className="font-medium">{b.name}</span>
                    <span className="text-white/40">{" · "}{b.email}</span>
                  </div>
                  <div className="text-[11px] text-white/60">
                    Requested slot: {b.requested_slot}
                    {b.company ? ` · ${b.company}` : ""}
                  </div>
                  <div className="text-[11px] text-white/40">
                    {new Date(b.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-white/40 py-6 text-center">
            No voice bookings yet. Calls Aria books on the website appear here.
          </div>
        )}
      </AdminCard>



    </AdminShell>
  );
}

function Kpi({
  icon,
  label,
  value,
  suffix,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  color: string;
}) {
  return (
    <AdminCard className="p-4">
      <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
      <div className="text-2xl font-bold tracking-tight">
        {value}
        {suffix && <span className="text-sm text-white/50">{suffix}</span>}
      </div>
    </AdminCard>
  );
}

function StatusBar({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="capitalize text-white/70">{label.replace("_", " ")}</span>
        <span className="text-white/50">
          {count} <span className="text-white/30">({pct}%)</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#6C63FF,#00D4FF)",
          }}
        />
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    new: { bg: "rgba(108,99,255,0.15)", fg: "#8B85FF" },
    in_progress: { bg: "rgba(0,212,255,0.15)", fg: "#00D4FF" },
    won: { bg: "rgba(29,158,117,0.15)", fg: "#22C58A" },
    lost: { bg: "rgba(239,68,68,0.15)", fg: "#F87171" },
    spam: { bg: "rgba(148,163,184,0.15)", fg: "#94A3B8" },
  };
  const c = map[status] ?? map.new;
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full capitalize"
      style={{
        background: c.bg,
        color: c.fg,
        border: `0.5px solid ${c.fg}40`,
      }}
    >
      {status.replace("_", " ")}
    </span>
  );
}
