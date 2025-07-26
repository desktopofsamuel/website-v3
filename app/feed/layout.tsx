import { Metadata } from "next";
import { ReactNode } from "react";
import AppLayout from "@/components/AppLayout";

export const metadata: Metadata = {
  title: "Feed | Desktop of Samuel",
  description: "A collection of interesting links, thoughts, and discoveries.",
  openGraph: {
    title: "Feed | Desktop of Samuel",
    description:
      "A collection of interesting links, thoughts, and discoveries.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Feed | Desktop of Samuel",
    description:
      "A collection of interesting links, thoughts, and discoveries.",
  },
};

interface FeedLayoutProps {
  children: ReactNode;
}

export default function FeedLayout({ children }: FeedLayoutProps) {
  return (
    <AppLayout>
      <div className="py-8">
        <h1 className="mb-4 text-4xl md:text-6xl font-bold leading-tight font-heading">
          Feed
        </h1>
        <p className="text-lg text-secondarytext leading-normal">
          A collection of interesting links, thoughts, and discoveries.
        </p>
      </div>

      <main>{children}</main>
    </AppLayout>
  );
}
