import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";

async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError("Unauthorized");
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) {
    throw new ConvexError("ADMIN_EMAIL is not set on this Convex deployment.");
  }

  // Prefer email from the users document (Convex Auth profile); JWT identity
  // sometimes omits `email` or uses a different claim shape for password auth.
  const user = await ctx.db.get(userId);
  const fromDoc =
    typeof user?.email === "string" ? user.email.trim().toLowerCase() : "";
  const identity = await ctx.auth.getUserIdentity();
  const fromToken =
    typeof identity?.email === "string"
      ? identity.email.trim().toLowerCase()
      : "";
  const email = fromDoc || fromToken;

  if (!email || email !== adminEmail) {
    throw new ConvexError("Forbidden");
  }
}

export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    if (!email.includes("@")) {
      throw new ConvexError("Invalid email address");
    }

    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existing) {
      return { ok: true as const, alreadySubscribed: true as const };
    }

    await ctx.db.insert("subscribers", {
      email,
      createdAt: Date.now(),
    });

    return { ok: true as const, alreadySubscribed: false as const };
  },
});

export const listForAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("subscribers").order("desc").collect();
  },
});

export const remove = mutation({
  args: { id: v.id("subscribers") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});
