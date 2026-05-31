import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new task with the given text
export const createPost = mutation({
  args: { title: v.string(), body: v.string() },
  handler: async (ctx, args) => {
    const posts = await ctx.db.insert("posts", {
      title: args.title,
      body: args.body,
    });
    return posts;
  },
});
