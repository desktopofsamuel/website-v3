import Image from "next/image";
import AnnotatedText from "@/components/AnnotatedText";
import type { Walk, WalkPhotoLayout } from "@/lib/walk-data";
import { walkChapterPhotos, walkOwnPhotos } from "@/lib/walk-data";

type WalkChapterProps = {
  walk: Walk;
  layout: WalkPhotoLayout;
  cityPhotos?: string[];
};

function BleedPhoto({
  src,
  sizes,
  className,
}: {
  src: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={`relative left-1/2 w-screen -translate-x-1/2 ${className ?? ""}`}>
      <Image
        src={src}
        alt=""
        width={1600}
        height={1200}
        className="h-[min(72vh,40rem)] w-full object-cover"
        sizes={sizes}
        priority={false}
      />
    </div>
  );
}

const STOP_UNDERLINE_COLORS = [
  "#F5C268",
  "#E07A5F",
  "#5BA3C9",
  "#C7A2D8",
  "#7CB87A",
];

function Stops({ walk }: { walk: Walk }) {
  return (
    <ol className="mt-10 max-w-[46ch] space-y-10">
      {walk.stops.map((stop, index) => (
        <li
          key={stop.id}
          className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-4 items-start"
        >
          <span className="font-heading font-normal text-[16px] leading-none text-muted-foreground pt-2">
            <AnnotatedText
              type="underline"
              color={STOP_UNDERLINE_COLORS[index % STOP_UNDERLINE_COLORS.length]}
              className="relative inline-block"
              delay={400 + index * 900}
            >
              {index + 1}
            </AnnotatedText>
          </span>
          <div>
            <h3 className="font-heading text-2xl text-foreground">
              {stop.title}
            </h3>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              {stop.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function DummyNote({
  walk,
  hasCityPhotos,
}: {
  walk: Walk;
  hasCityPhotos?: boolean;
}) {
  if (walkOwnPhotos(walk).length || hasCityPhotos) return null;
  return (
    <p className="mt-4 max-w-[36ch] font-body text-sm text-muted-foreground">
      Standing in until a {walk.title} photograph.
    </p>
  );
}

function BleedChapter({
  walk,
  cityPhotos,
}: {
  walk: Walk;
  cityPhotos?: string[];
}) {
  const photo = walkChapterPhotos(walk, "bleed", cityPhotos)[0];

  return (
    <article id={walk.slug} className="scroll-mt-[11rem] pt-20 md:pt-40">
      {photo ? <BleedPhoto src={photo} sizes="100vw" /> : null}
      <div className="px-6 md:px-10 pt-10 pb-20 md:pb-40">
        <DummyNote walk={walk} hasCityPhotos={Boolean(cityPhotos?.length)} />
        <h2 className="mt-10 font-heading text-4xl md:text-5xl text-foreground">
          {walk.title}
        </h2>
        <p className="mt-6 max-w-[42ch] font-body text-lg text-foreground">
          {walk.description}
        </p>
        <Stops walk={walk} />
        {walk.footnote ? (
          <p className="mt-10 max-w-[42ch] font-body text-sm text-muted-foreground">
            {walk.footnote}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function SpreadChapter({
  walk,
  cityPhotos,
}: {
  walk: Walk;
  cityPhotos?: string[];
}) {
  const photos = walkChapterPhotos(walk, "spread", cityPhotos);

  return (
    <article id={walk.slug} className="scroll-mt-[11rem]">
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {photos.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className={index > 0 ? "hidden md:block" : undefined}
            >
              <Image
                src={src}
                alt=""
                width={1200}
                height={900}
                className="h-[min(64vh,36rem)] w-full object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          ))}
        </div>
        <div className="px-6 md:px-10 py-8 md:py-10 bg-background">
          <h2 className="font-heading text-4xl md:text-5xl text-foreground">
            {walk.title}
          </h2>
          <p className="mt-4 max-w-[42ch] font-body text-lg text-foreground">
            {walk.description}
          </p>
        </div>
      </div>
      <div className="px-6 md:px-10 pt-10 pb-20 md:pb-40">
        <Stops walk={walk} />
        {walk.footnote ? (
          <p className="mt-10 max-w-[42ch] font-body text-sm text-muted-foreground">
            {walk.footnote}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function SplitChapter({
  walk,
  cityPhotos,
}: {
  walk: Walk;
  cityPhotos?: string[];
}) {
  const photo = walkChapterPhotos(walk, "split", cityPhotos)[0];

  return (
    <article
      id={walk.slug}
      className="scroll-mt-[11rem] px-6 md:px-10 pt-20 md:pt-40 pb-20 md:pb-40"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
        <div>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground">
            {walk.title}
          </h2>
          <p className="mt-6 max-w-[42ch] font-body text-lg text-foreground">
            {walk.description}
          </p>
          <Stops walk={walk} />
          {walk.footnote ? (
            <p className="mt-10 max-w-[42ch] font-body text-sm text-muted-foreground">
              {walk.footnote}
            </p>
          ) : null}
        </div>
        {photo ? (
          <figure className="md:sticky md:top-40">
            <Image
              src={photo}
              alt=""
              width={768}
              height={1024}
              className="w-full aspect-[3/4] object-cover"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
            <DummyNote
              walk={walk}
              hasCityPhotos={Boolean(cityPhotos?.length)}
            />
          </figure>
        ) : null}
      </div>
    </article>
  );
}

export default function WalkChapter({
  walk,
  layout,
  cityPhotos,
}: WalkChapterProps) {
  if (layout === "spread") {
    return <SpreadChapter walk={walk} cityPhotos={cityPhotos} />;
  }
  if (layout === "split") {
    return <SplitChapter walk={walk} cityPhotos={cityPhotos} />;
  }
  return <BleedChapter walk={walk} cityPhotos={cityPhotos} />;
}
