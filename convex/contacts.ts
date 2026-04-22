import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireContentAdmin } from "./lib/admin";

const contactKindValue = v.union(
  v.literal("Project inquiry"),
  v.literal("Game dev collab"),
  v.literal("Speaking / interview"),
  v.literal("Just saying hi"),
  v.literal("Something else"),
);

export const submitContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    kind: contactKindValue,
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const email = args.email.trim();
    const body = args.body.trim();
    if (!name || !email || !body) {
      throw new Error("Name, email, and message are required.");
    }
    await ctx.db.insert("contacts", {
      name,
      email,
      kind: args.kind,
      body,
      submittedAt: Date.now(),
    });
    return null;
  },
});

export const listContactsAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireContentAdmin(ctx);
    return await ctx.db.query("contacts").withIndex("by_submitted_at").order("desc").take(250);
  },
});
