import React from "react";
import { Link } from "@/components/AppLink";
import Image from "next/image";
import { cn } from "@/components/lib/utils";

type AppListBlogProps = {
  data: {
    slug: string;
    title: string;
    excerpt: string;
    category?: string;
    cover?: string;
    date?: string;
    timetoread?: number;
  };
  small?: boolean;
};

export default function AppListBlog({
  data,
  small = false,
}: AppListBlogProps) {
  const post = data;
  const meta = post.category ?? null;

  return (
    <Link href={`/${post.slug}/`} className="no-underline text-inherit block">
      <div className="my-4 cursor-pointer group">
        {post.cover && (
          <div className="w-full rounded-lg overflow-hidden mb-4">
            <Image
              src={post.cover}
              alt={post.title}
              className="w-full h-full group-hover:scale-[1.02] group-hover:opacity-90 transition-all ease-in-out duration-500 object-cover aspect-[1.9/1] rounded-sm"
              width={1200}
              height={630}
              priority
            />
          </div>
        )}
        <h3
          className={cn(
            "font-body font-normal mb-3 leading-tight tracking-tight text-foreground",
            {
              "text-xl": small,
              "text-2xl": !small,
            }
          )}
        >
          {post.title}
        </h3>
        <p
          className={cn("font-body leading-relaxed text-muted-foreground", {
            "text-sm line-clamp-2": small,
            "text-base line-clamp-3": !small,
          })}
        >
          {post.excerpt}
        </p>
        {meta && (
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-3">
            {meta}
          </p>
        )}
      </div>
    </Link>
  );
}
