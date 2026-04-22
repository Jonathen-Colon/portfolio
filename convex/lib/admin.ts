import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { DataModel } from "../_generated/dataModel";

type AuthCtx = GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>;

/**
 * Requires a signed-in user. If Convex env `ADMIN_EMAIL` is set, only that
 * email may call content mutations (recommended for production).
 */
export async function requireContentAdmin(ctx: AuthCtx): Promise<void> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && identity.email !== adminEmail) {
    throw new Error("Unauthorized: this account cannot edit portfolio content.");
  }
}
