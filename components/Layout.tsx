import { Container } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

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
      <NavBar />
      <Container as="main" maxW="1080px">
        {children}
      </Container>
      <Footer/>
    </>
  );
}
