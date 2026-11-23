import Link from "@/components/AppLink";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import EyebrowLabel from "@/components/EyebrowLabel";

export default function AppListPortfolio({ data }: any) {
  const post = data;

  return (
    <div
      role="group"
      className="grid grid-cols-1 gap-4 border border-border p-6 rounded-2xl lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:p-8"
    >
      <div className="order-2 flex flex-col items-start gap-4 lg:order-1 lg:gap-2">
        <EyebrowLabel className="mb-2" color={post.color}>{post.subtitle}</EyebrowLabel>
        <h2 className="text-4xl font-heading">{post.title}</h2>
        <p className="font-body text-base text-muted-foreground">{post.description}</p>
        <Button asChild>
          <Link href={`/work/${post.slug}/`}>View Process</Link>
        </Button>
      </div>
      <div className="order-1 flex w-full items-center justify-center overflow-hidden rounded-xl lg:order-2 lg:h-full">
        <Image
          src={post.cover}
          alt={post.title}
          width={1200}
          height={800}
          className="h-full w-full object-contain transition-all duration-500 ease-in-out group-hover:opacity-80 group-hover:scale-[1.02]"
        />
      </div>
    </div>
  );
} 