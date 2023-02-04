import { NextPage } from "next";
import {
  Grid,
  Flex,
  Box,
  Heading,
  SimpleGrid,
  Text,
  Button,
  Spacer,
  Center,
  UnorderedList,
  ListItem,
  VStack,
  HStack,
} from "@chakra-ui/react";
import Profile2022 from "../public/static/samuel-profile-2022.jpeg";
import Profile from "../public/static/profile-2014.jpeg";
import Layout from "@/components/Layout";
import NextLink from "@/components/NextLink";
import Image from "next/image";
import NextImage from "@/components/NextImage";
import HSBC from "../public/about/hsbc.svg";
import HyperAir from "../public/about/hyperair.svg";
import Playa from "../public/about/playa.svg";
import Apple from "../public/about/apple.svg";
import OKX from "../public/about/okx.svg";
import Figma from "../public/about/figma.svg";
import Adplist from "../public/about/adplist.svg";

type Props = {
  title: string;
  subtitle?: string;
  text: string;
  image?: string;
};

const Entry: React.FC<Props> = ({ title, text, image, subtitle }) => {
  return (
    <Grid
      // justifyContent="space-between"
      gridTemplateColumns={{ base: "72px auto", md: "max-content auto" }}
      gap="4"
      alignItems="center"
      border="1px solid"
      borderColor="border"
      borderRadius="lg"
      paddingX={{ base: 2, md: 4 }}
      paddingY={{ base: 2, md: 3 }}
    >
      {image && (
        <Box
          _hover={{ opacity: 0.5 }}
          transition="all 500ms ease-in-out"
          opacity={1}
        >
          <Image src={image} alt={`Logo of ${subtitle}`} />
        </Box>
      )}
      <Box>
        <Heading fontSize={{ base: "lg", md: "2xl" }}>{title}</Heading>
        <Text fontFamily="heading" fontSize="lg" textTransform="uppercase" my="0">
          {subtitle}
        </Text>
        <Text variant="small" my="0">
          {text}
        </Text>
      </Box>
    </Grid>
  );
};

const AboutPage: NextPage = () => {
  return (
    <Layout>
      <Grid
        gridTemplateColumns={{ base: "auto", md: "auto auto" }}
        gap={{ base: "4", md: "16" }}
        alignItems="center"
        py={{ base: "4", md: "16" }}
      >
        <Image
          src={Profile2022}
          alt="Portrait of Samuel Wong"
          placeholder="blur"
          width="240"
          height="240"
          style={{
            borderRadius: "50%",
          }}
        />

        <Box maxW={{ base: "initial", md: "80%" }}>
          <Heading>Hello, my name is Samuel.</Heading>
          <Text>
            I got into product design because I&apos;m deeply passionate about
            technology and how it profoundly changes our way of living. For the
            past 8 years, I have been solving users and business problems and
            delivering delightful interfaces & experiences across domains
            like web3, finance, and travel industries.
          </Text>
          <HStack>
            <Button size="lg">
              <NextLink href="#contact" variant="noeffect">
                Let&apos;s Chat
              </NextLink>
            </Button>
            <Button size="lg" variant="outline" color="blue.500">
              <NextLink href="#resume" variant="noeffect">
                My resume
              </NextLink>
            </Button>
          </HStack>
        </Box>
      </Grid>
      <Box py="16">
        <Heading fontSize="3xl" my="10">
          My Journey
        </Heading>
        <SimpleGrid columns={[1, 1, 3]} gap="8">
          <Box>
            <Heading textTransform="uppercase" fontSize="2xl">
              Interned At Apple
            </Heading>
            <Text>
              Majoring in Arts in college, I took a gap year working in iTunes &
              App Store, Apple. This valuable experience cultivated my interest
              and knowledge in digital products.
            </Text>
          </Box>
          <Box>
            <Heading textTransform="uppercase" fontSize="2xl">
              Starting my agency
            </Heading>
            <Text>
              With growing freelance web & design projects, I co-founded a
              digital agency after graduation. Me and my team helped small
              businesses, entrepreneurs, and non-profits launching their
              projects.
            </Text>
          </Box>
          <Box>
            <Heading textTransform="uppercase" fontSize="2xl" 
              >
              Switching to product
            </Heading>
            <Text>
              After that, I had worked in start-up & corporation as a prdouct
              designer. Currently I am working as a Product Designer in the
              crypto industry.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
      <Box py="12">
        <Image
          src={Profile}
          alt="Portrait of Samuel Wong"
          placeholder="blur"
          width="1920"
          height="1280"
        />
      </Box>
      <Box id="resume">
        <Heading fontSize="4xl">Resume of Samuel Wong</Heading>
        <Box py="4">
          <Heading textTransform="uppercase" fontSize="md" my="4">
            Career
          </Heading>
          <Grid gap="4">
            <Entry
              title="Product Designer"
              subtitle="OKX"
              text="2022 - Now"
              image={OKX}
            />
            <Entry
              title="UX/UI Consultant"
              subtitle="HSBC via Protiviti"
              text="2021 - 2022"
              image={HSBC}
            />
            <Entry
              title="Principal Designer"
              subtitle="HyperAir"
              text="2019 - 2021"
              image={HyperAir}
            />
            <Entry
              title="Co-founder & Design Lead"
              subtitle="Playa"
              text="2015 - 2019"
              image={Playa}
            />
            <Entry
              title="Cross Content Intern"
              subtitle="Apple"
              text="2012 - 2013"
              image={Apple}
            />
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
          <Grid gap="4">
          <Entry
            title="Community Moderator"
            subtitle="Friends of Figma, Hong Kong"
            text="2022 - Now"
            image={Figma}
          />
           <Entry
            title="Mentor"
            subtitle="ADPList"
            text="2022 - Now"
            image={Adplist}
          /></Grid>
        </Box>
        <Box py="4">
          <Heading textTransform="uppercase" fontSize="md" my="4">
          Awards & recognition
          </Heading>
          <Grid gap="4">
            <Entry
              title="Google Play Best Everyday Essential Nominee"
              text="2022"
            />
            <Entry
              title="OGCIO Web Accessibility Recognition Scheme Triple Gold Award"
              text="2018, 2016"
            />
            <Entry
              title="Best .HK LegCo Members Website Award (Gold)"
              text="2017"
            />
            <Entry
              title="Hong Kong Cyberport Creative Micro Fund"
              text="2016"
            />
          </Grid>
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
