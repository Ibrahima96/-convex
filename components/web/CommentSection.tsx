"use client";
import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { commentSchema } from "@/app/schemas/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

const CommentSection = () => {
  /**
   * Récupère les paramètres de l'URL (ex: /blog/[postId]).
   * Le passage du générique <{ postId: Id<"posts"> }> permet de :
   * 1. Typage strict : Garantir que 'postId' est présent et reconnu comme un identifiant Convex valide.
   * 2. Intégrité : Empêcher l'utilisation d'une simple chaîne de caractères là où Convex attend un ID typé de la table "posts".
   */
  const params = useParams<{ postId: Id<"posts"> }>();

  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      postId: params.postId,
    },
  });
  async function onSubmit(data: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      try {
        // await createComment(data);
        form.reset();
        toast.success("Comment posted");
      } catch {
        toast.error("Failed to create post");
      }
    });
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">5 Comments</h2>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Share your thoughts"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Comment</span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommentSection;
