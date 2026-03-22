/**
 * Prints JWT_PRIVATE_KEY and JWKS for Convex Auth.
 * Paste the output into your Convex deployment → Settings → Environment Variables.
 *
 *   node scripts/generate-convex-auth-keys.mjs
 */
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

const keys = await generateKeyPair("RS256", { extractable: true });
const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

process.stdout.write(
  `JWT_PRIVATE_KEY="${privateKey.trimEnd().replace(/\n/g, " ")}"\n`,
);
process.stdout.write(`JWKS=${jwks}\n`);
