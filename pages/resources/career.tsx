import { NextPage } from "next";
import Layout from "@/components/Layout";
import Skeleton from "react-loading-skeleton";
import useSWR from "swr";
import { Text, Box, Grid, Button, Heading } from "@chakra-ui/react";
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
    <Layout title="Uses">
     
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
      <Heading fontSize="2xl">Search</Heading>
      {!careerData ? (
        <Grid
          gap="4"
          gridTemplateColumns={{
            base: "1fr",
            md: "1fr 1fr",
            lg: "1fr 1fr 1fr",
          }}
        >
          <Skeleton height="74px" />
          <Skeleton height="74px" />
        </Grid>
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
              <NextLink
                key={i}
                href={item.fields.Link}
                target="_blank"
                variant="noeffect"
              >
                 <Box
              p="4"
              border="1px solid"
              borderColor="border"
              gridTemplateColumns="max-content auto"
              gridGap="8"
              borderRadius="md"
            >
                  <Heading fontSize="xl" my="0" lineHeight="short">
                    {item.fields.Name}
                  </Heading>
                  <Text>{item.fields.Text}</Text>
                  {/* {item.fields.ExtraLink && (
                        <Button>
                          <NextLink href={item.fields.ExtraLink}>
                            {item.fields["CTA"]}
                          </NextLink>
                        </Button>
                      )} */}
                </Box>
              </NextLink>
            ))}
        </Grid>
      )}

      <Heading fontSize="2xl">Prepare</Heading>
      {!careerData ? (
        <Grid
          gap="4"
          gridTemplateColumns={{
            base: "1fr",
            md: "1fr 1fr",
            lg: "1fr 1fr 1fr",
          }}
        >
          <Skeleton height="74px" />
          <Skeleton height="74px" />
        </Grid>
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
              <NextLink
                key={i}
                href={item.fields.Link}
                target="_blank"
                variant="noeffect"
              >
                 <Box
              p="4"
              border="1px solid"
              borderColor="border"
              gridTemplateColumns="max-content auto"
              gridGap="8"
              borderRadius="md"
            >
                  <Heading fontSize="xl" my="0" lineHeight="short">
                    {item.fields.Name}
                  </Heading>
                  <Text>{item.fields.Text}</Text>
                  {/* {item.fields.ExtraLink && (
                        <Button>
                          <NextLink href={item.fields.ExtraLink}>
                            {item.fields["CTA"]}
                          </NextLink>
                        </Button>
                      )} */}
                </Box>
              </NextLink>
            ))}
        </Grid>
      )}

      {/* Apps */}
    </Layout>
  );
};

export default UsesPage;
