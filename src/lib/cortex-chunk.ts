/** Browser-safe passage splitter shared by the Cortex demo UI and its server function. */
export function chunkText(title: string, text: string): { source: string; section: string; text: string }[] {
  const clean = text.replace(/\r/g, "").trim();
  if (!clean) return [];

  const out: { source: string; section: string; text: string }[] = [];
  let section = "Introduction";
  let buffer: string[] = [];

  const flush = () => {
    const body = buffer.join("\n").trim();
    if (body.length > 0) out.push({ source: title, section, text: body });
    buffer = [];
  };

  for (const rawLine of clean.split("\n")) {
    const line = rawLine.trim();
    const heading = line.match(/^(?:#{1,6}\s+|\d+\.\s+|[A-Z][A-Z \-&]{4,60}:?$)(.*)$/);
    const isHeading =
      (/^#{1,6}\s+/.test(line) && line.length <= 100) ||
      (/^\d+\.\s+\S/.test(line) && line.length <= 90 && !line.endsWith("."));
    if (isHeading && heading) {
      flush();
      section = line.replace(/^#{1,6}\s+/, "").replace(/^\d+\.\s+/, "").trim();
      continue;
    }
    if (line.length === 0) {
      if (buffer.join(" ").length > 700) flush();
      else buffer.push("");
      continue;
    }
    buffer.push(line);
    if (buffer.join(" ").length > 1100) flush();
  }
  flush();

  return out.length > 0 ? out : [{ source: title, section: "Document", text: clean.slice(0, 1200) }];
}
