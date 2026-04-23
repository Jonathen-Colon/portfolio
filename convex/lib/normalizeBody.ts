/**
 * Posts/projects store body as string[] (one paragraph per entry).
 * Accepts a single string: plain multi-line text, or HTML with <p>...</p> blocks.
 */
export function normalizeBody(body: string | string[] | undefined): string[] {
  if (body === undefined) return [];
  if (Array.isArray(body)) {
    return body
      .filter((x): x is string => typeof x === "string")
      .map((x) => x.trim())
      .filter(Boolean);
  }
  const s = body.trim();
  if (!s) return [];

  const looksLikeParagraphHtml = /<\s*p(?:\s|>)/i.test(s) && /<\s*\/\s*p\s*>/i.test(s);
  if (looksLikeParagraphHtml) {
    return s
      .split(/<\s*\/\s*p\s*>/i)
      .map((chunk) => chunk.replace(/<\s*p[^>]*>/gi, "").trim())
      .filter(Boolean);
  }

  return s
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
