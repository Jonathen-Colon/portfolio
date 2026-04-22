import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireContentAdmin } from "./lib/admin";

const projectValue = v.object({
  id: v.string(),
  title: v.string(),
  year: v.string(),
  kind: v.union(v.literal("web"), v.literal("game")),
  role: v.string(),
  desc: v.string(),
  tags: v.array(v.string()),
  accent: v.string(),
  thumb: v.string(),
  live: v.optional(v.string()),
  repo: v.optional(v.string()),
  itch: v.optional(v.string()),
    media: v.optional(v.string()),
    body: v.union(v.array(v.string()), v.string()),
    shots: v.optional(v.array(v.string())),
});

export const listProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});

export const listProjectsByKind = query({
  args: { kind: v.union(v.literal("web"), v.literal("game")) },
  handler: async (ctx, { kind }) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_kind", (q) => q.eq("kind", kind))
      .collect();
  },
});

export const upsertProject = mutation({
  args: {
    project: projectValue,
  },
  handler: async (ctx, { project }) => {
    await requireContentAdmin(ctx);
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_project_id", (q) => q.eq("id", project.id))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, project);
      return existing._id;
    }
    return await ctx.db.insert("projects", project);
  },
});

export const deleteProject = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    await requireContentAdmin(ctx);
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_project_id", (q) => q.eq("id", id))
      .unique();
    if (!existing) return;
    await ctx.db.delete(existing._id);
  },
});
