"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import Lightbox, { LightboxItem } from "@/components/Lightbox";

type Engagement = {
  title: string;
  subtitle: string;
  image: StaticImageData;
};

type EngagementGalleryProps = {
  engagements: Engagement[];
};

export default function EngagementGallery({ engagements }: EngagementGalleryProps) {
  const [selected, setSelected] = useState<LightboxItem | null>(null);

  return (
    <>
      <div>
        {engagements.map((event, i) => (
          <div
            key={event.title}
            className={`py-6 ${
              i < engagements.length - 1 ? "border-b border-border/50" : ""
            } ${i === 0 ? "pt-0" : ""} ${
              i === engagements.length - 1 ? "pb-0" : ""
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
              <button
                className="aspect-[16/10] rounded-md overflow-hidden bg-lift w-full cursor-zoom-in"
                onClick={() =>
                  setSelected({
                    src: event.image,
                    alt: event.title,
                    title: event.title,
                    subtitle: event.subtitle,
                  })
                }
                aria-label={`View photo: ${event.title}`}
              >
                <Image
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-[filter] duration-700 ease-in-out"
                  placeholder="blur"
                />
              </button>
              <div>
                <div className="font-body text-xl tracking-tight text-foreground mb-1">
                  {event.title}
                </div>
                <div className="font-body text-sm leading-6 text-muted-foreground">
                  {event.subtitle}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Lightbox item={selected} onClose={() => setSelected(null)} />
    </>
  );
}
