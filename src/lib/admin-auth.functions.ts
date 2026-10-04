import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const DEMO_EMAIL = "admin@insightaiconsultancy.com";
const DEMO_PASSWORD = "InsightAI2025!";

/**
 * Idempotent seed: creates the demo admin auth user if it doesn't exist
 * and grants it the 'admin' role. Used once from the login page.
 * Public (no auth) — safe because it only creates a single well-known
 * account with a fixed email and grants it admin. Running it twice is a no-op.
 */
export const seedDemoAdmin = createServerFn({ method: "POST" }).handler(
  async () => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    // Look up existing user by email
    let userId: string | null = null;
    const { data: list, error: listErr } =
      await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (listErr) throw new Error(listErr.message);
    const existing = list.users.find(
      (u) => (u.email ?? "").toLowerCase() === DEMO_EMAIL,
    );

    if (existing) {
      userId = existing.id;
      // Ensure password + confirmed
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: DEMO_PASSWORD,
        email_confirm: true,
      });
    } else {
      const { data: created, error: createErr } =
        await supabaseAdmin.auth.admin.createUser({
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
          email_confirm: true,
          user_metadata: { name: "Demo Admin" },
        });
      if (createErr) throw new Error(createErr.message);
      userId = created.user!.id;
    }

    // Grant admin role (idempotent — unique(user_id, role))
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .upsert(
        { user_id: userId!, role: "admin" },
        { onConflict: "user_id,role" },
      );
    if (roleErr) throw new Error(roleErr.message);

    return { ok: true, email: DEMO_EMAIL, password: DEMO_PASSWORD };
  },
);

/**
 * Verifies the caller is a signed-in admin. Returns { isAdmin, userId, email }.
 */
export const whoAmI = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error(error.message);
    return {
      isAdmin: !!data,
      userId: context.userId,
      email: (context.claims as { email?: string })?.email ?? null,
    };
  });
