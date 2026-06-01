import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Other tables here...

  posts: defineTable({
    body: v.string(),
    title: v.string(),
    authorId: v.string(),
    storageImageId: v.optional(v.id("_storage")),
  }),
});
