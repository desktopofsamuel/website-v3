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
  IconButton,
  VStack,
  HStack,
} from "@chakra-ui/react";
import Profile2022 from "../public/static/samuel-profile-2022.jpeg";
import Profile from "../public/static/profile-2014.jpeg";
import Layout from "@/components/Layout";
import NextLink from "@/components/NextLink";
import Image, { StaticImageData } from "next/image";
import NextImage from "@/components/NextImage";
import HSBC from "../public/about/hsbc.svg";
import HyperAir from "../public/about/hyperair.svg";
import Playa from "../public/about/playa.svg";
import Apple from "../public/about/apple.svg";
import OKX from "../public/about/okx.svg";
import Figma from "../public/about/figma.svg";
import Adplist from "../public/about/adplist.svg";
import Okxlogo from "../public/about/okx-logo.svg";
import Playalogo from "../public/about/playa-logo.svg";
import Applelogo from "../public/about/apple-logo.svg";
import Hyperairlogo from "../public/about/hyperair-logo.svg";
import Hsbclogo from "../public/about/hsbc-logo.svg";
import Ama from "../public/about/Design System AMA2.jpg";
import FirmVisit from "../public/about/Firm Visit.jpeg";
import { FaTwitter, FaEnvelope, FaMedium, FaLinkedin, FaGithub } from "react-icons/fa";

type CompanyCardProps = {
  title: string;
  subtitle?: string;
  text?: string;
  image: string | StaticImageData;
  small?: string;
  color?: string;
  cta?: string;
  href?: string;
  noAnimation?: boolean;
};

type EntryProps = {
  title: string;
  subtitle?: string;
  text?: string;
  image?: string;
  cta?: string;
  href?: string;
};

const CompanyCard: React.FC<CompanyCardProps> = ({
  title,
  subtitle,
  small,
  text,
  image,
  cta,
  color,
  href = "",
  noAnimation = false,
}) => {
  return (
    <SimpleGrid
      columns={{ base: 1, sm: 2 }}
      gap={{ base: 4, md: 8 }}
      alignItems="center"
      justifyContent="center"
      role="group"
    >
      <Box height="100%">
        <Center
          backgroundColor="border"
          width="100%"
          height="100%"
          minHeight={{ base: "200px", md: "250px" }}
          borderRadius="2xl"
          transition="all 600ms ease-in-out"
          _groupHover={{
            backgroundColor: `${color}`,
          }}
        >
          <Box
            _groupHover={{
              transform: noAnimation ? "scale(1)" : "scale(1.05)",
            }}
            transition="all 250ms ease-in"
            transitionDelay="200"
          >
            <Image src={image} alt={`${title}`} />
          </Box>
        </Center>
      </Box>
      <Box>
        <Heading fontSize={{ base: "lg", md: "2xl" }} lineHeight="short">
          {title}
        </Heading>
        <HStack>
          <Text my="0" color="secondarytext" variant="small">
            {subtitle}
          </Text>
          <Text color="yellow.300" my="0" variant="small">
            {" "}
            |{" "}
          </Text>
          <Text my="0" color="secondarytext" variant="small">
            {small}
          </Text>
        </HStack>
        <Text my={{ base: 2, md: 4 }}>{text}</Text>
        {/* <Text variant="small" my="0">
          {small}
        </Text> */}
        {cta &&
          (href === "" ? (
            <Button variant="disabled" width="min-content" aria-disabled>
              {cta}
            </Button>
          ) : (
            <NextLink href={href} variant="noeffect">
              <Button
                variant={href ? "outline" : "disabled"}
                width="min-content"
              >
                {cta}
              </Button>
            </NextLink>
          ))}
      </Box>
    </SimpleGrid>
  );
};

const Entry: React.FC<EntryProps> = ({
  title,
  text,
  image,
  subtitle,
  cta,
  href,
}) => {
  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      gap={{ base: "4", md: "8" }}
      alignItems="center"
      border="1px solid"
      borderColor="border"
      borderRadius="lg"
      paddingX={{ base: 2, md: 4 }}
      paddingY={{ base: 2, md: 6 }}
    >
      {image && (
        <Box
          _hover={{ opacity: 0.5 }}
          transition="all 500ms ease-in-out"
          opacity={1}
          maxWidth="72px"
        >
          <Image src={image} alt={`Logo of ${subtitle}`} />
        </Box>
      )}
      <Flex width="100%" alignItems="center">
        <Box>
          <Heading fontSize={{ base: "xl", md: "2xl" }}>{title}</Heading>
          <Text fontFamily="heading" fontSize="md" lineHeight="short" my="0">
            {subtitle}
          </Text>
          <Text variant="small" my="0" color="secondarytext">
            {text}
          </Text>
        </Box>
        <Spacer />
        <Box>
          {cta && (
            <NextLink href={href} variant="noeffect">
              <Button
                variant="outline"
                width="min-content"
                size={{ base: "sm", md: "md" }}
              >
                {cta}
              </Button>
            </NextLink>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

const AboutPage: NextPage = () => {
  const startYear = 2015;
  const currentYear = new Date().getFullYear();
  const experienceYears = currentYear - startYear;
  return (
    <Layout>
      <Grid
        gridTemplateColumns={{ base: "auto", md: "auto auto" }}
        gap={{ base: "4", md: "16" }}
        alignItems="center"
        py={{ base: "4", md: "16" }}
        marginTop={{ base: "4", md: "16" }}
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
          <Heading lineHeight="short">Hello, my name is Samuel.</Heading>
          <Text>
            I got into product design because I&apos;m deeply passionate about
            technology and how it profoundly changes our way of living. For the
            past {experienceYears} years, I have been solving users and business
            problems and delivering delightful interfaces & experiences across
            domains like web3, finance, and travel industries.
          </Text>
          <HStack>
            <HStack gap="1">
            <NextLink
              variant="noeffect"
              href="https://www.linkedin.com/in/desktopofsamuel/"
            >
              <IconButton variant="icon" fontSize='20px' isRound={true} aria-label="Linkedin" icon={<FaLinkedin />} />
            </NextLink>
            <NextLink
              variant="noeffect"
              href="mailto:desktopofsamuel@gmail.com"
            >
            <IconButton variant="icon" fontSize='20px' isRound={true} aria-label="Email" icon={<FaEnvelope />} /></NextLink>
            <NextLink
              variant="noeffect"
              href="https://www.github.com/desktopofsamuel"
            >
            <IconButton variant="icon" fontSize='20px' isRound={true} aria-label="Github" icon={<FaGithub />} /></NextLink>
           
          </HStack>
            {/* <Button size="lg">
              <NextLink href="#contact" variant="noeffect">
                Let&apos;s Chat
              </NextLink>
            </Button>
            <Button size="lg" variant="outline" color="blue.500">
              <NextLink href="#resume" variant="noeffect">
                My resume
              </NextLink>
            </Button> */}
          </HStack>
        </Box>
      </Grid>
      <Box py="16">
        <Heading fontSize="3xl" my="10">
          My Journey
        </Heading>
        <SimpleGrid columns={[1, 1, 3]} gap="8">
          <Box>
            <Heading fontSize="2xl">Interned at Apple</Heading>
            <Text>
              Majoring in Arts in college, I took a gap year working for
              Apple&apos;s iTunes & App Store team. This valuable experience
              cultivated my interest and knowledge in digital products.
            </Text>
          </Box>
          <Box>
            <Heading fontSize="2xl">Co-founding an agency</Heading>
            <Text>
              With growing freelance web & design projects, I co-founded a
              digital agency after graduation. Me and my team helped small
              businesses, entrepreneurs, and non-profits launching their
              projects.
            </Text>
          </Box>
          <Box>
            <Heading fontSize="2xl">Lead product design</Heading>
            <Text>
              After that, I transitioned to start-up & corporations as a prdouct
              designer to lead design projects in travel, banking and crypto industries.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
      <Box py={{ base: 4, md: 16 }}>
        <Image
          src={Profile}
          alt="Portrait of Samuel Wong"
          placeholder="blur"
          width="1920"
          height="1280"
          style={{ borderRadius: "1em" }}
        />
      </Box>
      <Box id="resume" py="16">
        <Heading fontSize="4xl">Experiences</Heading>
        <Box py="4">
          <Heading variant="small">Career</Heading>
          <Grid gap="8">
            <CompanyCard
              image={Okxlogo}
              title="Senior Product Designer"
              subtitle="OKX"
              text="Currently leading a design team to build seamless, accessible crypto investment products within a constantly evolving crypto landscape. Promoted from Product Designer (II) in 2023."
              small="2022 - 2024"
              cta="Coming soon"
              color="#000000"
            />
            <CompanyCard
              title="UX/UI Consultant"
              subtitle="HSBC via Protiviti"
              text="Consultant placed in HSBC Wealth team, designed end-to-end browser & app journeys to enhance stock trading and analysis experience for Asia market."
              small="2021 - 2022"
              image={Hsbclogo}
              color="#DB0011"
              cta="View Work"
              href="/work/hsbc"
            />
            <CompanyCard
              title="Principal Designer"
              subtitle="HyperAir"
              small="2019 - 2021"
              text="First design hire and design team of one, scaled product offering from prototype to multiple pillars with B2C & B2B platforms. Shipped data-driven design & feature enhancement for scale."
              image={Hyperairlogo}
              cta="View Work"
              href="/work/hyperair-fx"
              color="#0176ee"
            />
            <CompanyCard
              image={Playalogo}
              title="Co-founder & Design Lead"
              subtitle="Playa"
              text="Co-founder of a bootstrapped digital agency, shipped award-winning web and app projects from concept to delivery for SMB and start-up clients."
              small="2015 - 2019"
              color="#49CC74"
              cta="View Work"
              href="https://playa.hk/portfolio.html"
            />

            <CompanyCard
              title="Cross Content Intern"
              subtitle="Apple"
              small="2012 - 2013"
              text="Deferred from university for 1-year full-time internship at iTunes & App Store team to curate APAC editorial content for apps, films, music and books."
              image={Applelogo}
              color="#86868B"
            />
          </Grid>
          {/* <Grid gap="4">
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
              cta="View Work"
              href="/work/hsbc"
            />
            <Entry
              title="Principal Designer"
              subtitle="HyperAir"
              text="2019 - 2021"
              image={HyperAir}
              cta="View Work"
              href="/work/hyperair-fx"
            />
            <Entry
              title="Co-founder & Design Lead"
              subtitle="Playa"
              text="2015 - 2019"
              image={Playa}
              cta="View Work"
              href="/work/building-hong-kongs-first-water-dispenser-map"
            />
            <Entry
              title="Cross Content Intern"
              subtitle="Apple"
              text="2012 - 2013"
              image={Apple}
            />
          </Grid> */}
        </Box>
        <Box py="4">
          <Heading variant="small">Education</Heading>
          <Grid gap="4">
            <Entry
              title="The University of Hong Kong"
              subtitle="Bachelor of Arts"
            />
            <Entry
              title="IDEO U"
              subtitle="Human Centered Strategy"
              text="2023"
            />
            <Entry
              title="Glide"
              subtitle="Glide Certifcation Level 1 - 3"
              text="2024"
            />
          </Grid>
        </Box>
        <Box py="4">
          <Heading variant="small">Engagement</Heading>
          <Grid gap="4">
            <CompanyCard
              image={FirmVisit}
              subtitle="OKX Product Design Team Representative"
              title="Campus Recruitment: HKUST Firm Visit"
              small="2023"
              noAnimation
            />
            <CompanyCard
              image={Ama}
              subtitle="Host of Friends of Figma HK"
              title="Let's talk about Design System"
              small="2022 Sep"
              noAnimation
            />
          </Grid>
        </Box>
        <Box py="4">
          <Heading variant="small">Community</Heading>
          <Grid gap="4">
            <Entry
              title="Community Moderator"
              subtitle="Friends of Figma, Hong Kong"
              text="2022 - Now"
              image={Figma}
              cta="Join upcoming events"
              href="https://friends.figma.com/hong-kong"
            />
            <Entry
              title="Mentor"
              subtitle="ADPList"
              text="2023 - Now"
              image={Adplist}
              cta="Schedule a session"
              href="https://adplist.org/mentors/samuel-wong"
            />
          </Grid>
        </Box>
        <Box py="4">
          <Heading variant="small">Awards & recognitions</Heading>
          <Grid gap="4" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}>
            <Entry
              title="Google Play"
              subtitle="Best of 2022 - Everyday Essential Nominee"
              text="2022"
            />
            <Entry
              title="OGCIO"
              subtitle="Web Accessibility Recognition Scheme Triple Gold Award"
              text="2018, 2016"
            />
            <Entry
              subtitle="Best .HK LegCo Members Website Award (Gold)"
              title="HKIRC"
              text="2017"
            />
            <Entry
              subtitle="Hong Kong Cyberport Creative Micro Fund"
              title="Cyberport"
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

        <NextLink variant="noeffect" href="mailto:desktopofsamuel@gmail.com">
          <Button size="lg">Get in Touch</Button>
        </NextLink>
      </Box>
    </Layout>
  );
};

export default AboutPage;
