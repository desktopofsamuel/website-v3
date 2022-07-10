import React from "react";
import {
  Container,
  Flex,
  Box,
  IconButton,
  List,
  ListItem,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  Center,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorMode,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import Link from "next/link";

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Container as="header" maxW="1080px">
        <Flex as="nav" alignItems="center">
          <Link href="/">
            <p>Desktop of Samuel</p>
          </Link>
          <Spacer />
          <List
            as="nav"
            display={{ sm: "none", md: "flex" }}
            listStyleType="none"
            flexDir="row"
            gap="4"
          >
            <ListItem>
              <Link href="/">Home</Link>
            </ListItem>
            <ListItem>
              <Link href="/about">About</Link>
            </ListItem>
            <ListItem>
              <Link href="/blog">Blog</Link>
            </ListItem>
            <ListItem>
              <Link href="/work">Work</Link>
            </ListItem>
          </List>
          <IconButton
            aria-label="Open Menu"
            icon={<HamburgerIcon />}
            display={{ sm: "block", md: "none" }}
            onClick={onOpen}
          />
        </Flex>
      </Container>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Box width="fit-content">
                <Flex flexDir="column" textAlign="center">
                  <Link href="/">Home</Link>
                  <Link href="/about">About</Link>
                  <Link href="/blog">Blog</Link>
                  <Link href="/work">Work</Link>
                  <IconButton
                    aria-label="Switch Color Mode"
                    icon={colorMode === `light` ? <SunIcon /> : <MoonIcon />}
                    onClick={toggleColorMode}
                  />
                </Flex>
              </Box>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
