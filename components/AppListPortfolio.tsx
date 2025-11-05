import Link from "@/components/AppLink";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AppListPortfolio({ data }: any) {
  const post = data;

  return (
    <div
      role="group"
      className="grid grid-cols-1 gap-8 my-10 border border-border p-6 rounded-2xl lg:grid-cols-2 lg:gap-16 lg:p-8"
    >
      <div className="order-2 flex flex-col items-start gap-4 lg:order-1 lg:gap-2">
        <p className="text-sm text-secondarytext font-heading mb-0">{post.subtitle}</p>
        <h2 className="text-3xl font-bold font-heading mb-2">{post.title}</h2>
        <p className="text-base text-secondarytext mb-6">{post.description}</p>
        <Button asChild>
          <Link href={`/work/${post.slug}/`}>View Process</Link>
        </Button>
      </div>
      <div className="order-1 w-full overflow-hidden rounded-xl lg:order-2">
        <Image
          src={post.cover}
          alt={post.title}
          width={1200}
          height={800}
          className="h-full w-full object-cover transition-all duration-500 ease-in-out group-hover:opacity-80 group-hover:scale-[1.02]"
        />
      </div>
    </div>
  );
} 