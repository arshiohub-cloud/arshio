import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const InputSchema = z.object({
  prompt: z.string().min(1).max(2000),
  history: z.array(MessageSchema).max(20).optional(),
});

const SYSTEM_PROMPT = `You are an AI assistant for InsightAI Consultancy powered by RAG.
You have access to InsightAI's services, pricing, case studies, and AI services.
Answer questions helpfully and concisely.

When answering, ALWAYS reference the source as if you retrieved it from a knowledge base — for example: "Based on the InsightAI Services Guide..." or "According to our 2024 case studies...".

Keep responses under 150 words. Always end by suggesting a relevant follow-up question the visitor could ask.`;

export const runRagChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return { answer: "AI gateway is not configured. Please add LOVABLE_API_KEY." };
    }
    try {
      const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
      const gateway = createLovableAiGatewayProvider(key);
      const messages = [
        ...(data.history ?? []).map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: data.prompt },
      ];
      const { text } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system: SYSTEM_PROMPT,
        messages,
      });
      return { answer: text.trim() };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      if (/429/.test(message)) return { answer: "Rate limit reached — please try again shortly." };
      if (/402/.test(message)) return { answer: "AI credits exhausted. Add credits in Settings → Plans & credits." };
      return { answer: `RAG demo error: ${message}` };
    }
  });
