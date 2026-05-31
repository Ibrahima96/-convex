"use server";
import z from "zod";
import { postSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { toast } from "sonner";
export const createPostBlog = async (values: z.infer<typeof postSchema>) => {
  const parsed = postSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error("wrong error");
  }
  await fetchMutation(
    api.posts.createPost,
    {
      body: parsed.data.content,
      title: parsed.data.title,
    },
    { token: await getToken() },
  );

  redirect("/");
};
