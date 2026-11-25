import Image from "next/image";
import Link from "@/components/AppLink";

const FALLBACK_IMAGE = "/static/2024-photo-of-year.jpg";

export const PHOTO_CARD_LAYOUTS = ["spine", "bleed", "split", "folio"] as const;

export type PhotoCardLayout = (typeof PHOTO_CARD_LAYOUTS)[number];

export type PhotoIndexItem = {
  slug: string;
  title: string;
  cover?: string | null;
};

function Cover({
  src,
  alt,
  sizes,
  className,
  priority,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={`object-cover ${className ?? ""}`}
      priority={priority}
    />
  );
}

function SpineCards({ photos }: { photos: PhotoIndexItem[] }) {
  return (
    <div className="px-page pb-20 md:pb-40">
      <div className="mx-auto w-full max-w-[32rem] flex flex-col gap-20 md:gap-40">
        {photos.map((post, index) => (
          <Link
            href={`/photo/${post.slug}/`}
            key={post.slug}
            className="group block text-center no-underline"
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-muted">
              <Cover
                src={post.cover || FALLBACK_IMAGE}
                alt={post.title}
                sizes="(max-width: 768px) 100vw, 32rem"
                priority={index < 2}
              />
            </div>
            <h2 className="mt-6 font-heading text-[20px] md:text-[30px] text-foreground">
              {post.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

function BleedCards({ photos }: { photos: PhotoIndexItem[] }) {
  return (
    <div className="overflow-x-hidden pb-20 md:pb-40">
      {photos.map((post, index) => (
        <Link
          href={`/photo/${post.slug}/`}
          key={post.slug}
          className="group block no-underline"
        >
          <div className="relative left-1/2 w-screen -translate-x-1/2 bg-muted">
            <div className="relative h-[min(72vh,40rem)] w-full">
              <Cover
                src={post.cover || FALLBACK_IMAGE}
                alt={post.title}
                sizes="100vw"
                priority={index < 1}
              />
            </div>
          </div>
          <div className="px-page pt-8 pb-20 md:pb-40">
            <h2 className="font-heading text-[30px] md:text-[50px] text-foreground">
              {post.title}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
}

function SplitCards({ photos }: { photos: PhotoIndexItem[] }) {
  return (
    <div className="px-page pb-20 md:pb-40 flex flex-col gap-20 md:gap-40">
      {photos.map((post, index) => (
        <Link
          href={`/photo/${post.slug}/`}
          key={post.slug}
          className="group grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center no-underline"
        >
          <h2 className="font-heading text-[30px] md:text-[50px] text-foreground order-2 md:order-1">
            {post.title}
          </h2>
          <div className="relative w-full aspect-[3/4] overflow-hidden bg-muted order-1 md:order-2">
            <Cover
              src={post.cover || FALLBACK_IMAGE}
              alt={post.title}
              sizes="(max-width: 768px) 100vw, 40vw"
              priority={index < 1}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}

function FolioCards({ photos }: { photos: PhotoIndexItem[] }) {
  return (
    <div className="px-page pb-20 md:pb-40">
      <div className="mx-auto w-full max-w-[56rem] flex flex-col gap-20 md:gap-40">
        {photos.map((post, index) => (
          <Link
            href={`/photo/${post.slug}/`}
            key={post.slug}
            className="group block no-underline"
          >
            <div className="relative w-full aspect-[3/2] overflow-hidden bg-muted">
              <Cover
                src={post.cover || FALLBACK_IMAGE}
                alt={post.title}
                sizes="(max-width: 768px) 100vw, 56rem"
                priority={index < 1}
              />
            </div>
            <h2 className="mt-6 font-heading text-[20px] md:text-[30px] text-foreground">
              {post.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PhotoIndexCards({
  photos,
  layout,
}: {
  photos: PhotoIndexItem[];
  layout: PhotoCardLayout;
}) {
  if (layout === "bleed") return <BleedCards photos={photos} />;
  if (layout === "split") return <SplitCards photos={photos} />;
  if (layout === "folio") return <FolioCards photos={photos} />;
  return <SpineCards photos={photos} />;
}

export function PhotoLayoutSwitch({ current }: { current: PhotoCardLayout }) {
  return (
    <p className="mt-10 font-eyebrow text-muted-foreground">
      {PHOTO_CARD_LAYOUTS.map((layout, index) => (
        <span key={layout}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          <Link
            href={layout === "spine" ? "/photo" : `/photo?layout=${layout}`}
            className={
              layout === current
                ? "text-foreground no-underline"
                : "text-muted-foreground no-underline hover:text-foreground"
            }
          >
            {layout}
          </Link>
        </span>
      ))}
    </p>
  );
}

export function parsePhotoCardLayout(value: string | undefined): PhotoCardLayout {
  if (value && PHOTO_CARD_LAYOUTS.includes(value as PhotoCardLayout)) {
    return value as PhotoCardLayout;
  }
  return "spine";
}
