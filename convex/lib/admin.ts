import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { DataModel } from "../_generated/dataModel";

type AuthCtx = GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>;

export type ContentAdminGate = { ok: true } | { ok: false; message: string };

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
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && identity.email !== adminEmail) {
    return {
      ok: false,
      message: "Unauthorized: this account cannot edit portfolio content.",
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
