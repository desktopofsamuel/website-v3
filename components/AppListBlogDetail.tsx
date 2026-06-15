import React from "react";
import { Link } from "@/components/AppLink";
import Image from "next/image";

type AppListBlogDetailProps = {
  data: {
    slug: string;
    title: string;
    description: string;
    category: string;
    date: string;
    cover?: string;
    timetoread?: number;
  };
};

export default function AppListBlogDetail({ data }: AppListBlogDetailProps) {
  const post = data;
  const meta = post.category;

  return (
    <Link href={`/${post.slug}/`} className="no-underline text-inherit block">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-10 items-center cursor-pointer transition-transform duration-200 ease-in-out group">
        {post.cover && (
          <div className="w-full rounded-lg overflow-hidden">
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
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
            {meta}
          </p>
          <h3 className="text-2xl md:text-3xl font-body font-normal tracking-tight text-foreground mb-3 leading-tight">
            {post.title}
          </h3>
          <p className="text-base text-muted-foreground m-0 leading-relaxed line-clamp-3">
            {post.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
