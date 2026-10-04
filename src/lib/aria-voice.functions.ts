import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CaptureSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  company: z.string().max(200).optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
  needs: z.string().min(1).max(4000),
  timeline: z.string().max(200).optional().nullable(),
  requested_slot: z.string().max(200).optional().nullable(),
  scheduled_at: z.string().max(60).optional().nullable(),
  timezone: z.string().max(80).optional().nullable(),
});

export type AriaCaptureInput = z.infer<typeof CaptureSchema>;

export type AriaCaptureResult = {
  ok: boolean;
  leadId: string | null;
  bookingId: string | null;
  slotLabel: string | null;
  error: string | null;
};

async function persist(data: AriaCaptureInput): Promise<AriaCaptureResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const slot = data.requested_slot?.trim() || null;
  const parsed = data.scheduled_at ? new Date(data.scheduled_at) : null;
  const scheduledAt = parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : null;

  const messageLines = [
    `Voice call with Aria (AI voice concierge).`,
    `What they need: ${data.needs}`,
    data.timeline ? `Timeline: ${data.timeline}` : null,
    slot ? `Requested AI audit slot: ${slot}` : null,
  ].filter(Boolean);

  const { data: lead, error: leadError } = await supabaseAdmin
    .from("leads")
    .insert({
      type: "audit",
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      company: data.company?.trim() || null,
      phone: data.phone?.trim() || null,
      message: messageLines.join("\n"),
      source_page: "Aria Voice Concierge",
      status: "new",
      notes: slot ? `Aria reserved a free 30-minute AI audit: ${slot}` : "Qualified by Aria on a live voice call.",
    })
    .select("id")
    .single();

  if (leadError || !lead) {
    return { ok: false, leadId: null, bookingId: null, slotLabel: null, error: "Could not save the caller details." };
  }

  let bookingId: string | null = null;
  if (slot) {
    const { data: booking } = await supabaseAdmin
      .from("audit_bookings")
      .insert({
        lead_id: lead.id,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        company: data.company?.trim() || null,
        phone: data.phone?.trim() || null,
        requested_slot: slot,
        scheduled_at: scheduledAt,
        timezone: data.timezone?.trim() || null,
        notes: data.needs,
        source: "aria_voice",
      })
      .select("id")
      .single();
    bookingId = booking?.id ?? null;
  }

  return { ok: true, leadId: lead.id, bookingId, slotLabel: slot, error: null };
}

/** Called live, mid-call, when Aria invokes her booking tool. */
export const ariaCaptureLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CaptureSchema.parse(input))
  .handler(async ({ data }): Promise<AriaCaptureResult> => {
    try {
      return await persist(data);
    } catch {
      return { ok: false, leadId: null, bookingId: null, slotLabel: null, error: "Could not save the caller details." };
    }
  });

const TranscriptSchema = z.object({
  transcript: z
    .array(z.object({ who: z.enum(["caller", "aria"]), text: z.string().max(2000) }))
    .min(2)
    .max(200),
});

/** Fallback: after the call ends, read the transcript and save the caller if they qualified. */
export const ariaCaptureFromTranscript = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TranscriptSchema.parse(input))
  .handler(async ({ data }): Promise<AriaCaptureResult> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return { ok: false, leadId: null, bookingId: null, slotLabel: null, error: null };
    }

    const convo = data.transcript
      .map((l) => `${l.who === "caller" ? "Caller" : "Aria"}: ${l.text}`)
      .join("\n")
      .slice(0, 8000);

    try {
      const { createOpenAI } = await import("@ai-sdk/openai");
      const { generateText } = await import("ai");
      const lovable = createOpenAI({
        baseURL: "https://ai.gateway.lovable.dev/v1",
        apiKey: key,
        headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      });

      const result = await generateText({
        model: lovable.responses("openai/gpt-6-astra"),
        system: `You read a transcript of a phone call between a caller and Aria, the AI voice concierge of InsightAI Consultancy.
Extract the caller's details. Reply with ONLY a JSON object, no markdown, no code fences, using exactly these keys:
{"qualified": boolean, "name": string, "email": string, "company": string, "phone": string, "needs": string, "timeline": string, "requested_slot": string}
Set "qualified" true only when BOTH a usable name and a usable email address were given by the caller.
Use an empty string for anything not stated. "needs" is one or two sentences describing what the caller wants.
"requested_slot" is the day and time they agreed to for a free 30-minute AI audit, in plain words, or an empty string.`,
        prompt: convo,
        providerOptions: {
          openai: { store: false, reasoningEffort: "low" },
        },
      });

      const raw = result.text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const email = typeof parsed.email === "string" ? parsed.email.trim() : "";
      const name = typeof parsed.name === "string" ? parsed.name.trim() : "";
      if (parsed.qualified !== true || !email || !name || !/.+@.+\..+/.test(email)) {
        return { ok: false, leadId: null, bookingId: null, slotLabel: null, error: null };
      }

      const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

      return await persist({
        name,
        email,
        company: str(parsed.company),
        phone: str(parsed.phone),
        needs: str(parsed.needs) ?? "Spoke with Aria on a live voice call.",
        timeline: str(parsed.timeline),
        requested_slot: str(parsed.requested_slot),
        scheduled_at: null,
        timezone: null,
      });
    } catch {
      return { ok: false, leadId: null, bookingId: null, slotLabel: null, error: null };
    }
  });
