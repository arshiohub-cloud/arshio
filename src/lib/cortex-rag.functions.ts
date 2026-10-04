import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { CORTEX_SOURCES } from "./cortex-corpus";
import { chunkText } from "./cortex-chunk";


const InputSchema = z.object({
  question: z.string().min(3).max(500),
  /** When provided, Cortex answers only from this text instead of the sample corpus. */
  customText: z.string().max(40000).optional(),
  customTitle: z.string().max(200).optional(),
});

export type CortexChunk = {
  id: string;
  source: string;
  section: string;
  text: string;
  score: number;
};

const STOP = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "is", "are", "for", "on", "with", "what",
  "how", "does", "do", "can", "i", "we", "our", "my", "be", "it", "that", "this", "if", "at",
  "from", "by", "as", "was", "were", "about", "you", "your", "there", "any", "when", "who",
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}


function retrieve(
  chunks: { source: string; section: string; text: string }[],
  question: string,
  topK = 4,
): CortexChunk[] {
  const qTokens = tokenize(question);
  const scored = chunks.map((c, i) => {
    const hay = `${c.section} ${c.text}`.toLowerCase();
    const haystack = tokenize(hay);
    const counts = new Map<string, number>();
    for (const t of haystack) counts.set(t, (counts.get(t) ?? 0) + 1);
    let score = 0;
    for (const q of qTokens) {
      const hits = counts.get(q) ?? 0;
      if (hits > 0) score += 1 + Math.log(1 + hits);
      if (c.section.toLowerCase().includes(q)) score += 1.5;
    }
    const norm = score / Math.max(1, qTokens.length);
    return { id: `c${i + 1}`, source: c.source, section: c.section, text: c.text, score: Number(norm.toFixed(3)) };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((c, idx) => c.score > 0 || idx === 0);
}

const SYSTEM = `You are Cortex, InsightAI's company-brain agent. You answer ONLY from the retrieved passages given to you.

Rules:
- Use nothing but the passages. Never add outside facts, guesses, or general knowledge.
- Cite the passages you used inline with their markers, e.g. [1] or [2].
- If the passages do not contain the answer, reply exactly: "I couldn't find that in the provided documents." and then name what document or detail would be needed.
- Be direct and under 140 words. No preamble like "Based on the passages".`;

export const askCortex = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const chunks =
      data.customText && data.customText.trim().length > 50
        ? chunkText(data.customTitle?.trim() || "Your document", data.customText)
        : CORTEX_SOURCES.flatMap((s) => chunkText(s.title, s.body));

    const retrieved = retrieve(chunks, data.question);

    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return {
        answer: "The AI service isn't configured yet, so Cortex can't generate an answer right now.",
        chunks: retrieved,
        grounded: false,
      };
    }

    const context = retrieved
      .map((c, i) => `[${i + 1}] Source: ${c.source} — ${c.section}\n${c.text}`)
      .join("\n\n---\n\n");

    try {
      const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
      const gateway = createLovableAiGatewayProvider(key);
      const { text } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system: SYSTEM,
        messages: [
          {
            role: "user",
            content: `Retrieved passages:\n\n${context}\n\n---\n\nQuestion: ${data.question}`,
          },
        ],
      });
      const answer = text.trim();
      return {
        answer,
        chunks: retrieved,
        grounded: !/couldn't find that in the provided documents/i.test(answer),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      if (/429/.test(message)) return { answer: "Too many requests right now — try again in a moment.", chunks: retrieved, grounded: false };
      if (/402/.test(message)) return { answer: "AI credits are exhausted. Add credits to continue.", chunks: retrieved, grounded: false };
      return { answer: `Cortex hit an error: ${message}`, chunks: retrieved, grounded: false };
    }
  });
