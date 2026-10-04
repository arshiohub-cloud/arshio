import { createServerFn } from "@tanstack/react-start";

const DEMO_EMAIL = "client@demo.com";
const DEMO_PASSWORD = "ClientDemo2025!";
const DEMO_TITLE = "Demo Engagement — Sales Automation Pilot";

/**
 * Idempotent seed: creates a demo client auth user AND a rich demo engagement
 * (milestones, updates, message) so both the client dashboard and admin
 * engagements screen have something meaningful to show.
 */
export const seedDemoClient = createServerFn({ method: "POST" }).handler(
  async () => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    // 1) Ensure the demo client user exists.
    const { data: list, error: listErr } =
      await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (listErr) throw new Error(listErr.message);
    const existing = list.users.find(
      (u) => (u.email ?? "").toLowerCase() === DEMO_EMAIL,
    );

    let userId: string;
    if (existing) {
      await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password: DEMO_PASSWORD,
        email_confirm: true,
      });
      userId = existing.id;
    } else {
      const { data: created, error: createErr } =
        await supabaseAdmin.auth.admin.createUser({
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
          email_confirm: true,
          user_metadata: { full_name: "Demo Client" },
        });
      if (createErr || !created.user) throw new Error(createErr?.message ?? "create failed");
      userId = created.user.id;
    }

    // 2) Find (or pick) an admin user to author updates/messages.
    const { data: adminRow } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .limit(1)
      .maybeSingle();
    const adminId = adminRow?.user_id ?? userId;

    // 3) Ensure a demo engagement exists for the client.
    const { data: existingEng } = await supabaseAdmin
      .from("engagements")
      .select("id")
      .eq("user_id", userId)
      .eq("title", DEMO_TITLE)
      .maybeSingle();

    let engagementId: string;
    if (existingEng) {
      engagementId = existingEng.id;
    } else {
      const { data: eng, error: engErr } = await supabaseAdmin
        .from("engagements")
        .insert({
          user_id: userId,
          service_type: "automation",
          title: DEMO_TITLE,
          summary:
            "End-to-end lead capture, enrichment, and CRM sync workflow with an AI-drafted outreach layer.",
          status: "active",
        })
        .select("id")
        .single();
      if (engErr || !eng) throw new Error(engErr?.message ?? "engagement failed");
      engagementId = eng.id;

      // Milestones
      await supabaseAdmin.from("engagement_milestones").insert([
        { engagement_id: engagementId, label: "Discovery workshop", done: true, sort_order: 1 },
        { engagement_id: engagementId, label: "Data source audit & mapping", done: true, sort_order: 2 },
        { engagement_id: engagementId, label: "Automation pipeline build", done: false, sort_order: 3 },
        { engagement_id: engagementId, label: "AI outreach drafting layer", done: false, sort_order: 4 },
        { engagement_id: engagementId, label: "UAT & handover", done: false, sort_order: 5 },
      ]);

      // Updates (progress feed)
      await supabaseAdmin.from("engagement_updates").insert([
        {
          engagement_id: engagementId,
          author_id: adminId,
          body: "Kickoff complete. Documented current lead flow, identified 3 automation opportunities across HubSpot + Slack.",
        },
        {
          engagement_id: engagementId,
          author_id: adminId,
          body: "Data mapping approved. Moving into build phase — first pipeline (form → enrichment → CRM) live in staging by end of week.",
        },
        {
          engagement_id: engagementId,
          author_id: adminId,
          body: "AI drafting prototype ready for review. You'll see suggested outreach drafts pinned to each new lead.",
        },
      ]);

      // Welcome message
      await supabaseAdmin.from("engagement_messages").insert({
        engagement_id: engagementId,
        author_id: adminId,
        body: "Welcome to your InsightAI workspace 👋  Use this thread anytime — questions, feedback, or new requests.",
      });
    }

    return {
      ok: true,
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      engagementId,
    };
  },
);
