import { Container } from "@chakra-ui/react";
import Link from "next/link";
import { NextSeo } from "next-seo";

type LayoutProps = {
  title?: string;
  description?: string;
  keywords?: [string];
  children: React.ReactNode;
};

export default function Layout({
  title,
  description,
  keywords,
  children,
}: LayoutProps) {
  return (
    <>
      <NextSeo title={title} description={description} />
      <nav>
        <p>Desktop of Samuel</p>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <li>
            <Link href="/work">Work</Link>
          </li>
        </ul>
      </nav>
      <Container as="main" maxW="800px">
        {children}
      </Container>
    </>
  );
}
