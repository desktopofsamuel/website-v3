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
  Text,
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
          <Link href="/" >
            <Text fontFamily="heading" cursor="pointer" variant="noeffect">Desktop of Samuel</Text>
          </Link>
          <Spacer />
          <List
            as="nav"
            display={{ base: "none", md: "flex" }}
            listStyleType="none"
            flexDir="row"
            alignItems="center"
            gap="4"
            fontFamily="heading"
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
            <IconButton
                    aria-label="Switch Color Mode"
                    icon={colorMode === `light` ? <SunIcon /> : <MoonIcon />}
                    onClick={toggleColorMode}
                  />
          </List>
          <IconButton
            aria-label="Open Menu"
            icon={<HamburgerIcon />}
            display={{ base: "block", md: "none" }}
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
              <Box width="fit-content" fontFamily="heading">
                <Flex  flexDirection="column" textAlign="center" >
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
