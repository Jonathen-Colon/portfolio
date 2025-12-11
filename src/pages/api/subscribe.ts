import type { APIRoute } from 'astro';
import { turso } from '../../lib/turso';

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json") {
     return new Response(JSON.stringify({ message: "Invalid Content-Type" }), { status: 400 });
  }

  try {
    const data = await request.json();
    const email = data.email;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ message: "Invalid email address" }), { status: 400 });
    }

    // Lazy migration: Ensure table exists
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if email already exists
    const existing = await turso.execute({
        sql: "SELECT id FROM subscribers WHERE email = ?",
        args: [email]
    });

    if (existing.rows.length > 0) {
        return new Response(JSON.stringify({ message: "Already subscribed" }), { status: 200 });
    }

    // Insert
    await turso.execute({
      sql: "INSERT INTO subscribers (email) VALUES (?)",
      args: [email]
    });

    return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
  } catch (e: any) {
    console.error("Turso Error:", e);
    return new Response(JSON.stringify({ message: "Internal Server Error", error: e.message }), { status: 500 });
  }
}
