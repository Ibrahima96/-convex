import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";

// Create a new post with the given text
export const createPost = mutation({
  args: { title: v.string(), body: v.string(), image: v.id("_storage") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Not Authenticated !");
    }
    const posts = await ctx.db.insert("posts", {
      title: args.title,
      body: args.body,
      authorId: user._id,
      storageImageId: args.image,
    });
    return posts;
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    return await Promise.all(
      posts.map(async (post) => {
        const resolvedImageUrl = post.storageImageId
          ? await ctx.storage.getUrl(post.storageImageId)
          : null;
        return { ...post, imageUrl: resolvedImageUrl };
      }),
    );
  },
});

export const getPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return null;
    
    // Récupère l'URL de l'image stockée si elle existe
    const resolvedImageUrl = post.storageImageId
      ? await ctx.storage.getUrl(post.storageImageId)
      : null;
    
    return { ...post, imageUrl: resolvedImageUrl };
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Not Authenticated !");
    return await ctx.storage.generateUploadUrl();
  },
});
