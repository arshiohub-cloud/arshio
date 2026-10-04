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

const SYSTEM_PROMPT = `You are "Forge", a helpful AI assistant for InsightAI Consultancy's website.
Answer visitor questions directly and helpfully on any topic they ask.

Respond in 2-4 short sentences. Be clear, friendly, and concise.
Use bullet points only when listing 3+ items.
Never describe yourself as an agent or mention being an AI language model.
Just give the answer.`;

export const runAgentChat = createServerFn({ method: "POST" })
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
      if (/429/.test(message)) {
        return { answer: "Rate limit reached — please try again in a moment." };
      }
      if (/402/.test(message)) {
        return { answer: "AI credits exhausted. Add credits in Settings → Plans & credits." };
      }
      return { answer: `Agent error: ${message}` };
    }
  });
