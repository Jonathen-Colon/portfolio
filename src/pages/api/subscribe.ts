import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  if (request.headers.get("Content-Type") !== "application/json") {
     return new Response(JSON.stringify({ message: "Invalid Content-Type" }), { status: 400 });
  }

  try {
    const db = locals.runtime?.env?.DB;
    if (!db) {
      console.error("D1 Error: binding DB is missing (check wrangler.jsonc and platformProxy)");
      return new Response(JSON.stringify({ message: "Database not configured" }), { status: 500 });
    }

    const data = (await request.json()) as { email?: unknown };
    const email = typeof data.email === "string" ? data.email : "";

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ message: "Invalid email address" }), { status: 400 });
    }

    // Lazy migration (also covered by `migrations/` for wrangler d1 migrations apply)
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    const existing = await db
      .prepare("SELECT id FROM subscribers WHERE email = ?")
      .bind(email)
      .first<{ id: number }>();

    if (existing) {
        return new Response(JSON.stringify({ message: "Already subscribed" }), { status: 200 });
    }

    await db
      .prepare("INSERT INTO subscribers (email) VALUES (?)")
      .bind(email)
      .run();

    return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("D1 Error:", e);
    return new Response(JSON.stringify({ message: "Internal Server Error", error: message }), { status: 500 });
  }
}
