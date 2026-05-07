import type { ReactNode } from "react";
import { cn } from "@/components/lib/utils";

type TestimonialBoxProps = {
  children?: ReactNode;
  quote?: string;
  author: string;
  role?: string;
  company?: string;
  fullBleed?: boolean;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  className?: string;
  quoteClassName?: string;
};

export default function TestimonialBox({
  children,
  quote,
  author,
  role,
  company,
  fullBleed = true,
  backgroundColor,
  textColor,
  borderColor,
  className,
  quoteClassName,
}: TestimonialBoxProps) {
  const customStyle = {
    backgroundColor,
    color: textColor,
    borderColor,
  };

  return (
    <figure
      className={cn(
        "not-prose my-10 w-full px-6 py-7 md:px-8 md:py-9",
        "rounded-2xl border border-border bg-muted/30",
        fullBleed &&
          "relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen max-w-none px-6 md:px-12 lg:px-16",
        className
      )}
      style={customStyle}
    >
      <div className="mx-auto w-full max-w-5xl">
        <blockquote
          className={cn(
            "text-5xl font-base leading-relaxed tracking-normal",
            quoteClassName
          )}
        >
          {quote ? (
            <p className="m-0 text-inherit leading-inherit tracking-inherit">{quote}</p>
          ) : (
            children
          )}
        </blockquote>
        <figcaption className="mt-6 text-sm">
          <span className="font-heading text-base font-semibold">{author}</span>
          {role || company ? <span> - {[role, company].filter(Boolean).join(", ")}</span> : null}
        </figcaption>
      </div>
    </figure>
  );
}
