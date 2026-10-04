import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const uuid = z.string().uuid();

export const listMyEngagements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("engagements")
      .select("id, service_type, title, summary, status, created_at, updated_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const getEngagement = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: uuid }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: eng, error } = await context.supabase
      .from("engagements")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    if (!eng) throw new Error("Not found");

    const [updates, milestones, messages, files] = await Promise.all([
      context.supabase
        .from("engagement_updates")
        .select("id, body, created_at, author_id")
        .eq("engagement_id", data.id)
        .order("created_at", { ascending: false }),
      context.supabase
        .from("engagement_milestones")
        .select("id, label, done, sort_order")
        .eq("engagement_id", data.id)
        .order("sort_order", { ascending: true }),
      context.supabase
        .from("engagement_messages")
        .select("id, body, author_id, created_at")
        .eq("engagement_id", data.id)
        .order("created_at", { ascending: true }),
      context.supabase
        .from("engagement_files")
        .select("id, filename, storage_path, uploaded_by, created_at")
        .eq("engagement_id", data.id)
        .order("created_at", { ascending: false }),
    ]);
    return {
      engagement: eng,
      updates: updates.data ?? [],
      milestones: milestones.data ?? [],
      messages: messages.data ?? [],
      files: files.data ?? [],
    };
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ engagementId: uuid, body: z.string().min(1).max(4000) }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("engagement_messages").insert({
      engagement_id: data.engagementId,
      author_id: context.userId,
      body: data.body,
    });
    if (error) throw error;
    return { ok: true };
  });

// ---------- Admin ----------

async function ensureAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

export const adminListEngagements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { data, error } = await context.supabase
      .from("engagements")
      .select("id, user_id, service_type, title, status, created_at, updated_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    if (error) throw error;
    return data.users.map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
    }));
  });

const serviceType = z.enum(["audit", "consulting", "rag", "automation", "agent", "custom"]);
const engagementStatus = z.enum(["pending", "active", "delivered", "closed"]);

export const adminCreateEngagement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        userId: uuid,
        serviceType,
        title: z.string().min(1).max(200),
        summary: z.string().max(2000).optional(),
        leadId: uuid.optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { data: eng, error } = await context.supabase
      .from("engagements")
      .insert({
        user_id: data.userId,
        service_type: data.serviceType,
        title: data.title,
        summary: data.summary ?? null,
      })
      .select("id")
      .single();
    if (error) throw error;
    if (data.leadId) {
      await context.supabase
        .from("leads")
        .update({ converted_engagement_id: eng.id })
        .eq("id", data.leadId);
    }
    return { id: eng.id };
  });

export const adminUpdateEngagement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        id: uuid,
        title: z.string().min(1).max(200).optional(),
        summary: z.string().max(2000).optional(),
        status: engagementStatus.optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("engagements").update(patch).eq("id", id);
    if (error) throw error;
    return { ok: true };
  });

export const adminAddUpdate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ engagementId: uuid, body: z.string().min(1).max(4000) }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase
      .from("engagement_updates")
      .insert({ engagement_id: data.engagementId, author_id: context.userId, body: data.body });
    if (error) throw error;
    return { ok: true };
  });

export const adminAddMilestone = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ engagementId: uuid, label: z.string().min(1).max(200), sort_order: z.number().int().default(0) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase.from("engagement_milestones").insert({
      engagement_id: data.engagementId,
      label: data.label,
      sort_order: data.sort_order,
    });
    if (error) throw error;
    return { ok: true };
  });

export const adminToggleMilestone = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: uuid, done: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { error } = await context.supabase
      .from("engagement_milestones")
      .update({ done: data.done })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ---------- Dashboard aggregate + AI summary ----------

export const getMyDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: engagements, error: engErr } = await context.supabase
      .from("engagements")
      .select("id, service_type, title, summary, status, created_at, updated_at")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false });
    if (engErr) throw engErr;

    const ids = (engagements ?? []).map((e) => e.id);
    if (ids.length === 0) {
      return { engagements: [], milestones: [], updates: [], stats: { total: 0, active: 0, delivered: 0, openMilestones: 0 } };
    }

    const [milestonesRes, updatesRes] = await Promise.all([
      context.supabase
        .from("engagement_milestones")
        .select("id, engagement_id, label, done, sort_order")
        .in("engagement_id", ids)
        .order("sort_order", { ascending: true }),
      context.supabase
        .from("engagement_updates")
        .select("id, engagement_id, body, created_at")
        .in("engagement_id", ids)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);
    if (milestonesRes.error) throw milestonesRes.error;
    if (updatesRes.error) throw updatesRes.error;

    const milestones = milestonesRes.data ?? [];
    const updates = updatesRes.data ?? [];

    return {
      engagements: engagements ?? [],
      milestones,
      updates,
      stats: {
        total: engagements?.length ?? 0,
        active: engagements?.filter((e) => e.status === "active").length ?? 0,
        delivered: engagements?.filter((e) => e.status === "delivered").length ?? 0,
        openMilestones: milestones.filter((m) => !m.done).length,
      },
    };
  });

export const generateProgressSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured");

    const { data: engagements } = await context.supabase
      .from("engagements")
      .select("id, service_type, title, status, summary")
      .eq("user_id", context.userId);

    if (!engagements || engagements.length === 0) {
      return { summary: "You don't have any active engagements yet. Book a free AI audit to get started." };
    }

    const ids = engagements.map((e) => e.id);
    const [msRes, upRes] = await Promise.all([
      context.supabase
        .from("engagement_milestones")
        .select("engagement_id, label, done")
        .in("engagement_id", ids),
      context.supabase
        .from("engagement_updates")
        .select("engagement_id, body, created_at")
        .in("engagement_id", ids)
        .order("created_at", { ascending: false })
        .limit(15),
    ]);

    const context_text = engagements
      .map((e) => {
        const ms = (msRes.data ?? []).filter((m) => m.engagement_id === e.id);
        const ups = (upRes.data ?? []).filter((u) => u.engagement_id === e.id).slice(0, 3);
        const done = ms.filter((m) => m.done).length;
        return [
          `Engagement: ${e.title} (${e.service_type}, status: ${e.status})`,
          e.summary ? `Scope: ${e.summary}` : "",
          `Milestones: ${done}/${ms.length} done. Open: ${ms.filter((m) => !m.done).map((m) => m.label).join("; ") || "none"}`,
          ups.length ? `Recent updates: ${ups.map((u) => `- ${u.body}`).join(" ")}` : "",
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");

    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway("google/gemini-3.6-flash"),
      system:
        "You are a friendly client-success assistant at InsightAI Consultancy. Summarize the client's project progress in 3 short bullet points: what's been delivered, what's in flight, and the next milestone. Keep it under 90 words total, warm and specific. No preamble.",
      prompt: context_text,
    });

    return { summary: text.trim() };
  });

// ---------- Demo seeding for the current signed-in user ----------

export const seedMyDemoEngagement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const userId = context.userId;
    const DEMO_TITLE = "Demo Engagement — Sales Automation Pilot";

    const { data: existing } = await supabaseAdmin
      .from("engagements")
      .select("id")
      .eq("user_id", userId)
      .eq("title", DEMO_TITLE)
      .maybeSingle();
    if (existing) return { ok: true, engagementId: existing.id, created: false };

    // Pick an admin as author of updates/messages; fall back to the user.
    const { data: adminRow } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .limit(1)
      .maybeSingle();
    const adminId = adminRow?.user_id ?? userId;

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

    await supabaseAdmin.from("engagement_milestones").insert([
      { engagement_id: eng.id, label: "Discovery workshop", done: true, sort_order: 1 },
      { engagement_id: eng.id, label: "Data source audit & mapping", done: true, sort_order: 2 },
      { engagement_id: eng.id, label: "Automation pipeline build", done: false, sort_order: 3 },
      { engagement_id: eng.id, label: "AI outreach drafting layer", done: false, sort_order: 4 },
      { engagement_id: eng.id, label: "UAT & handover", done: false, sort_order: 5 },
    ]);
    await supabaseAdmin.from("engagement_updates").insert([
      { engagement_id: eng.id, author_id: adminId, body: "Kickoff complete. Documented current lead flow, identified 3 automation opportunities across HubSpot + Slack." },
      { engagement_id: eng.id, author_id: adminId, body: "Data mapping approved. Moving into build phase — first pipeline (form → enrichment → CRM) live in staging by end of week." },
      { engagement_id: eng.id, author_id: adminId, body: "AI drafting prototype ready for review. You'll see suggested outreach drafts pinned to each new lead." },
    ]);
    await supabaseAdmin.from("engagement_messages").insert({
      engagement_id: eng.id,
      author_id: adminId,
      body: "Welcome to your InsightAI workspace 👋  Use this thread anytime — questions, feedback, or new requests.",
    });

    return { ok: true, engagementId: eng.id, created: true };
  });

// ---------- Lead → Client conversion ----------

export const adminConvertLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        leadId: uuid,
        serviceType,
        title: z.string().min(1).max(200),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);

    const { data: lead, error: leadErr } = await context.supabase
      .from("leads")
      .select("id, name, email, company, message, converted_engagement_id")
      .eq("id", data.leadId)
      .maybeSingle();
    if (leadErr) throw leadErr;
    if (!lead) throw new Error("Lead not found");
    if (lead.converted_engagement_id)
      throw new Error("This lead is already converted to a client project.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Find existing user by email, otherwise create one.
    const email = String(lead.email).toLowerCase();
    const { data: userList, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000,
    });
    if (listErr) throw listErr;
    let user = userList.users.find((u) => (u.email ?? "").toLowerCase() === email) ?? null;

    let tempPassword: string | null = null;
    if (!user) {
      tempPassword = `IA-${Math.random().toString(36).slice(2, 8)}-${Math.random()
        .toString(36)
        .slice(2, 6)}`;
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { full_name: lead.name, company: lead.company },
      });
      if (createErr) throw createErr;
      user = created.user;
    }
    if (!user) throw new Error("Could not create client account");

    const { data: eng, error: engErr } = await context.supabase
      .from("engagements")
      .insert({
        user_id: user.id,
        service_type: data.serviceType,
        title: data.title,
        summary: lead.message?.slice(0, 500) ?? null,
        status: "pending",
      })
      .select("id")
      .single();
    if (engErr) throw engErr;

    const starter = [
      "Kickoff call scheduled",
      "Discovery & requirements",
      "Solution design",
      "Build & review",
      "Handover",
    ];
    await context.supabase.from("engagement_milestones").insert(
      starter.map((label, i) => ({
        engagement_id: eng.id,
        label,
        sort_order: i,
      })),
    );

    await context.supabase.from("engagement_updates").insert({
      engagement_id: eng.id,
      author_id: context.userId,
      body: `Project created from your inquiry. We'll confirm your kickoff call shortly.`,
    });

    await context.supabase
      .from("leads")
      .update({ converted_engagement_id: eng.id, status: "won" })
      .eq("id", lead.id);

    return {
      engagementId: eng.id,
      email,
      tempPassword,
      accountCreated: Boolean(tempPassword),
    };
  });
