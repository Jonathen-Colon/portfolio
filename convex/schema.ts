import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  subscribers: defineTable({
    email: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
