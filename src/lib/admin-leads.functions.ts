import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const STATUSES = ["new", "in_progress", "won", "lost", "spam"] as const;
export type LeadStatus = (typeof STATUSES)[number];

async function assertAdmin(
  supabase: import("@supabase/supabase-js").SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const listLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      status?: LeadStatus | "all";
      search?: string;
      limit?: number;
      offset?: number;
    }) => ({
      status: input.status ?? "all",
      search: input.search?.trim() ?? "",
      limit: Math.min(Math.max(input.limit ?? 50, 1), 200),
      offset: Math.max(input.offset ?? 0, 0),
    }),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    let q = context.supabase
      .from("leads")
      .select(
        "id, name, email, phone, company, message, type, status, source_page, created_at, read_at, notes, converted_engagement_id",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(data.offset, data.offset + data.limit - 1);
    if (data.status !== "all") q = q.eq("status", data.status);
    if (data.search) {
      const s = `%${data.search.replace(/[%_]/g, "\\$&")}%`;
      q = q.or(
        `name.ilike.${s},email.ilike.${s},company.ilike.${s},message.ilike.${s}`,
      );
    }
    const { data: rows, error, count } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [], total: count ?? 0 };
  });

export const updateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      id: string;
      status?: LeadStatus;
      notes?: string;
      markRead?: boolean;
    }) => input,
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const patch: {
      status?: LeadStatus;
      notes?: string;
      read_at?: string;
    } = {};
    if (data.status) patch.status = data.status;
    if (typeof data.notes === "string") patch.notes = data.notes;
    if (data.markRead) patch.read_at = new Date().toISOString();
    const { error } = await context.supabase
      .from("leads")
      .update(patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("leads")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const leadStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: rows, error } = await context.supabase
      .from("leads")
      .select("status, created_at, type")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const total = rows.length;
    const byStatus: Record<string, number> = {};
    for (const s of STATUSES) byStatus[s] = 0;
    let newThisWeek = 0;
    let won = 0;
    const dayBuckets: Record<string, number> = {};
    const now = Date.now();
    const weekAgo = now - 7 * 86400_000;

    // last 30 days buckets
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400_000).toISOString().slice(0, 10);
      dayBuckets[d] = 0;
    }

    for (const r of rows) {
      byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
      const t = new Date(r.created_at).getTime();
      if (t >= weekAgo) newThisWeek++;
      if (r.status === "won") won++;
      const day = new Date(r.created_at).toISOString().slice(0, 10);
      if (day in dayBuckets) dayBuckets[day]++;
    }

    const conversion = total > 0 ? Math.round((won / total) * 1000) / 10 : 0;
    const trend = Object.entries(dayBuckets).map(([date, count]) => ({
      date,
      count,
    }));
    const latest = rows.slice(0, 5);

    return {
      total,
      newThisWeek,
      won,
      conversion,
      byStatus,
      trend,
      latest,
    };
  });

export const listAuditBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("audit_bookings")
      .select("id, created_at, name, email, company, phone, requested_slot, scheduled_at, timezone, notes, source, lead_id")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });
