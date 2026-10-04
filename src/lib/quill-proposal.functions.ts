import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const InputSchema = z.object({
  company: z.string().min(1).max(120),
  industry: z.string().min(1).max(120),
  requirements: z.string().min(10).max(2000),
  budget: z.string().max(120).optional(),
  timeline: z.string().max(120).optional(),
});

const SYSTEM_PROMPT = `You are "Quill", InsightAI Consultancy's proposal and quotation agent.
InsightAI is a USA-based AI consultancy (Jackson Heights, New York) delivering AI agents, RAG knowledge systems,
automation, data platforms and custom AI product builds.

From the client brief, write a client-ready proposal in clean markdown with EXACTLY these sections, in this order:

## Executive Summary
## Scope of Work
## Proposed Approach
## Timeline & Milestones
## Investment
## Assumptions & Next Steps

Rules:
- Executive Summary: 3-4 sentences naming the client's problem and the outcome.
- Scope of Work: 5-7 bullets of concrete deliverables.
- Proposed Approach: 3-4 numbered phases, one line each.
- Timeline & Milestones: a markdown table with columns Phase | Duration | Milestone.
- Investment: a markdown table with columns Item | Description | Indicative Cost (USD).
  Add a Total row. Use realistic consulting ranges and respect the stated budget if given.
  End the section with the line: *Indicative pricing — final quote confirmed after the free AI audit.*
- Assumptions & Next Steps: 3-5 bullets, ending with booking a free 30-minute AI audit with InsightAI.
- No preamble, no closing chatter, no code fences around the whole document. Keep it under 700 words.`;

export const generateProposal = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return { proposal: "", error: "AI is not configured yet. Please try again later." };
    }

    const prompt = `Client / company: ${data.company}
Industry: ${data.industry}
Requirements: ${data.requirements}
Budget range: ${data.budget?.trim() ? data.budget : "not specified"}
Desired timeline: ${data.timeline?.trim() ? data.timeline : "not specified"}`;

    try {
      const { createOpenAI } = await import("@ai-sdk/openai");
      const lovable = createOpenAI({
        baseURL: "https://ai.gateway.lovable.dev/v1",
        apiKey: key,
        headers: {
          "Lovable-API-Key": key,
          "X-Lovable-AIG-SDK": "vercel-ai-sdk",
        },
      });

      const result = streamText({
        model: lovable.responses("openai/gpt-6-astra"),
        system: SYSTEM_PROMPT,
        prompt,
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "low",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });

      const text = (await result.text).trim();
      if (!text) {
        return { proposal: "", error: "Quill could not draft a proposal from that brief. Try adding more detail." };
      }
      return { proposal: text, error: null as string | null };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      if (/429/.test(message)) {
        return { proposal: "", error: "Quill is busy right now — please try again in a moment." };
      }
      if (/402/.test(message)) {
        return { proposal: "", error: "This demo has reached its usage limit for now. Please contact us directly." };
      }
      return { proposal: "", error: `Quill ran into a problem: ${message}` };
    }
  });
