import AppLayout from "@/components/AppLayout";
import { Link } from "@/components/AppLink";
import { allPhotos } from "contentlayer/generated";
import { sortByDate } from "@/utils";
import Image from "next/image";

const FALLBACK_IMAGE = "/static/2024-photo-of-year.jpg";

export default function PhotoListPage() {
  const photos = allPhotos.sort(sortByDate);

  return (
    <AppLayout>
      <div className="py-8 font-body">
        <h1 className="mb-4 text-5xl md:text-6xl font-bold font-heading">
          Photography
        </h1>
        <p className="text-lg mb-8" style={{ color: "var(--color-secondarytext)", fontFamily: "var(--font-body)" }}>
          I’m greatly inspired by cities and stories within. Therefore I publish sets of photos according to cities that I have visited. More photos on my Instagram.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {photos.map((post) => (
            <Link href={`/photo/${post.slug}/`} key={post.slug} className="group block relative rounded-md overflow-hidden border border-border bg-card transition-shadow hover:shadow-lg">
              <div className="relative w-full aspect-[1.5/1] bg-muted">
                <Image
                  src={post.cover || FALLBACK_IMAGE}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover w-full h-full transition-all duration-500 group-hover:opacity-80 group-hover:scale-105"
                  style={{ borderRadius: "var(--radius-lg)" }}
                  priority
                />
                <span className="absolute bottom-0 left-0 w-full px-4 py-3 bg-gradient-to-t from-black/70 to-transparent text-white font-heading text-xl font-bold" style={{ borderBottomLeftRadius: "var(--radius-lg)", borderBottomRightRadius: "var(--radius-lg)" }}>
                  {post.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
