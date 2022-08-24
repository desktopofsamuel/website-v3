import { NextPage } from "next";
import {
  Grid,
  Flex,
  Box,
  Heading,
  SimpleGrid,
  Text,
  Button,
  Center,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import Profile from "../public/static/profile-2014.jpeg";
import Layout from "@/components/Layout";
import NextLink from "@/components/NextLink";
import Image from "next/future/image";
import NextImage from "@/components/NextImage";
import HSBC from "../public/about/hsbc.svg";
import HyperAir from "../public/about/hyperair.svg";
import Playa from "../public/about/playa.svg";

type Props = {
  title: string, 
  text: string, 
  image?: string,
}

const Entry: React.FC<Props> = ({ title, text, image }) => {
  return <Flex
    justifyContent="space-between"
    border="1px solid"
    borderColor="border"
    borderRadius="lg"
    paddingX="4"
    paddingY="3"
  >
    <Box>
      <Heading>{title}</Heading>
      <Text variant="small">{text}</Text>
    </Box>
    {image && <Image src={image} alt="HSBC Logo" />}
  </Flex>;
};

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
          src={Profile}
          alt="Portrait of Samuel Wong"
          placeholder="blur"
          width="1920"
          height="1280"
        />
      </Center>
      <Box py="24">
        <Heading fontSize="3xl" my="10">
          My Journey
        </Heading>
        <SimpleGrid columns={[1, 1, 3]} gap="8">
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
              Currently, I work as a UX/UI consultant in crypto sector. Before
              that, I built products for bank and startup.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
      <Box>
        <Heading fontSize="4xl">Samuel Wong</Heading>
        <Box py="4">
          <Heading textTransform="uppercase" fontSize="md" my="4">
            Career
          </Heading>
          <Grid gap="4">
            <Entry title="Product Designer @ OKX" text="2022 - Now" />
            <Entry title="UX/UI Consultant @ HSBC" text="2021 - 2022" image={HSBC}/>
            <Entry title="Principal Designer @ HyperAir" text="2019 - 2021" image={HyperAir}/>
            <Entry title="Co-founder & Design Lead @ Playa" text="2015 - 2019" image={Playa}/>
          </Grid>
        </Box>
        <Box py="4">
          <Heading textTransform="uppercase" fontSize="md" my="4">
            Education
          </Heading>
          <Grid
            border="1px solid"
            borderColor="border"
            borderRadius="lg"
            paddingX="4"
            paddingY="3"
          >
            <Heading>Bachelor of Arts, The University of Hong Kong</Heading>
            <Text variant="small">2011 - 2015</Text>
          </Grid>
        </Box>
        <Box py="4">
          <Heading textTransform="uppercase" fontSize="md" my="4">
            Community
          </Heading>
          <Entry title="Community moderator @ Friends of Figma, Hong Kong" text="2022 - Now"/>
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
