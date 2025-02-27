import {
  Container,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  HStack,
  Stack,
  Text,
  Button,
} from "@chakra-ui/react";
import {
  FaTwitter,
  FaInstagram,
  FaMedium,
  FaLinkedin,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";
import React from "react";
import NextLink from "./NextLink";

const SocialIconButton = ({ 
  icon, 
  label, 
  ...props 
}: { 
  icon: React.ReactElement; 
  label: string;
}) => (
  <IconButton
    aria-label={label}
    icon={icon}
    {...props}
  />
);

export default function Footer() {
  return (
    <Container as="footer" maxW="1080px" my="8">
      <Grid
        gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr 1fr" }}
        gap={{ base: "2", md: "8" }}
       
      >
        <GridItem>
          <Heading variant="small">Let&apos;s Chat</Heading>
          <Text variant="caption">
            I am excited for new opportunities, let&apos;s talk about working
            together.
          </Text>
        </GridItem>
        <GridItem> 
          <Heading variant="small">Keep In Touch</Heading>
          <Text variant="caption">
            Follow my social media and see what I&apos;m up to.
          </Text>
          <HStack gap="1"  ml="-2">
            <NextLink
              variant="noeffect"
              href="https://www.linkedin.com/in/desktopofsamuel/"
              target="_blank"
            >
              <SocialIconButton
                icon={<FaLinkedin size="24px" />}
                label="Linkedin"
              />
            </NextLink>
            <NextLink
              variant="noeffect"
              href="https://www.x.com/desktopofsamuel"
              target="_blank"
            >
              <SocialIconButton
                icon={<FaXTwitter size="24px" />}
                label="X"
              />
            </NextLink>
            <NextLink
              variant="noeffect"
              href="https://www.instagram.com/desktopofsamuel"
              target="_blank"
            >
              <SocialIconButton
                icon={<FaInstagram size="24px" />}
                label="Instagram"
              />
            </NextLink>
            <NextLink
              variant="noeffect"
              href="https://medium.com/desktop-of-samuel"
              target="_blank"
            >
              <SocialIconButton
                icon={<FaMedium size="24px" />}
                label="Medium"
              />
            </NextLink>
            <NextLink
              variant="noeffect"
              href="https://www.github.com/desktopofsamuel"
              target="_blank"
            >
              <SocialIconButton
                label="Github"
                icon={<FaGithub size="24px"/>}
              />
            </NextLink>
          </HStack>
        </GridItem>
        <GridItem>
          <Heading variant="small">Subscribe</Heading>
          <Text variant="caption">
            I write regularly on the subject of design and technology. Feel free
            to subscribe my latest writings.
            
          </Text><Button variant="solid" size="sm">
            <NextLink href="https://desktopofsamuel.medium.com/subscribe" target="_blank" className="text-white">
              Subscribe
            </NextLink></Button>
        </GridItem>
      </Grid>
    </Container>
  );
}
