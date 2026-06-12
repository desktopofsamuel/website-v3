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

  return (
    <>
      <button
        className="w-full cursor-zoom-in rounded-md overflow-hidden"
        onClick={() => setSelected(portraitItem)}
        aria-label="View portrait photo"
      >
        <Image
          src={ProfilePortrait}
          alt="Portrait of Samuel Wong"
          placeholder="blur"
          sizes="(min-width: 768px) 25vw, 100vw"
          className="w-full h-auto"
        />
      </button>
      <Lightbox item={selected} onClose={() => setSelected(null)} />
    </>
  );
}
