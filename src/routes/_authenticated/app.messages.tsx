import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { listMyEngagements } from "@/lib/engagements.functions";
import { MessageSquare, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/messages")({
  head: () => ({ meta: [{ title: "Messages — InsightAI" }, { name: "robots", content: "noindex" }] }),
  component: Messages,
});

function Messages() {
  const fetchList = useServerFn(listMyEngagements);
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    fetchList().then(setList).catch(console.error);
  }, [fetchList]);
  return (
    <AppShell title="Messages">
      <div className="max-w-3xl">
        <p className="text-sm text-white/60">
          Pick an engagement to open its message thread with our team.
        </p>
        <div className="mt-6 space-y-2">
          {list.map((e) => (
            <Link
              key={e.id}
              to="/app/engagements/$id"
              params={{ id: e.id }}
              className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-white/50" />
                <span className="font-medium">{e.title}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-white/40" />
            </Link>
          ))}
          {list.length === 0 && (
            <p className="text-sm text-white/50">No engagements yet — no threads to show.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
