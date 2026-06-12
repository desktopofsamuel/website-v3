import type { Metadata } from "next";
import AppLayout from "@/components/AppLayout";
import { Link } from "@/components/AppLink";
import { allPhotos } from "contentlayer/generated";
import { sortByDate } from "@/utils";
import Image from "next/image";
import config from "@/../config";

const FALLBACK_IMAGE = "/static/2024-photo-of-year.jpg";

export const metadata: Metadata = {
  title: "Photography | Desktop of Samuel",
  description:
    "Travel photography from cities around the world. Sets of photos organized by location.",
  openGraph: {
    title: "Photography | Desktop of Samuel",
    description:
      "Travel photography from cities around the world. Sets of photos organized by location.",
    url: `${config.URL}/photo`,
  },
};

export default function PhotoListPage() {
  const photos = allPhotos.filter((p) => !p.draft).sort(sortByDate);

  return (
    <AppLayout>
      {/* Hero */}
      <div className="mx-divider px-overhang pt-16 pb-12 border-b border-border">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
          03 — Photography
        </p>
        <h1 className="font-body font-normal text-6xl md:text-8xl tracking-tighter leading-none text-foreground">
          Travel
          <br />
          Photography
        </h1>
        <p className="mt-8 max-w-[55ch] font-body text-base leading-relaxed text-muted-foreground">
          Inspired by cities and stories within. Collections of travel photographs organized by location.
        </p>
      </div>

      <div className="mx-divider px-overhang py-16 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {photos.map((post) => (
            <Link
              href={`/photo/${post.slug}/`}
              key={post.slug}
              className="group block relative rounded-md overflow-hidden border border-border bg-card transition-shadow hover:shadow-lg"
            >
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
