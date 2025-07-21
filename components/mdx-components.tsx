"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
      <Image
        {...props}
        className="w-full h-auto rounded-lg"
        width={800}
        height={400}
      />
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
    <code {...props} className="bg-gray-100 px-1 py-0.5 rounded text-sm" />
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