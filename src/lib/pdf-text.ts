/**
 * Client-side PDF text extraction using pdf.js.
 * Dynamically imported so the parser only loads when a PDF is uploaded.
 */
export async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;

  const parts: string[] = [];
  const maxPages = Math.min(doc.numPages, 40);
  for (let p = 1; p <= maxPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    if (line.trim()) parts.push(line);
  }
  void doc.cleanup();
  return parts.join("\n");
}
