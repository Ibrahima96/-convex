import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getCommentsByPostId = query({
  // Définition de l'argument attendu : un ID valide provenant de la table "posts".
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    // Initialise une requête sur la table "comments".
    const data = await ctx.db
      .query("comments")
      // Filtre les commentaires pour ne garder que ceux liés au postId fourni.
      // Note : .filter() parcourt tous les documents, ce qui peut être lent à grande échelle.
      .filter((q) => q.eq(q.field("postId"), args.postId))
      // Trie les commentaires par ordre antéchronologique (du plus récent au plus ancien).
      .order("desc")
      // Exécute la requête et retourne les résultats sous forme de tableau.
      .collect();
    return data;
  },
});

export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    // Tente de récupérer l'utilisateur authentifié via Better Auth.
    const user = await authComponent.safeGetAuthUser(ctx);

    // Si aucun utilisateur n'est trouvé, on bloque l'exécution et on renvoie une erreur explicite.
    if (!user) throw new ConvexError("Not Authenticated !");

    // Insère le nouveau commentaire en utilisant les informations sécurisées de l'utilisateur.
    return await ctx.db.insert("comments", {
      postId: args.postId,
      body: args.body,
      authorId: user._id,
      authorName: user.name,
    });
  },
});
