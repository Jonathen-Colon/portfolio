import { getAuthUserId } from "@convex-dev/auth/server";
import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { DataModel } from "../_generated/dataModel";

type AuthCtx = GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>;

export type ContentAdminGate = { ok: true } | { ok: false; message: string };

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Emails Convex Auth may associate with the session. JWT `email` is often
 * absent; the `users` row from {@link getAuthUserId} holds the profile email.
 */
async function sessionAdminEmails(ctx: AuthCtx): Promise<Set<string>> {
  const identity = await ctx.auth.getUserIdentity();
  const emails = new Set<string>();
  if (identity?.email) {
    emails.add(normalizeEmail(identity.email));
  }
  const userId = await getAuthUserId(ctx);
  if (userId) {
    const user = await ctx.db.get(userId);
    if (user?.email) {
      emails.add(normalizeEmail(user.email));
    }
  }
  return emails;
}

/**
 * Same rules as {@link requireContentAdmin}, but returns a result so public
 * queries can respond without throwing (Convex React `useQuery` throws on
 * query errors and would blank the admin UI).
 */
export async function checkContentAdmin(ctx: AuthCtx): Promise<ContentAdminGate> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return { ok: false, message: "Not authenticated" };
  }
  const rawAdmin = process.env.ADMIN_EMAIL?.trim();
  if (!rawAdmin) {
    return { ok: true };
  }
  const want = normalizeEmail(rawAdmin);
  const have = await sessionAdminEmails(ctx);
  if (![...have].some((e) => e === want)) {
    return {
      ok: false,
      message:
        "Unauthorized: your session does not match ADMIN_EMAIL (checked against your Convex Auth user email; comparison is case-insensitive). Sign out and sign in with the admin address, or update ADMIN_EMAIL in the Convex dashboard.",
    };
  }
  return { ok: true };
}

/**
 * Requires a signed-in user. If Convex env `ADMIN_EMAIL` is set, only that
 * email may call content mutations (recommended for production).
 */
export async function requireContentAdmin(ctx: AuthCtx): Promise<void> {
  const gate = await checkContentAdmin(ctx);
  if (!gate.ok) {
    throw new Error(gate.message);
  }
}
