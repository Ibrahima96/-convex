"use server";
import z from "zod";
import { postSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export const createPostBlog = async (values: z.infer<typeof postSchema>) => {
  try {
    const parsed = postSchema.safeParse(values);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error);
      return {
        error: "Validation failed",
      };
    }

    // Vérifie que l'image existe et n'est pas undefined
    if (!parsed.data.image || !(parsed.data.image instanceof File)) {
      console.error("Image is not a valid File object");
      return {
        error: "Image is required and must be a file",
      };
    }

    const token = await getToken();

    // 1. Génère une URL d'upload sécurisée depuis Convex
    const imageUrl = await fetchMutation(
      api.posts.generateUploadUrl,
      {},
      { token },
    );

    // 2. Envoie l'image directement au storage Convex
    const uploadResponse = await fetch(imageUrl, {
      method: "POST",
      headers: { "Content-Type": parsed.data.image.type },
      body: parsed.data.image,
    });

    if (!uploadResponse.ok) {
      console.error("Upload failed:", uploadResponse.status, uploadResponse.statusText);
      return {
        error: `Failed to upload image: ${uploadResponse.statusText}`,
      };
    }

    const uploadData = await uploadResponse.json();
    const storageId = uploadData.storageId;

    if (!storageId) {
      console.error("No storageId returned from upload");
      return {
        error: "Image upload succeeded but no storage ID was returned",
      };
    }

    // 3. Crée le post avec l'ID de l'image stockée
    await fetchMutation(
      api.posts.createPost,
      {
        body: parsed.data.content,
        title: parsed.data.title,
        image: storageId,
      },
      { token },
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      error: `Failed to create post: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }

  return redirect("/");
};
