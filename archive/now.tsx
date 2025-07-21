import { NextPage } from "next";
import Layout from "@/components/Layout";
import {
  Grid,
  Text,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  Box,
} from "@chakra-ui/react";
import NextImage from "@/components/NextImage";
import NextLink from "@/components/NextLink";
import CardBase from "@/components/CardBase";

const NowPage: NextPage = () => {
  return (
    <Layout title="What I’m doing now">
      <Heading variant="pagetitle">What I’m doing now</Heading>
      </Layout>
  )}

export default NowPage;