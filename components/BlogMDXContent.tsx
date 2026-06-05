"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";
import Image from "next/image";
import { cn } from "@/components/lib/utils";
import SectionTitle from "@/components/mdx/SectionTitle";
import TestimonialBox from "@/components/mdx/TestimonialBox";
import LightboxImagePair from "@/components/mdx/LightboxImagePair";
import { Button } from "@/components/ui/button";

// Blog-specific MDX components — let prose handle typography,
// only override images and custom components.
const blogMdxComponents = {
  img: (props: any) => (
    <span className="not-prose block my-8 -mx-8 sm:-mx-16 md:-mx-24">
      <Image
        {...props}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto", objectFit: "contain", margin: "0" }}
        className="rounded-md"
      />
    </span>
  ),
  Image: (props: any) => (
    <span className="not-prose block my-8 -mx-8 sm:-mx-16 md:-mx-24">
      <Image
        {...props}
        className="w-full h-auto rounded-md"
        width={800}
        height={400}
      />
    </span>
  ),
  Button: (props: any) => <Button {...props} />,
  SectionTitle,
  TestimonialBox,
  LightboxImagePair,
  SimpleGrid: ({ children, columns = 1, col, gap = 4, ...props }: {
    children: React.ReactNode;
    columns?: number | string;
    col?: number | string;
    gap?: number | string;
  }) => {
    const selectedCol = col || columns;
    const colNum = typeof selectedCol === "string" ? parseInt(selectedCol) : selectedCol;

    const getGridClass = () => {
      switch (colNum) {
        case 1: return "grid-cols-1";
        case 2: return "grid-cols-1 md:grid-cols-2";
        case 3: return "grid-cols-1 md:grid-cols-3";
        case 4: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
        case 5: return "grid-cols-1 md:grid-cols-3 lg:grid-cols-5";
        case 6: return "grid-cols-1 md:grid-cols-3 lg:grid-cols-6";
        default: return "grid-cols-1 md:grid-cols-2";
      }
    };

    const getGapClass = () => {
      const gapNum = typeof gap === "string" ? parseInt(gap) : gap;
      switch (gapNum) {
        case 1: return "gap-1";
        case 2: return "gap-2";
        case 3: return "gap-3";
        case 4: return "gap-4";
        case 5: return "gap-5";
        case 6: return "gap-6";
        case 8: return "gap-8";
        default: return "gap-4";
      }
    };

    return (
      <div className={cn("not-prose grid", getGridClass(), getGapClass())} {...props}>
        {children}
      </div>
    );
  },
  GridItem: ({ children, colSpan, ...props }: {
    children: React.ReactNode;
    colSpan?: string | number;
  }) => {
    const spanNum = colSpan ? (typeof colSpan === "string" ? parseInt(colSpan) : colSpan) : 1;
    return (
      <div className={cn(`col-span-${spanNum}`, "flex items-center justify-center")} {...props}>
        {children}
      </div>
    );
  },
};

type BlogMDXContentProps = {
  code: string;
};

export default function BlogMDXContent({ code }: BlogMDXContentProps) {
  const MDXComponent = useMDXComponent(code);

  return (
    <article className={cn(
      "prose max-w-none",
      // Headings
      "prose-headings:font-heading prose-headings:text-foreground prose-headings:font-bold",
      "prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
      "prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3",
      // Body text — [&_p]/[&_li] have explicit specificity, overriding prose's inherited 1.75
      "prose-p:text-secondarytext [&_p]:leading-[2] prose-a:text-primary-500",
      // Links
      "prose-a:no-underline prose-a:border-b prose-a:border-primary-500 hover:prose-a:text-primary-600",
      // Lists
      "prose-li:text-secondarytext [&_li]:leading-[2]",
      // Blockquote
      "prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-secondarytext prose-blockquote:not-italic",
      // Code
      "prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none",
      "prose-pre:bg-card prose-pre:border prose-pre:border-border",
      // Images — handled by custom component above (not-prose)
      "prose-img:rounded-md",
      // Strong/em
      "prose-strong:text-foreground prose-strong:font-semibold",
      // HR
      "prose-hr:border-border",
      // Dark mode
      "dark:prose-invert",
    )}>
      <MDXComponent components={blogMdxComponents} />
    </article>
  );
}
