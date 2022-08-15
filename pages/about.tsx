import { NextPage } from "next";
import {
  Grid,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Center,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import Layout from "@/components/Layout";
import NextLink from "@/components/NextLink";
import Image from "next/image";

const AboutPage: NextPage = () => {
  return (
    <Layout>
      <Center display="flex" flexDir="column">
        <Box py="24" maxW={{ base: "initial", md: "60%" }}>
          <Heading>Hello, my name is Samuel Wong.</Heading>
          <Text>
            I got into product design because I&apos;m deeply passionate about
            technology and how it profoundly changes our way of living. Working
            on range of problems, including finance, travel and communication, I
            help solve users&apos; problem and creating delightful interfaces &
            experience for the past 7 years.
          </Text>
          <Button size="lg">
            <NextLink href="#contact" variant="noeffect">
              Let&apos;s Chat
            </NextLink>
          </Button>
        </Box>
        <Image
          src="/static/profile-2014.jpg"
          alt="Portrait of Samuel Wong"
          layout="intrinsic"
          width="1920"
          height="1280"
        />
      </Center>
      <Box py="24">
        <Heading fontSize="3xl" my="10">
          My Journey
        </Heading>
        <Box display={{ base: "block", md: "flex"}} gap="8">
          <Box>
            <Heading textTransform="uppercase">Interned At Apple</Heading>
            <Text>
              Majoring in Arts in college, I took a gap year working in iTunes &
              App Store, Apple. This valuable experience cultivated my interest
              and knowledge in digital products.
            </Text>
          </Box>
          <Box>
            <Heading textTransform="uppercase">Starting my agency</Heading>
            <Text>
              With growing freelance web & design projects, I founded a digital
              agency, Playa, to help small businesses, entrepreneurs, and
              non-profits launching their projects.
            </Text>
          </Box>
          <Box>
            <Heading textTransform="uppercase">Switching to product</Heading>
            <Text>
              Currently, I work as a UX/UI consultant in finance sector. Before
              that, I worked as a Principal Designer at Hyperair, a travel
              start-up based in Hong Kong.
            </Text>
          </Box>
        </Box>
      </Box>
      <Box>
        <Heading fontSize="4xl">Samuel Wong</Heading>
        <Box py="4">
          <Heading textTransform="uppercase" fontSize="md" my="4">Career</Heading>
          <Grid gap="4">
          <Box border="1px solid" borderColor="border" borderRadius="md" paddingX="4" paddingY="3" >
            <Heading>Product Designer @ OKX</Heading>
            <Text variant="small">2022 - Now</Text>
          </Box>
          <Box border="1px solid" borderColor="border" borderRadius="md" paddingX="4" paddingY="3" >
            <Heading>UX/UI Consultant @ HSBC</Heading>
            <Text variant="small">2021 - 2022</Text>
          </Box>
          <Box border="1px solid" borderColor="border" borderRadius="md" paddingX="4" paddingY="3" >
            <Heading>Principal Designer @ HyperAir</Heading>
            <Text variant="small">2019 - 2021</Text>
          </Box>
          </Grid>
        </Box>
        <Box py="4">
        <Heading textTransform="uppercase" fontSize="md" my="4">Education</Heading>
        <Box border="1px solid" borderColor="border" borderRadius="md" paddingX="4" paddingY="3" >
            <Heading>Bachelor of Arts, The University of Hong Kong</Heading>
            <Text variant="small">2011 - 2015</Text>
          </Box>
        </Box>
      </Box>
      <Box py="36" textAlign="center" id="contact">
        <Heading>Let&apos;s connect</Heading>
        <Text>
          Drop me a line if you want to say hi, or share your thoughts on my
          writings.
        </Text>
        <Button size="lg">
          <NextLink variant="noeffect" href="mailto:desktopofsamuel@gmail.com">
            Start Conversation
          </NextLink>
        </Button>
      </Box>
    </Layout>
  );
};

export default AboutPage;
