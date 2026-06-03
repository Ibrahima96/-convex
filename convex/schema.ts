import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Définition du schéma global de l'application.
 * Convex utilise ce fichier pour générer les types TypeScript et valider les données côté serveur.
 */
export default defineSchema({
  // Table pour stocker les publications (articles de blog)
  posts: defineTable({
    title: v.string(), // Titre de la publication
    body: v.string(), // Corps du texte ou contenu de l'article
    authorId: v.string(), // Identifiant unique de l'auteur (lié au système d'authentification)
    imageStorageId: v.optional(v.id("_storage")), // Référence optionnelle vers un fichier dans le stockage Convex
  }),
  // Table pour stocker les commentaires associés aux publications
  comments: defineTable({
    postId: v.id("posts"), // Référence à l'identifiant du post parent (Clé étrangère)
    body: v.string(), // Contenu textuel du commentaire
    authorId: v.string(), // Identifiant de l'auteur du commentaire
    authorName: v.string(), // Nom d'affichage de l'auteur pour éviter une jointure lors de la lecture
  }),
});
