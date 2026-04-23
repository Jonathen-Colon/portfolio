import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireContentAdmin } from "./lib/admin";
import { normalizeBody } from "./lib/normalizeBody";

const bodyArg = v.union(v.string(), v.array(v.string()));

const postValue = v.object({
  id: v.string(),
  date: v.string(),
  title: v.string(),
  excerpt: v.string(),
  read: v.string(),
  tag: v.string(),
  thumb: v.string(),
<<<<<<< HEAD
  body: v.union(v.array(v.string()), v.string()),
=======
  body: bodyArg,
>>>>>>> 33ef075 (Enhance body normalization for posts and projects)
});

export const listPosts = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("posts").collect();
    return rows.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  },
});

export const upsertPost = mutation({
  args: {
    post: postValue,
  },
  handler: async (ctx, { post }) => {
    await requireContentAdmin(ctx);
    const row = { ...post, body: normalizeBody(post.body) };
    const existing = await ctx.db
      .query("posts")
      .withIndex("by_post_id", (q) => q.eq("id", post.id))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, row);
      return existing._id;
    }
    return await ctx.db.insert("posts", row);
  },
});

export const deletePost = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    await requireContentAdmin(ctx);
    const existing = await ctx.db
      .query("posts")
      .withIndex("by_post_id", (q) => q.eq("id", id))
      .unique();
    if (!existing) return;
    await ctx.db.delete(existing._id);
  },
});
