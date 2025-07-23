import Link from "@/components/AppLink";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AppListPortfolio({ data }: any) {
  const post = data;

  return (
    <div role="group" className="grid grid-cols-2 gap-16 my-10 border border-border p-8 rounded-2xl">
      <div className="flex flex-col justify-center gap-4 flex-1">
        <p className="text-sm text-secondarytext font-heading mb-0">{post.subtitle}</p>
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-2">{post.title}</h2>
        <p className="text-base text-secondarytext mb-6">{post.description}</p>
        <Button asChild>
          <Link href={`/work/${post.slug}/`}>View Process</Link>
        </Button>
      </div>
        <div>
          <Image
            src={post.cover}
            alt={post.title}
            width={1200}
            height={800}
            className="object-contain transition-all duration-500 ease-in-out group-hover:opacity-70 group-hover:scale-105"
          />
        </div>
      </div>
  );
} 