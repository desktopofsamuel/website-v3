import {
  Container,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

export default function Footer() {
  return (
    <Container as="footer" maxW="1080px" my="8">
      <Grid gridTemplateColumns="1fr 1fr 1fr" gap="8">
        <GridItem>
            <Heading variant="small">Let&apos;s Chat</Heading>
            <Text variant="caption">
              I am excited for new opportunities, let&apos;s talk about working
              together.
            </Text>
        </GridItem>
        <GridItem>
            <Heading variant="small">Keep In Touch</Heading>
            <Text variant="caption">Follow my social media and see what I&apos;m up to.</Text>
        </GridItem>
        <GridItem>
            <Heading variant="small">Subscribe</Heading>
            <Text variant="caption">
              I write regularly on the subject of design and technology. Feel
              free to subscribe via RSS or follow me on Medium.
            </Text>
        </GridItem>
      </Grid>
    </Container>
  );
}
