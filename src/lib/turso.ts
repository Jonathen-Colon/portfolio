import { createClient } from "@libsql/client";

const url = import.meta.env.TURSO_DATABASE_URL;
const authToken = import.meta.env.TURSO_AUTH_TOKEN;

// Create a dummy client if env vars are missing to prevent build-time crashes
// This allows the build to proceed even if the user hasn't set up credentials yet
const dbUrl = url || "libsql://placeholder-db.turso.io";

export const turso = createClient({
  url: dbUrl,
  authToken: authToken,
});
