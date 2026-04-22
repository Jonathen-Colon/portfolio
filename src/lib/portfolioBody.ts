import DOMPurify from "dompurify";

/** Escape plain text for inserting into a single HTML paragraph. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Legacy Convex/static content: one string per paragraph. */
export function paragraphsToHtml(paragraphs: string[]): string {
  if (paragraphs.length === 0) return "<p></p>";
  return paragraphs
    .map((t) => {
      const inner = escapeHtml(t).replace(/\n/g, "<br />");
      return `<p>${inner}</p>`;
    })
    .join("");
}

export function bodyToHtmlForEditor(body: string[] | string | undefined): string {
  if (body === undefined || body === null) return "<p></p>";
  if (typeof body === "string") {
    const t = body.trim();
    return t ? body : "<p></p>";
  }
  return paragraphsToHtml(body);
}

function isEmptyBodyHtml(html: string): boolean {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = doc.body.textContent?.replace(/\u00a0/g, " ").trim() ?? "";
  const hasImg = doc.body.querySelector("img");
  return !text && !hasImg;
}

/** True when body is only top-level `<p>` with text and/or `<br>` (no inline elements). */
function isSimpleParagraphOnly(html: string): boolean {
  const doc = new DOMParser().parseFromString(html, "text/html");
  for (const node of doc.body.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      if ((node.textContent ?? "").trim()) return false;
      continue;
    }
    if (node.nodeName !== "P") return false;
    for (const c of (node as HTMLParagraphElement).childNodes) {
      if (c.nodeType === Node.TEXT_NODE) continue;
      if (c.nodeName === "BR") continue;
      return false;
    }
  }
  return true;
}

function simpleParagraphsFromHtml(html: string): string[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return [...doc.body.querySelectorAll("p")]
    .map((p) => p.innerHTML.replace(/<br\s*\/?>/gi, "\n"))
    .map((raw) => {
      const t = new DOMParser().parseFromString(`<div>${raw}</div>`, "text/html").body.textContent ?? "";
      return t.replace(/\r\n/g, "\n").trim();
    })
    .filter(Boolean);
}

/**
 * Normalizes editor HTML for Convex: compact `string[]` when plain paragraphs only,
 * otherwise full HTML string (headings, lists, images, bold, etc.).
 */
export function editorHtmlToStorageBody(html: string): string[] | string {
  const trimmed = html.trim();
  if (!trimmed || isEmptyBodyHtml(trimmed)) return [];
  if (isSimpleParagraphOnly(trimmed)) {
    return simpleParagraphsFromHtml(trimmed);
  }
  return trimmed;
}

const SANITIZE: DOMPurify.Config = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "s",
    "strike",
    "a",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "blockquote",
    "pre",
    "code",
    "img",
    "span",
  ],
  ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel", "class"],
  ALLOW_DATA_ATTR: false,
};

export function sanitizePortfolioBodyHtml(html: string): string {
  return DOMPurify.sanitize(html, SANITIZE);
}

/**
 * HTML for dangerouslySetInnerHTML in modals.
 * `string[]` is treated as plain paragraphs (no inline HTML). `string` is full rich HTML from the admin editor.
 */
export function bodyToDisplayHtml(body: string[] | string | undefined): string {
  if (body === undefined || body === null) return "";
  const raw = typeof body === "string" ? body : paragraphsToHtml(body);
  return sanitizePortfolioBodyHtml(raw);
}
