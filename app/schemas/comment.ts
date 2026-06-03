import { Id } from "@/convex/_generated/dataModel";
import z from "zod";

export const commentSchema = z.object({
  // Le corps du commentaire doit être une chaîne de caractères
  // et contenir au moins 3 caractères.
  body: z.string().min(3),

  // L'identifiant du post lié doit être une Id typée de la table "posts".
  // Cela garantit que l'on reçoit bien une référence valide vers un post.
  postId: z.custom<Id<"posts">>(),
});
