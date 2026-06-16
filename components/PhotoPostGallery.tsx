"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import MDXContent from "@/components/mdx-components";
import Gallery, { useGallery } from "@/components/Gallery";
import type { LightboxItem } from "@/components/Lightbox";

type PhotoPostGalleryProps = {
  items: LightboxItem[];
  code: string;
};

export default function PhotoPostGallery({ items, code }: PhotoPostGalleryProps) {
  const components = useMemo(() => ({ img: GalleryImg }), []);
  return (
    <Gallery items={items}>
      <MDXContent code={code} components={components} />
    </Gallery>
  );
}

type ImgProps = {
  src?: string;
  alt?: string;
};

function GalleryImg({ src, alt }: ImgProps) {
  const { items, open } = useGallery();
  const ref = useRef<HTMLDivElement>(null);
  const index = src ? items.findIndex((it) => it.src === src) : -1;

  if (!src) return null;

  return (
    <button
      ref={ref as unknown as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={(e) => {
        if (index >= 0) {
          open(index, e.currentTarget.getBoundingClientRect());
        }
      }}
      className="block relative w-full cursor-zoom-in"
      aria-label={alt ? `View photo: ${alt}` : "View photo"}
    >
      <Image
        src={src}
        alt={alt ?? ""}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto rounded-lg object-contain"
        style={{ margin: 0 }}
      />
    </button>
  );
}
