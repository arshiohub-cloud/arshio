const items = [
  "GPT-4o", "Claude", "Gemini", "Llama", "Mistral", "LangChain",
  "Pinecone", "Weaviate", "LlamaIndex", "AutoGen", "HuggingFace", "OpenAI",
];

export function TechMarquee() {
  const row = [...items, ...items];
  return (
    <div
      className="marquee-mask mt-12 overflow-hidden border-y border-white/10 py-3"
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="marquee-track flex gap-8 whitespace-nowrap">
        {row.map((t, i) => (
          <span
            key={i}
            className="font-mono text-[12px] tracking-wider flex items-center gap-8"
            style={{ color: "rgba(103,232,249,0.75)" }}
          >
            {t}
            <span className="text-white/20">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
