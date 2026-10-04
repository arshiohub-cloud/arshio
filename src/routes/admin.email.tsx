import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Mail,
  Send,
  Sparkles,
  Wand2,
  FileText,
  Inbox,
  FileEdit,
  LayoutTemplate,
} from "lucide-react";
import { AdminShell, AdminCard } from "@/components/admin/AdminShell";
import { writeEmail, suggestSubjects } from "@/lib/admin-ai.functions";

type EmailSearch = { to?: string; name?: string; context?: string };

export const Route = createFileRoute("/admin/email")({
  head: () => ({
    meta: [
      { title: "Email — InsightAI Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): EmailSearch => ({
    to: typeof s.to === "string" ? s.to : undefined,
    name: typeof s.name === "string" ? s.name : undefined,
    context: typeof s.context === "string" ? s.context : undefined,
  }),
  component: EmailPage,
});


type FolderKey = "inbox" | "sent" | "drafts" | "templates";

const FOLDERS: { key: FolderKey; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
  { key: "inbox", label: "Inbox", icon: Inbox, count: 14 },
  { key: "sent", label: "Sent", icon: Send },
  { key: "drafts", label: "Drafts", icon: FileEdit, count: 3 },
  { key: "templates", label: "Templates", icon: LayoutTemplate },
];

type Template = {
  id: string;
  name: string;
  subject: string;
  body: string;
};

const TEMPLATES: Template[] = [
  {
    id: "follow-up",
    name: "Lead Follow-Up",
    subject: "Following up on your inquiry with InsightAI",
    body: "Hi {name},\n\nThanks for reaching out to InsightAI Consultancy. I've reviewed your message and would love to schedule a 30-minute call to discuss how our AI services can help {company}.\n\nDo any of these times work?\n- Tomorrow 2pm ET\n- Thursday 10am ET\n\nBest,\nThe InsightAI Team",
  },
  {
    id: "audit-confirm",
    name: "Audit Confirmation",
    subject: "Your AI Audit is confirmed",
    body: "Hi {name},\n\nYour complimentary 30-minute AI Audit is confirmed. We'll walk through your workflows, identify top AI opportunities, and deliver a quick-win roadmap on the call.\n\nSee you soon,\nThe InsightAI Team",
  },
  {
    id: "proposal",
    name: "Proposal Ready",
    subject: "Your custom AI proposal is ready",
    body: "Hi {name},\n\nAttached is the custom AI implementation proposal for {company}. Happy to walk through it live — reply with a time that works.\n\nThe InsightAI Team",
  },
  {
    id: "project-update",
    name: "Project Update",
    subject: "Weekly project update — {project}",
    body: "Hi {name},\n\nQuick update on {project}:\n\n• Milestone 1 complete\n• Model accuracy: 96%\n• Next: production rollout\n\nQuestions? Just reply.\n\nThe InsightAI Team",
  },
  {
    id: "launch",
    name: "Launch Announcement",
    subject: "🚀 Your AI system is live",
    body: "Hi {name},\n\n{project} is now live in production. Dashboard access, docs, and support channel details are attached.\n\nThe InsightAI Team",
  },
  {
    id: "retainer",
    name: "Retainer Check-in",
    subject: "Monthly check-in from InsightAI",
    body: "Hi {name},\n\nQuick monthly retainer check-in — any new AI initiatives, model tuning needs, or workflows you'd like us to explore?\n\nThe InsightAI Team",
  },
];

function EmailPage() {
  const search = Route.useSearch();
  const [folder, setFolder] = useState<FolderKey>("templates");
  const [selectedTpl, setSelectedTpl] = useState<Template>(TEMPLATES[0]);

  return (
    <AdminShell title="Email">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        <Kpi label="Emails sent" value="284" tint="#6C63FF" />
        <Kpi label="Open rate" value="64%" tint="#00D4FF" />
        <Kpi label="Templates" value={String(TEMPLATES.length)} tint="#F59E0B" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_360px] gap-4">
        {/* Folders */}
        <AdminCard className="p-3 h-max">
          <nav className="space-y-1">
            {FOLDERS.map((f) => {
              const Icon = f.icon;
              const active = f.key === folder;
              return (
                <button
                  key={f.key}
                  onClick={() => setFolder(f.key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition ${
                    active
                      ? "text-white"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                  style={
                    active
                      ? {
                          background:
                            "linear-gradient(90deg, rgba(108,99,255,0.2), rgba(0,212,255,0.06))",
                          boxShadow: "inset 0 0 0 0.5px rgba(108,99,255,0.35)",
                        }
                      : undefined
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{f.label}</span>
                  {f.count != null && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60">
                      {f.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </AdminCard>

        {/* Center list */}
        <div className="min-w-0">
          {folder === "templates" && (
            <TemplatesList
              selected={selectedTpl}
              onSelect={setSelectedTpl}
            />
          )}
          {(folder === "inbox" || folder === "sent" || folder === "drafts") && (
            <AdminCard className="p-8 text-center text-sm text-white/50">
              <Mail className="w-8 h-8 mx-auto mb-3 text-white/30" />
              {folder === "inbox" && "Inbox integration coming soon — connect your mailbox in Settings."}
              {folder === "sent" && "Sent emails will appear here."}
              {folder === "drafts" && "Your saved drafts will appear here."}
            </AdminCard>
          )}
        </div>

        {/* Compose */}
        <Compose template={selectedTpl} prefill={search} />
      </div>
    </AdminShell>

  );
}

function Kpi({ label, value, tint }: { label: string; value: string; tint: string }) {
  return (
    <AdminCard className="p-4">
      <div className="text-[11px] uppercase tracking-wider text-white/50 mb-1" style={{ color: tint + "cc" }}>
        {label}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </AdminCard>
  );
}

function TemplatesList({
  selected,
  onSelect,
}: {
  selected: Template;
  onSelect: (t: Template) => void;
}) {
  return (
    <AdminCard className="p-3">
      <div className="flex items-center justify-between px-2 py-1 mb-1">
        <h3 className="text-sm font-semibold">Templates</h3>
        <button className="text-xs text-[#00D4FF] hover:underline">+ New template</button>
      </div>
      <div className="space-y-1.5">
        {TEMPLATES.map((t) => {
          const active = t.id === selected.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className={`w-full text-left px-3 py-3 rounded-md border transition ${
                active
                  ? "border-[#6C63FF]/60 bg-[#6C63FF]/10"
                  : "border-white/5 hover:border-white/15 hover:bg-white/5"
              }`}
            >
              <div className="font-medium text-sm truncate">{t.name}</div>
              <div className="text-[11px] text-white/50 truncate mt-0.5">
                {t.subject}
              </div>
            </button>
          );
        })}
      </div>
    </AdminCard>
  );
}

function Compose({ template, prefill }: { template: Template; prefill?: EmailSearch }) {
  const write = useServerFn(writeEmail);
  const subjectFn = useServerFn(suggestSubjects);
  const [to, setTo] = useState(prefill?.to ?? "");
  const [subject, setSubject] = useState(
    prefill?.name ? `Re: your inquiry with InsightAI` : template.subject,
  );
  const [body, setBody] = useState(
    prefill?.name
      ? `Hi ${prefill.name.split(" ")[0]},\n\nThanks for reaching out to InsightAI Consultancy. Regarding your note:\n\n> ${(prefill.context ?? "").slice(0, 400)}\n\n`
      : template.body,
  );
  const [goal, setGoal] = useState(
    prefill?.context ? `Reply to a lead about: ${prefill.context.slice(0, 200)}` : "",
  );
  const [subjects, setSubjects] = useState<string[]>([]);
  const [busy, setBusy] = useState<"" | "write" | "subject" | "send">("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);


  // sync when template changes
  useState(() => {
    setSubject(template.subject);
    setBody(template.body);
  });

  const usingTpl = () => {
    setSubject(template.subject);
    setBody(template.body);
  };

  const aiWrite = async () => {
    if (!goal.trim()) return;
    setBusy("write");
    setError(null);
    try {
      const res = await write({ data: { goal, recipient: to } });
      setBody(res.body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI failed");
    } finally {
      setBusy("");
    }
  };

  const aiSubjects = async () => {
    const ctx = goal.trim() || body.trim() || subject.trim();
    if (!ctx) return;
    setBusy("subject");
    setError(null);
    try {
      const res = await subjectFn({ data: { context: ctx } });
      setSubjects(res.subjects);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI failed");
    } finally {
      setBusy("");
    }
  };

  const send = () => {
    setBusy("send");
    setTimeout(() => {
      setBusy("");
      setSent(true);
      setTimeout(() => setSent(false), 1800);
    }, 600);
  };

  return (
    <AdminCard className="p-4 flex flex-col gap-3 h-max sticky top-20">
      <div className="flex items-center gap-2">
        <Wand2 className="w-4 h-4 text-[#00D4FF]" />
        <h3 className="text-sm font-semibold">Compose</h3>
        <button
          onClick={usingTpl}
          className="ml-auto text-[11px] text-white/50 hover:text-white"
        >
          Load "{template.name}"
        </button>
      </div>

      <Input label="To" value={to} onChange={setTo} placeholder="client@company.com" />
      <div>
        <Input label="Subject" value={subject} onChange={setSubject} />
        <button
          onClick={aiSubjects}
          disabled={busy === "subject"}
          className="text-[11px] text-[#00D4FF] hover:underline mt-1 inline-flex items-center gap-1 disabled:opacity-50"
        >
          <Sparkles className="w-3 h-3" />
          {busy === "subject" ? "Thinking…" : "Suggest subjects →"}
        </button>
        {subjects.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {subjects.map((s, i) => (
              <button
                key={i}
                onClick={() => setSubject(s)}
                className="text-[11px] px-2 py-1 rounded-full border border-white/10 hover:border-[#6C63FF]/60 hover:bg-[#6C63FF]/10"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="text-[11px] uppercase tracking-wider text-white/50">Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          className="mt-1 w-full text-sm rounded-md border border-white/10 bg-white/[0.03] p-3 focus:outline-none focus:border-[#6C63FF]/60 font-mono"
        />
      </div>

      <div className="rounded-md border border-white/10 bg-white/[0.02] p-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />
          <span className="text-[11px] uppercase tracking-wider text-white/60">
            AI Write Assist
          </span>
        </div>
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="What is the goal of this email?"
          className="w-full text-xs px-2.5 py-2 rounded-md border border-white/10 bg-white/[0.04] focus:outline-none focus:border-[#6C63FF]/60"
        />
        <button
          onClick={aiWrite}
          disabled={busy === "write" || !goal.trim()}
          className="mt-2 w-full text-xs py-2 rounded-md text-white font-medium disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#6C63FF,#00D4FF)" }}
        >
          {busy === "write" ? "Drafting…" : "Write with AI →"}
        </button>
      </div>

      {error && (
        <div className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-2.5 py-2">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={send}
          disabled={busy === "send" || !to.trim() || !subject.trim() || !body.trim()}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-md text-white text-sm font-medium disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#6C63FF,#00D4FF)" }}
        >
          <Send className="w-3.5 h-3.5" />
          {busy === "send" ? "Sending…" : sent ? "Sent" : "Send Now"}
        </button>
        <button className="px-3 py-2 rounded-md border border-white/10 text-white/80 hover:border-white/25 text-sm inline-flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Schedule
        </button>
      </div>
      {sent && (
        <div className="text-[11px] text-emerald-400 text-center">
          Demo: sending is stubbed — connect an email provider in Settings to enable.
        </div>
      )}
    </AdminCard>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-white/50">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full text-sm px-3 py-2 rounded-md border border-white/10 bg-white/[0.03] focus:outline-none focus:border-[#6C63FF]/60"
      />
    </label>
  );
}
