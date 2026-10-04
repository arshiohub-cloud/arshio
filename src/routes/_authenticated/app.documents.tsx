import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/_authenticated/app/documents")({
  head: () => ({ meta: [{ title: "Documents — InsightAI" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <AppShell title="Documents">
      <p className="text-sm text-white/60 max-w-xl">
        Files your team uploads appear here per engagement. Open any engagement from the dashboard
        to see its documents.
      </p>
    </AppShell>
  ),
});
