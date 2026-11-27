import Image from "next/image";
import dayjs from "dayjs";
import MDXContent from "@/components/mdx-components";

type WorkCdArticleProps = {
  title: string;
  description: string;
  cover?: string;
  role?: string;
  tags?: string[];
  year?: string;
  platform?: string;
  date: string;
  code: string;
};

export default function WorkCdArticle({
  title,
  description,
  cover,
  role,
  tags,
  year,
  platform,
  date,
  code,
}: WorkCdArticleProps) {
  return (
    <article
      data-detail-panel
      className="work-cd-copy work-cd-detail-copy pointer-events-auto absolute top-0 right-0 z-10 overflow-y-auto px-6 pt-24 pb-8"
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <header className="mb-8 flex w-full flex-col items-center gap-3">
          <h1 data-typeset className="font-heading text-3xl text-balance lg:text-5xl">
            {title}
          </h1>
          <p
            data-typeset
            className="font-body max-w-prose text-base text-neutral-600 lg:text-lg"
          >
            {description}
          </p>
          {cover ? (
            <div
              data-typeset
              className="mt-3 w-full max-w-sm overflow-hidden rounded-lg"
            >
              <Image
                src={cover}
                alt={title}
                width={1200}
                height={800}
                className="h-auto max-h-44 w-full object-contain"
                priority
              />
            </div>
          ) : null}
        </header>
        <section
          data-typeset
          className="mb-8 w-full max-w-prose text-center [&_img]:mx-auto [&_p]:mx-auto"
        >
          <MDXContent code={code} />
        </section>
        <section
          data-typeset
          className="mb-8 flex w-full max-w-md flex-wrap justify-center gap-x-10 gap-y-6"
        >
          {role ? (
            <div>
              <div className="mb-1 text-sm text-neutral-500">Role</div>
              <div className="font-heading text-xl">{role}</div>
            </div>
          ) : null}
          {tags && tags.length > 0 ? (
            <div>
              <div className="mb-1 text-sm text-neutral-500">Industry</div>
              <div className="font-heading text-xl">{tags.join(", ")}</div>
            </div>
          ) : null}
          {year ? (
            <div>
              <div className="mb-1 text-sm text-neutral-500">Timeframe</div>
              <div className="font-heading text-xl">{year}</div>
            </div>
          ) : null}
          {platform ? (
            <div>
              <div className="mb-1 text-sm text-neutral-500">Platforms</div>
              <div className="font-heading text-xl">{platform}</div>
            </div>
          ) : null}
        </section>
        <p data-typeset className="mb-8 text-sm text-neutral-500">
          Last update on {dayjs(date).format("MMM DD, YYYY")}
        </p>
      </div>
    </article>
  );
}
