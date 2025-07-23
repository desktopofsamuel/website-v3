"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";

const mdxComponents = {
  Image: (props: any) => (
    <div className="my-6">
      <Image
        {...props}
        className="w-full h-auto rounded-lg"
        width={800}
        height={400}
      />
    </div>
  ),
  img: (props: any) => (
    <span className="block relative w-full flex justify-center items-center">
      <Image
        {...props}
        className="w-full h-auto rounded-lg"
        width={0}
        height={0}
        sizes="100vw"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
          margin: "0"
        }}
      />
    </span>
  ),
  h1: (props: any) => (
    <h1 {...props} className="font-heading text-3xl font-bold mt-8 mb-4" />
  ),
  h2: (props: any) => (
    <h2 {...props} className="font-heading text-2xl font-bold mt-6 mb-3" />
  ),
  h3: (props: any) => (
    <h3 {...props} className="font-heading text-xl font-bold mt-4 mb-2" />
  ),
  p: (props: any) => (
    <p {...props} className="mb-4 leading-relaxed" />
  ),
  ul: (props: any) => (
    <ul {...props} className="list-disc list-inside mb-4 space-y-1" />
  ),
  ol: (props: any) => (
    <ol {...props} className="list-decimal list-inside mb-4 space-y-1" />
  ),
  li: (props: any) => (
    <li {...props} className="mb-1" />
  ),
  blockquote: (props: any) => (
    <blockquote {...props} className="border-l-4 border-gray-300 pl-4 italic my-4" />
  ),
  code: (props: any) => (
    <code {...props} className="px-1 py-0.5 rounded text-sm" />
  ),
  pre: (props: any) => (
    <pre {...props} className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto my-4" />
  ),
  a: (props: any) => (
    <a {...props} className="text-primary-500 hover:text-primary-600 no-underline border-b-2 border-primary-500" />
  ),
  strong: (props: any) => (
    <strong {...props} className="font-bold" />
  ),
  em: (props: any) => (
    <em {...props} className="italic" />
  ),
  Button: (props: any) => <Button {...props} />,
  // Photo gallery components
  SimpleGrid: ({ children, columns = 1, col, gap = 4, ...props }: { 
    children: React.ReactNode; 
    columns?: number | string;
    col?: number | string; // Legacy support
    gap?: number | string;
  }) => {
    // Support both 'columns' and 'col' props for backward compatibility
    const selectedCol = col || columns;
    const colNum = typeof selectedCol === 'string' ? parseInt(selectedCol) : selectedCol;
    
    // Use explicit classes to ensure they're included in Tailwind's build
    const getGridClass = () => {
      switch (colNum) {
        case 1: return 'grid-cols-1';
        case 2: return 'grid-cols-1 md:grid-cols-2';
        case 3: return 'grid-cols-1 md:grid-cols-3';
        case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
        case 5: return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5';
        case 6: return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6';
        default: return 'grid-cols-1 md:grid-cols-2';
      }
    };
    
    const getGapClass = () => {
      switch (gap) {
        case 1: return 'gap-1';
        case 2: return 'gap-2';
        case 3: return 'gap-3';
        case 4: return 'gap-4';
        case 5: return 'gap-5';
        case 6: return 'gap-6';
        case 8: return 'gap-8';
        default: return 'gap-4';
      }
    };
    
    return (
      <div 
        className={cn("grid", getGridClass(), getGapClass())}
        {...props}
      >
        {children}
      </div>
    );
  },
  GridItem: ({ children, colSpan, ...props }: { 
    children: React.ReactNode; 
    colSpan?: string | number;
  }) => {
    const spanNum = colSpan ? (typeof colSpan === 'string' ? parseInt(colSpan) : colSpan) : 1;
    
    return (
      <div 
        className={cn(`col-span-${spanNum}`, "flex items-center justify-center")} 
        {...props}
      >
        {children}
      </div>
    );
  },
};

type MDXContentProps = {
  code: string;
};

export default function MDXContent({ code }: MDXContentProps) {
  const MDXComponent = useMDXComponent(code);

  return (
    <div className="prose prose-lg max-w-none">
      <MDXComponent components={mdxComponents} />
    </div>
  );
} 