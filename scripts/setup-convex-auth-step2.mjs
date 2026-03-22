#!/usr/bin/env node
/**
 * README “step 2”: Convex dashboard env vars for Convex Auth.
 * Prints JWT_PRIVATE_KEY + JWKS lines to paste into the dashboard.
 *
 *   npm run convex:setup-auth-env
 */
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

console.log(`
=== Convex dashboard: Deployment → Environment variables ===

Add these (copy each name + value):

1) ADMIN_EMAIL
   Your admin login email (must match when you use “Create admin account” on /admin).

2) CONVEX_SITE_URL
   Your deployment URL from the Convex dashboard (same page as the HTTP URL), e.g.
   https://happy-animal-123.convex.cloud

3) JWT_PRIVATE_KEY  (single line, from output below)
4) JWKS             (JSON, one line, from output below)

Then run: npm run convex:dev   (or deploy) so functions pick up the new vars.

--- Paste the next two lines into Convex as separate variables ---`);

const keys = await generateKeyPair("RS256", { extractable: true });
const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

process.stdout.write(
  `JWT_PRIVATE_KEY="${privateKey.trimEnd().replace(/\n/g, " ")}"\n`,
);
process.stdout.write(`JWKS=${jwks}\n`);
console.log(`--- end ---

Local Astro: set PUBLIC_CONVEX_URL in .env.local to your Convex HTTP URL.
`);
