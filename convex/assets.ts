import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireContentAdmin } from "./lib/admin";

const RESUME_SETTINGS_KEY = "resume";

export const generateResumeUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireContentAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const setResumePdf = mutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    contentType: v.optional(v.string()),
    size: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireContentAdmin(ctx);
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", RESUME_SETTINGS_KEY))
      .unique();

    const patch = {
      resumeFileId: args.storageId,
      resumeFileName: args.filename,
      resumeContentType: args.contentType,
      resumeSize: args.size,
      resumeUploadedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return existing._id;
    }

    return await ctx.db.insert("siteSettings", {
      key: RESUME_SETTINGS_KEY,
      ...patch,
    });
  },
});

export const getResumePdf = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", RESUME_SETTINGS_KEY))
      .unique();
    if (!settings?.resumeFileId) {
      return null;
    }
    const url = await ctx.storage.getUrl(settings.resumeFileId);
    if (!url) {
      return null;
    }
    return {
      url,
      filename: settings.resumeFileName ?? "resume.pdf",
    };
  },
});

export const getResumePdfAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireContentAdmin(ctx);
    const settings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", RESUME_SETTINGS_KEY))
      .unique();
    if (!settings?.resumeFileId) {
      return null;
    }
    const url = await ctx.storage.getUrl(settings.resumeFileId);
    return {
      url,
      filename: settings.resumeFileName ?? "resume.pdf",
      contentType: settings.resumeContentType ?? null,
      size: settings.resumeSize ?? null,
      uploadedAt: settings.resumeUploadedAt ?? null,
    };
  },
});
