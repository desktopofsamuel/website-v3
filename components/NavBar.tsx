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
import Link from "@/components/NextLink";

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Container as="header" maxW="1080px">
        <Flex as="nav" alignItems="center" my="8">
          <Link href="/" className="font-heading text-md">Desktop of Samuel </Link>
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
          <ModalBody display="flex" justifyContent="center">
            <Center>
             
                <Flex fontFamily="heading" fontSize="3xl"  fontWeight="600" 
        letterSpacing="tight" flexDirection="column" textAlign="center" alignItems="center">
                  <Link href="/">Home</Link>
                  <Link href="/about">About</Link>
                  <Link href="/blog">Blog</Link>
                  <Link href="/work">Work</Link>
                  <Box h="24px"/>
                  <IconButton
                  width="48px"
                  height="48px"
                  borderRadius="50%"
                    aria-label="Switch Color Mode"
                    icon={colorMode === `light` ? <SunIcon /> : <MoonIcon />}
                    onClick={toggleColorMode}
                  />
                </Flex>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
