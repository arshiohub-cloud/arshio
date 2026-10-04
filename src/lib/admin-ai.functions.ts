import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

async function assertAdmin(
  supabase: import("@supabase/supabase-js").SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

function gateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  return createLovableAiGatewayProvider(key);
}

/** AI Email Writer — drafts a concise professional email from a goal. */
export const writeEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { goal: string; recipient?: string }) => ({
    goal: String(input.goal ?? "").slice(0, 500),
    recipient: input.recipient?.slice(0, 200),
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (!data.goal.trim()) throw new Error("Goal required");
    const { text } = await generateText({
      model: gateway()("google/gemini-3-flash-preview"),
      prompt: `Write a professional, concise email for InsightAI Consultancy based on this goal: "${data.goal}"${data.recipient ? ` Recipient context: ${data.recipient}.` : ""}
Constraints: under 150 words, single clear CTA, no buzzwords, warm but direct tone. Sign off exactly:
The InsightAI Team
info@insightaiconsultancy.com · (973) 681-8296

Return only the email body (no subject line, no preamble).`,
    });
    return { body: text.trim() };
  });

/** AI Subject Suggestions — 4 subject line options for a given goal/body. */
export const suggestSubjects = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { context: string }) => ({
    context: String(input.context ?? "").slice(0, 1000),
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (!data.context.trim()) throw new Error("Context required");
    const { text } = await generateText({
      model: gateway()("google/gemini-3-flash-preview"),
      prompt: `Suggest 4 short email subject lines (each under 60 chars) for this email context: "${data.context}". Return one per line, no numbering, no quotes, no preamble.`,
    });
    const subjects = text
      .split("\n")
      .map((l) => l.replace(/^["'\d.\-)\s]+/, "").trim())
      .filter((l) => l.length > 3 && l.length < 90)
      .slice(0, 4);
    return { subjects };
  });
