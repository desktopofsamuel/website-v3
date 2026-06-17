"use client";

import { useState } from "react";
import Image from "next/image";
import ProfilePortrait from "../public/about/profile.png";
import Lightbox, { LightboxItem } from "@/components/Lightbox";

const portraitItem: LightboxItem = {
  src: ProfilePortrait,
  alt: "Portrait of Samuel Wong",
};

export default function ProfilePortraitLightbox() {
  const [selected, setSelected] = useState<LightboxItem | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  return (
    <>
      <button
        type="button"
        className="block w-full cursor-zoom-in border-0 bg-transparent p-0 shadow-none appearance-none transition-transform duration-300 ease-out hover:rotate-1 motion-reduce:hover:rotate-0"
        onClick={(e) => {
          setOriginRect(e.currentTarget.getBoundingClientRect());
          setSelected(portraitItem);
        }}
        aria-label="View portrait photo"
      >
        <div className="isolate overflow-hidden rounded-md">
          <Image
            src={ProfilePortrait}
            alt="Portrait of Samuel Wong"
            placeholder="blur"
            sizes="(min-width: 768px) 25vw, 100vw"
            className="block h-auto w-full rounded-md"
          />
        </div>
      </button>
      <Lightbox
        item={selected}
        originRect={originRect}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
