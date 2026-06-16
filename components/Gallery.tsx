"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import Lightbox, { LightboxItem } from "@/components/Lightbox";

type GalleryContextValue = {
  items: LightboxItem[];
  open: (index: number, rect: DOMRect | null) => void;
};

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function useGallery(): GalleryContextValue {
  const ctx = useContext(GalleryContext);
  if (!ctx) {
    throw new Error("useGallery() must be used inside a <Gallery> provider");
  }
  return ctx;
}

type GalleryProps = {
  items: LightboxItem[];
  children: React.ReactNode;
};

export default function Gallery({ items, children }: GalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  const open = useCallback((i: number, rect: DOMRect | null) => {
    setOriginRect(rect);
    setIndex(i);
  }, []);

  const navigate = useCallback(
    (dir: "next" | "prev") => {
      setIndex((current) => {
        if (current === null) return current;
        if (dir === "next") return Math.min(current + 1, items.length - 1);
        return Math.max(current - 1, 0);
      });
    },
    [items.length]
  );

  const value = useMemo(() => ({ items, open }), [items, open]);

  return (
    <GalleryContext.Provider value={value}>
      {children}
      <Lightbox
        item={index !== null ? items[index] : null}
        originRect={originRect}
        onClose={() => setIndex(null)}
        onNavigate={navigate}
        hasNext={index !== null && index < items.length - 1}
        hasPrev={index !== null && index > 0}
      />
    </GalleryContext.Provider>
  );
}
