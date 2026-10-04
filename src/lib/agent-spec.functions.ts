import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const InputSchema = z.object({
  agentType: z.string().min(1).max(60),
  integrations: z.array(z.string().max(40)).max(20),
  description: z.string().min(1).max(1500),
});

const SYSTEM_PROMPT = `You are an AI agent architect. Based on the agent type, integrations, and description provided, generate a structured agent specification including: name, purpose, tools required, escalation logic, and success metrics. Be concise and professional.

Format the response in clean markdown with these exact sections:
**Name**, **Purpose**, **Tools Required**, **Escalation Logic**, **Success Metrics**.
Keep each section short (2-4 lines or bullets). No preamble.`;

export const generateAgentSpec = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return { spec: "AI gateway is not configured. Please add LOVABLE_API_KEY." };
    }

    try {
      const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
      const gateway = createLovableAiGatewayProvider(key);
      const userPrompt = `Agent type: ${data.agentType}
Integrations: ${data.integrations.length ? data.integrations.join(", ") : "(none selected)"}
Description: ${data.description}`;

      const { text } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system: SYSTEM_PROMPT,
        prompt: userPrompt,
      });
      return { spec: text.trim() };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      if (/429/.test(message)) {
        return { spec: "Rate limit reached — please try again in a moment." };
      }
      if (/402/.test(message)) {
        return { spec: "AI credits exhausted. Add credits in Settings → Plans & credits." };
      }
      return { spec: `Error: ${message}` };
    }
  });
