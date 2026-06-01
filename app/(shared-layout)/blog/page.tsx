import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import Link from "next/link";

const Blogpage = async () => {
  const data = await fetchQuery(api.posts.getPosts);
  return (
    <main className="grid sm:grid-cols-3 grid-cols-1 gap-8 mt-10 sm:px-25 px-8 mb-38">
      {data.length === 0 ? (
        <div className="col-span-full text-center py-12 flex flex-col items-center justify-center gap-y-4">
          <h2 className="text-2xl font-bold">No posts found</h2>
          <p className="text-muted-foreground">
            Be the first to share your thoughts!
          </p>
          <Button asChild className="rounded-full px-6">
            <Link href="/create">Write a Post</Link>
          </Button>
        </div>
      ) : (
        data.map((post) => (
          <Card
            key={post._id}
            className="w-full pt-0 flex flex-col justify-between overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="relative h-62 w-full">
              <Image
                alt="post image"
                fill={true}
                src={post.imageUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60"}
                className="rounded-t-md object-cover"
              />
            </div>
            <CardContent className="flex flex-col gap-y-4 p-4 grow justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-lg font-bold tracking-wide line-clamp-1">
                  {post.title}
                </h1>
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {post.body}
                </p>
              </div>
              <div className="flex items-center justify-end mt-4">
                <Link
                  href={`blog/${post._id}`}
                  className={`${buttonVariants()} rounded-full`}
                >
                  Read More
                </Link>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </main>
  );
};

export default Blogpage;
