import Link from "@/components/NextLink";
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
            <h2 className="font-heading text-2xl font-bold">{post.subtitle}</h2>
            <TbExternalLink className="text-secondarytext ml-2" />
          </div>
        </Link>
        <p className="my-0 text-secondarytext">{post.description}</p>
        <div className="flex">
          {post.tags.map((tag: string, index: React.Key | null | undefined) => (
            <p
              key={index}
              className="font-heading text-md text-yellow-500 font-bold mr-2"
            >
              {tag}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
} 