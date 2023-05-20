import { NextPage } from "next";
import Layout from "@/components/Layout";
import Skeleton from "react-loading-skeleton";
import useSWR from "swr";
import { SimpleGrid, Text, Box, Grid, Button, Heading } from "@chakra-ui/react";
import fetcher from "@/lib/fetcher";
import CardResources from "@/components/CardResources";
import NextLink from "@/components/NextLink";
import NextImage from "@/components/NextImage";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";

type Props = [
  fields: {
    fields: any;
    Name: string;
    Description: string;
    Category: any;
    Stage: string;
    Images: any;
  }
];

const UsesPage: NextPage = () => {
  const { data: careerData } = useSWR<Props>("/api/resources-career", fetcher);

  return (
    <Layout
      title="UX Design Career Kit"
      description="A list of helpful resources to kickstart your UX design career"
    >
      <Heading variant="pagetitle">UX Design Career Kit</Heading>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/resources">Resources</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="/resources/career">
            UX Career Kit
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Text>
        A list of helpful resources to kickstart your UX design career
      </Text>
      <Heading fontSize="2xl" mt="8">Search</Heading>
      {!careerData ? (
        <SimpleGrid gap="4" columns={3}>
          <Skeleton height="100px" />
          <Skeleton height="100px" /> <Skeleton height="100px" />
        </SimpleGrid>
      ) : (
        <Grid
          gap="4"
          gridTemplateColumns={{
            base: "1fr",
            md: "1fr 1fr",
            lg: "1fr 1fr 1fr",
          }}
        >
          {careerData
            .filter((item) => item.fields.Stage === "Search")
            .map((item: any, i: number) => (
              <CardResources
                title={item.fields.Name}
                description={item.fields.Text}
                url={item.fields.Link}
                key={i}
              />
            ))}
        </Grid>
      )}

      <Heading fontSize="2xl" mt="8">Prepare</Heading>
      {!careerData ? (
        <SimpleGrid gap="4" columns={3}>
          <Skeleton height="100px" />
          <Skeleton height="100px" /> <Skeleton height="100px" />
        </SimpleGrid>
      ) : (
        <Grid
          gap="4"
          gridTemplateColumns={{
            base: "1fr",
            md: "1fr 1fr",
            lg: "1fr 1fr 1fr",
          }}
        >
          {careerData
            .filter((item) => item.fields.Stage === "Prepare")
            .map((item: any, i: number) => (
              <CardResources
                title={item.fields.Name}
                description={item.fields.Text}
                url={item.fields.Link}
                key={i}
              />
            ))}
        </Grid>
      )}

      {/* Apps */}
    </Layout>
  );
};

export default UsesPage;
