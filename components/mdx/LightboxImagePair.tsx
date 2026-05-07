import Image from "next/image";

type ImageItem = {
  src: string;
  alt: string;
  label?: string;
  caption?: string;
};

type LightboxImagePairProps = {
  left: ImageItem;
  right: ImageItem;
  gap?: number;
};

function ImageCard({ item }: { item: ImageItem }) {
  return (
    <figure className="not-prose flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Image
          src={item.src}
          alt={item.alt}
          width={1400}
          height={900}
          className="h-auto w-full"
        />
      </div>
      {item.label ? (
        <figcaption className="font-heading text-sm uppercase tracking-wide text-secondarytext">
          {item.label}
        </figcaption>
      ) : null}
      {item.caption ? <p className="text-sm text-secondarytext my-0">{item.caption}</p> : null}
    </figure>
  );
}

export default function LightboxImagePair({
  left,
  right,
  gap = 4,
}: LightboxImagePairProps) {
  const gapClass = Number(gap) === 8 ? "gap-8" : Number(gap) === 6 ? "gap-6" : "gap-4";

  return (
    <section className={`not-prose my-10 grid grid-cols-1 md:grid-cols-2 ${gapClass}`}>
      <ImageCard item={left} />
      <ImageCard item={right} />
    </section>
  );
}
