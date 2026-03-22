/** Convex HTTP URL from Astro/Vite (`PUBLIC_CONVEX_URL`). */
export function getConvexPublicUrl(): string | undefined {
  const raw = import.meta.env.PUBLIC_CONVEX_URL;
  if (typeof raw !== "string") return undefined;
  const t = raw.trim();
  if (!t) return undefined;
  try {
    const u = new URL(t);
    if (u.protocol !== "https:" && u.protocol !== "http:") return undefined;
    return t.replace(/\/+$/, "");
  } catch {
    return undefined;
  }
}
