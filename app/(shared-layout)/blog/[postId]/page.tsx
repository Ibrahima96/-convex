import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, BookOpen } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  params: Promise<{ postId: string }>;
}

const PostDetailPage = async ({ params }: Props) => {
  const { postId } = await params;
  
  // Safely cast postId to the correct Id type
  const post = await fetchQuery(api.posts.getPost, {
    postId: postId as Id<"posts">,
  });

  if (!post) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="flex flex-col items-center justify-center gap-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Post Not Found</h1>
          <p className="text-xl text-muted-foreground">
            The article you are looking for does not exist or has been deleted.
          </p>
          <Button asChild className="rounded-full px-6 mt-4">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  // Calculate a generic reading time
  const wordCount = post.body.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors gap-x-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>

      <article className="space-y-8">
        {/* Post Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-x-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{new Date(post._creationTime).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
              })}</span>
            </div>
            <div className="flex items-center gap-x-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{readingTime} min read</span>
            </div>
            <div className="flex items-center gap-x-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>{wordCount} words</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-100 w-full rounded-2xl overflow-hidden shadow-lg border border-border">
          <Image
            alt={post.title}
            fill
            priority
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80"
            className="object-cover"
          />
        </div>

        {/* Main Content */}
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0 prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap font-light tracking-wide px-4">
              {post.body}
            </p>
          </CardContent>
        </Card>
      </article>
    </main>
  );
};

export default PostDetailPage;