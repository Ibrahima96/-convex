import z from "zod";

export const postSchema = z.object({
  title: z.string().min(8).max(30),
  content: z.string().min(8),
});
