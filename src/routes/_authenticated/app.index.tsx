import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Circle,
  MessageSquare,
  Calendar,
  Rocket,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { getMyDashboard, seedMyDemoEngagement } from "@/lib/engagements.functions";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({
    meta: [
      { title: "My Dashboard — InsightAI" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppHome,
});

const serviceLabel: Record<string, string> = {
  audit: "Free AI Audit",
  consulting: "AI Consulting",
  rag: "RAG Knowledge Base",
  automation: "Workflow Automation",
  agent: "AI Agent",
  custom: "Custom Build",
};

const statusLabel: Record<string, string> = {
  pending: "Getting started",
  active: "In progress",
  delivered: "Delivered",
  closed: "Closed",
};

const statusStyle: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  active: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  delivered: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  closed: "bg-white/5 text-white/60 border-white/10",
};

function AppHome() {
  const fetchDash = useServerFn(getMyDashboard);
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("there");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email ?? "";
      if (email) setFirstName(email.split("@")[0].split(".")[0]);
    });
    fetchDash()
      .then(setData)
      .catch((e) => setErr(e.message));
  }, [fetchDash]);

  if (!data) {
    return (
      <AppShell title="Home">
        {err ? (
          <div className="text-sm text-red-400">{err}</div>
        ) : (
          <div className="text-sm text-white/50">Loading your workspace…</div>
        )}
      </AppShell>
    );
  }

  const { engagements, milestones, updates } = data;
  const titleOf = (id: string) =>
    engagements.find((e: any) => e.id === id)?.title ?? "";

  if (engagements.length === 0) {
    return (
      <AppShell title="Home">
        <div className="max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <Sparkles className="w-8 h-8 mx-auto text-white/50" />
          <h2 className="mt-3 text-xl font-semibold">Welcome to InsightAI</h2>
          <p className="mt-2 text-sm text-white/60">
            Your workspace is ready. Book a free 30-minute AI audit and our team
            will create your first project here — or load a demo to explore.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-medium"
            >
              Book AI Audit <ArrowRight className="w-4 h-4" />
            </Link>
            <LoadDemoButton onDone={() => window.location.reload()} />
          </div>
        </div>
      </AppShell>
    );
  }

  const upcoming = milestones
    .filter((m: any) => !m.done)
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .slice(0, 5);

  const recent = updates.slice(0, 4);

  return (
    <AppShell title="Home">
      <div className="max-w-6xl space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-semibold capitalize">
            Hi {firstName} 👋
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Here's a quick look at your work with our team.
          </p>
        </div>

        {/* Projects — friendly card row */}
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">
              Your projects
            </h2>
            <span className="text-xs text-white/40">
              {engagements.length} total
            </span>
          </div>
          <div className="mt-3 grid md:grid-cols-2 gap-4">
            {engagements.map((e: any) => {
              const ms = milestones.filter((m: any) => m.engagement_id === e.id);
              const done = ms.filter((m: any) => m.done).length;
              const pct = ms.length ? Math.round((done / ms.length) * 100) : 0;
              return (
                <Link
                  key={e.id}
                  to="/app/engagements/$id"
                  params={{ id: e.id }}
                  className="group block rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 p-5 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-white/50">
                        {serviceLabel[e.service_type] ?? e.service_type}
                      </div>
                      <div className="mt-1 font-medium truncate text-white">
                        {e.title}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${statusStyle[e.status]}`}
                    >
                      {statusLabel[e.status] ?? e.status}
                    </span>
                  </div>

                  {e.summary && (
                    <p className="mt-2 text-xs text-white/60 line-clamp-2">
                      {e.summary}
                    </p>
                  )}

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-white/60 mb-1.5">
                      <span>Progress</span>
                      <span className="tabular-nums text-white/80">
                        {done} of {ms.length || 0} done · {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 inline-flex items-center gap-1 text-xs text-white/60 group-hover:text-white">
                    Open project
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Two-column: Next steps + Recent activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/60" />
              <h2 className="font-semibold">What's next</h2>
            </div>
            <p className="text-xs text-white/50 mt-1">
              The next steps our team is working on for you.
            </p>
            <ul className="mt-4 space-y-3">
              {upcoming.length === 0 && (
                <li className="text-sm text-white/50">
                  You're all caught up — nothing pending right now.
                </li>
              )}
              {upcoming.map((m: any) => (
                <li key={m.id} className="flex items-start gap-3 text-sm">
                  <Circle className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-white/90">{m.label}</div>
                    <Link
                      to="/app/engagements/$id"
                      params={{ id: m.engagement_id }}
                      className="text-xs text-white/50 hover:text-white/80 truncate block"
                    >
                      {titleOf(m.engagement_id)}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-white/60" />
              <h2 className="font-semibold">Recent activity</h2>
            </div>
            <p className="text-xs text-white/50 mt-1">
              Latest updates from your team.
            </p>
            <ul className="mt-4 space-y-3">
              {recent.length === 0 && (
                <li className="text-sm text-white/50">
                  No updates yet — check back soon.
                </li>
              )}
              {recent.map((u: any) => (
                <li
                  key={u.id}
                  className="rounded-lg border border-white/10 bg-white/[0.02] p-3"
                >
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <Link
                      to="/app/engagements/$id"
                      params={{ id: u.engagement_id }}
                      className="hover:text-white/80 truncate"
                    >
                      {titleOf(u.engagement_id)}
                    </Link>
                    <span>
                      {new Date(u.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/85 whitespace-pre-wrap line-clamp-3">
                    {u.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Quick actions */}
        <section className="grid sm:grid-cols-2 gap-3">
          <Link
            to="/app/messages"
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] p-4 transition"
          >
            <MessageSquare className="w-4 h-4 text-white/70" />
            <div className="text-sm">
              <div className="font-medium">Message your team</div>
              <div className="text-xs text-white/50">
                Ask a question or share context
              </div>
            </div>
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] p-4 transition"
          >
            <Sparkles className="w-4 h-4 text-white/70" />
            <div className="text-sm">
              <div className="font-medium">Start a new project</div>
              <div className="text-xs text-white/50">
                Book a free 30-min AI audit
              </div>
            </div>
          </Link>
        </section>
      </div>
    </AppShell>
  );
}

function LoadDemoButton({ onDone }: { onDone: () => void }) {
  const seed = useServerFn(seedMyDemoEngagement);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setErr(null);
    try {
      await seed();
      onDone();
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load demo data");
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={run}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        <Sparkles className="w-4 h-4" />
        {busy ? "Loading demo…" : "Load demo data"}
      </button>
      {err && <div className="text-xs text-red-400">{err}</div>}
    </div>
  );
}
