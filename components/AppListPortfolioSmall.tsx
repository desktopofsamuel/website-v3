import Link from "@/components/AppLink";
import { TbExternalLink } from "react-icons/tb";

export default function AppListPortfolioSmall({ data }: any) {
  const post = data;

  return (
    <div className="border border-border p-6 rounded-2xl h-full">
      <div className="grid grid-cols-1 gap-2">
        <Link
          href={post.url ? post.url : `/work/${post.slug}/`}
          target="_blank"
          className="no-underline"
        >
          <div className="flex items-center">
            <h2 className="text-2xl font-heading">{post.subtitle}</h2>
            <TbExternalLink className="text-muted-foreground ml-2" />
          </div>
        </Link>
        <p className="my-0 text-muted-foreground">{post.description}</p>
        <p className="my-0 font-eyebrow text-muted-foreground">{post.year}</p>
        <div className="flex">
          {post.tags.map((tag: string, index: React.Key | null | undefined) => (
            <p
              key={index}
              className="font-mono not-last:pr-2 text-muted-foreground mr-2"
            >
              {tag}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
} 