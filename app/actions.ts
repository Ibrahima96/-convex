"use server";
import { fetchMutation } from "convex/nextjs";
import z from "zod";
import { postSchema } from "./schemas/blog";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";

// Action côté serveur appelée depuis un formulaire ou un composant React.
// Elle valide les données, télécharge l'image et crée un nouveau post dans Convex.
export default async function createBlogAction(
  values: z.infer<typeof postSchema>,
) {
  // Récupère le token d'authentification pour appeler les mutations Convex.
  const token = await getToken();

  try {
    // Valide les valeurs reçues avec le schéma Zod.
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      // Si la validation échoue, on lève une erreur pour interrompre le flux.
      throw new Error("something went wrong");
    }

    // Demande à l'API Convex une URL d'upload pour l'image.
    const imageUrl = fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token },
    );

    // Envoie l'image vers le service de stockage via l'URL obtenue.
    const uploadResult = await fetch(await imageUrl, {
      method: "POST",
      headers: { "Content-Type": parsed.data.image.type },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      // Si l'upload échoue, on retourne un message d'erreur.
      return { error: "Failed to upload image" };
    }

    // Lit l'identifiant de stockage renvoyé par le service d'upload.
    const { storageId } = await uploadResult.json();

    // Crée le post dans Convex en transmettant l'ID de l'image uploadée.
    await fetchMutation(
      api.posts.createPost,
      {
        title: parsed.data.title,
        body: parsed.data.content,
        imageStorageId: storageId,
      },
      { token },
    );
  } catch (error) {
    // En cas d'erreur, on peut la journaliser ici pour débogage.
    console.error("Erreur lors de la création du blog :", error);
  }

  // Après la création, on redirige l'utilisateur vers la page /blog.
  return redirect("/blog");
}
