import Layout from "components/Layout";
import {
  allPhotos,
  allPosts,
  allWorks,
  Post,
  Work,
  Photo,
} from "contentlayer/generated";
import {
  Grid,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Box,
  Flex,
  VStack,
  HStack,
} from "@chakra-ui/react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { sortByDate } from "../utils";
import type { NextPage } from "next";
import { useRef, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import ListBlog from "@/components/ListBlog";
import ListPortfolio from "@/components/ListPortfolio";
import Image from "next/image";
import CardBook from "@/components/CardBook";
import CardCurrentlyPlaying from "@/components/CardCurrentlyPlaying";
import CardMusic from "@/components/CardMusic";
import CardFilms from "@/components/CardFilms";
import NextLink from "@/components/NextLink";
import NextImage from "@/components/NextImage";
import { ArrowForwardIcon } from "@chakra-ui/icons";
// import { motion } from "framer-motion";

export const getStaticProps: GetStaticProps<{
  posts: Post[];
  works: Work[];
  photos: Photo[];
}> = () => {
  return {
    props: {
      posts: allPosts.sort(sortByDate).slice(0, 4),
      works: allWorks.filter((post) => post.feature === true && post.draft !== true).sort(sortByDate),
      photos: allPhotos.sort(sortByDate).slice(0, 8),
    },
  };
};

export default function IndexPage({
  posts,
  works,
  photos,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // Add refs for the photo rows
  const leftRowRef = useRef<HTMLDivElement>(null);
  const rightRowRef = useRef<HTMLDivElement>(null);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (leftRowRef.current && rightRowRef.current) {
        // Calculate how far down the page we've scrolled
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight;
        
        // Get the position of the photo container
        const photoContainer = document.querySelector('.photo-scroll-container');
        if (!photoContainer) return;
        
        const containerRect = photoContainer.getBoundingClientRect();
        const containerTop = containerRect.top + window.scrollY;
        const containerBottom = containerRect.bottom + window.scrollY;
        
        // Only apply the effect when the container is in view
        if (scrollPosition + windowHeight > containerTop && scrollPosition < containerBottom) {
          // Calculate how much to move based on scroll position
          const scrollPercentage = (scrollPosition + windowHeight - containerTop) / 
                                  (windowHeight + containerRect.height);
          
          // Move the rows in opposite directions
          const moveAmount = scrollPercentage * 15; // Adjust this value to control movement speed
          
          leftRowRef.current.style.transform = `translateX(-${moveAmount}%)`;
          rightRowRef.current.style.transform = `translateX(${moveAmount}%)`;
        }
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial call to position elements
    handleScroll();
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Layout
    // keywords="Samuel Wong, Hong Kong, UI, UX, User Interface Design, User Experience Design, Product Design, Design Thinking, Product Development, Brand Design"
    >
      <Head>
        <meta
          name="follow.it-verification-code"
          content="aYHmMlGswgxauPT7REPs"
        />
      </Head>
      <Flex
        flexDir={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="baseline"
      >
        <Heading variant="pagetitle" as="h1">
          Desktop of Samuel
        </Heading>
      </Flex>
      <Text color="secondarytext">
        Full-stack UI/UX designer crafting websites & mobile applications with
        bespoke experience.
      </Text>
      <SimpleGrid columns={2} row={2} gap={4}>
        <CardBook />
        <CardMusic />
        <CardCurrentlyPlaying />
        <CardFilms />
      </SimpleGrid>
      <Box my="8">
        <Heading variant="title">Interaction and Experience Design</Heading>
        <Text>
          Extensive experience delivering products in corporations and start-ups
        </Text>

        <Link href="/work" legacyBehavior>
          <Button>View Process</Button>
        </Link>
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        > */}
        {works.map((post) => (
          <ListPortfolio key={post.slug} data={post} />
        ))}
        {/* </motion.div> */}
      </Box>

      <Heading variant="title">Notes on Design & Technology</Heading>
      <Text>I write about design, technology and productivity.</Text>
      <Link href="/blog" legacyBehavior>
        <Button>Read my blog</Button>
      </Link>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {posts.map((post) => (
          <ListBlog key={post.slug} data={post} />
        ))}
      </SimpleGrid>
      <Box my="8">
        <Heading variant="title">Tools & Resources</Heading>
        <Text>
          Best resources and tools I have been using. Guide on getting started
          in design & code.
        </Text>
        <Link href="/resources" legacyBehavior>
          <Button>My awesome setup</Button>
        </Link>
      </Box>
      
      {/* Photo Gallery with Scroll Interaction */}
      <Box
        position="relative"
        width="100%"
        overflow="hidden"
        my="12"
      >
        <Heading variant="title" mb="4">Through the lens</Heading>
        <Text mb="6">Sets of photos according to cities that I have visited.</Text>
        <Link href="/photo" legacyBehavior>
              <Button rightIcon={<ArrowForwardIcon />} mb="4">
                View all photos
              </Button>
            </Link>
        <Box 
          as="section" 
          className="photo-scroll-container"
          position="relative"
          height={{base: "600px", md: "500px"}}
          width="100%"
        >
          {/* First row - moves left on scroll */}
          <Box 
            className="photo-row photo-row-left"
            position="absolute"
            top="0"
            left="0"
            width="200%"
            height="48%"
            display="flex"
            gap="4"
            ref={leftRowRef}
            transition="transform 0.3s ease-out"
          >
            {[...photos.slice(0, 4), ...photos.slice(0, 4)].map((post, index) => (
              <Box 
                key={`${post.slug}-${index}`}
                role="group" 
                overflow="hidden"
                position="relative"
                height="100%"
                minWidth={{base: "280px", md: "350px"}}
                borderRadius="md"
              >
                <NextLink href={`/photo/${post.slug}`}>
                  <Box 
                    position="relative" 
                    width="100%" 
                    height="100%"
                    overflow="hidden"
                  >
                    <Image
                      src={post.cover || ''}
                      alt={post.title || ''}
                      fill
                      sizes="(max-width: 768px) 280px, 350px"
                      style={{ 
                        objectFit: "cover",
                        transition: "all 0.5s ease-in-out"
                      }}
                      className="group-hover:scale-105"
                    />
                  </Box>
                </NextLink>
              </Box>
            ))}
          </Box>

          
          {/* Second row - moves right on scroll */}
          <Box 
            className="photo-row photo-row-right"
            position="absolute"
            bottom="0"
            right="0"
            width="200%"
            height="48%"
            display="flex"
            gap="4"
            ref={rightRowRef}
            transition="transform 0.3s ease-out"
          >
            {[...photos.slice(4, 8), ...photos.slice(4, 8)].map((post, index) => (
              <Box 
                key={`${post.slug}-${index}`}
                role="group" 
                overflow="hidden"
                position="relative"
                height="100%"
                minWidth={{base: "280px", md: "350px"}}
                borderRadius="md"
              >
                <NextLink href={`/photo/${post.slug}`}>
                  <Box 
                    position="relative" 
                    width="100%" 
                    height="100%"
                    overflow="hidden"
                  >
                    <Image
                      src={post.cover || ''}
                      alt={post.title || ''}
                      fill
                      sizes="(max-width: 768px) 280px, 350px"
                      style={{ 
                        objectFit: "cover",
                        transition: "all 0.5s ease-in-out"
                      }}
                      className="group-hover:scale-105"
                    />
                  </Box>
                </NextLink>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
