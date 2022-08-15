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
} from "@chakra-ui/react";
import { FaTwitter, FaInstagram, FaMedium, FaLinkedin } from "react-icons/fa";
import React from "react";
import NextLink from "./NextLink";

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
          <HStack gap="1">
            <NextLink
              variant="noeffect"
              href="https://www.linkedin.com/in/wongchunlong/"
            >
              <IconButton aria-label="Linkedin" icon={<FaLinkedin />} />
            </NextLink>
            <NextLink
              variant="noeffect"
              href="https://www.twitter.com/desktopofsamuel"
            >
              <IconButton aria-label="Twitter" icon={<FaTwitter />} />{" "}
            </NextLink>
            <IconButton aria-label="Instagram" icon={<FaInstagram />} />
            <IconButton aria-label="Medium" icon={<FaMedium />} />
          </HStack>
        </GridItem>
        <GridItem>
          <Heading variant="small">Subscribe</Heading>
          <Text variant="caption">
            I write regularly on the subject of design and technology. Feel free
            to subscribe via RSS or follow me on Medium.
          </Text>
        </GridItem>
      </Grid>
    </Container>
  );
}
