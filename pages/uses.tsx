import { NextPage } from "next";
import Layout from "@/components/Layout";
import Skeleton from "react-loading-skeleton";
import useSWR from "swr";
import {
  Text,
  Box,
  Grid,
  Button,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";
import fetcher from "@/lib/fetcher";
import CardResources from "@/components/CardResourcesMain";
import NextLink from "@/components/NextLink";
import NextImage from "@/components/NextImage";
import "react-loading-skeleton/dist/skeleton.css";

type Props = [
  fields: {
    Name: string;
    Description: string;
    Images: any;
  }
];

const UsesPage: NextPage = () => {
  const { data: gadgetsData } = useSWR<Props>("/api/uses-gadgets", fetcher);
  const { data: appsData } = useSWR<Props>("/api/uses-apps", fetcher);

  return (
    <Layout title="Uses">
      <Heading variant="pagetitle">Uses</Heading>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/resources">Resources</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="/uses">
            Uses
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Heading fontSize="3xl" my="10">Apps</Heading>
      <Text>Tools that I love to use everyday</Text>
      {!appsData ? (
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
          <Skeleton height="74px" />
          <Skeleton height="74px" />
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
          {appsData.map((item: any, i: number) => (
            <NextLink
              key={i}
              href={item.fields.Link}
              target="_blank"
              variant="noeffect"
            >
              <Grid
                border="1px solid"
                borderColor="border"
                gridTemplateColumns="minmax(36px, 64px) 1fr"
                borderRadius="2xl"
                alignItems="center"
                _hover={{ boxShadow: "md" }}
                transition="all ease-in-out 200ms"
              >
                {item.fields.Image && (
                  <Box
                    borderRadius="36px"
                    display="grid"
                    placeContent="center"
                    p="4"
                    height="72px"
                    width="72px"
                    position="relative"
                  >
                    <NextImage
                      src={item.fields.Image[0].thumbnails.large.url}
                      alt={item.fields.Name}
                    />
                  </Box>
                )}
                <Box>
                  <Heading fontSize="xl" my="0" lineHeight="short">
                    {item.fields.Name}
                  </Heading>
                  {/* {item.fields.ExtraLink && (
                        <Button>
                          <NextLink href={item.fields.ExtraLink}>
                            {item.fields["CTA"]}
                          </NextLink>
                        </Button>
                      )} */}
                </Box>
              </Grid>
            </NextLink>
          ))}
        </Grid>
      )}
      <Heading fontSize="3xl" my="10">
        Hardware
      </Heading>
      {!gadgetsData ? (
        <Text>Loading...</Text>
      ) : (
        <Grid gap="4">
          {gadgetsData.map((item: any, i: number) => (
            <Box
              key={i}
              p="4"
              border="1px solid"
              borderColor="border"
              gridTemplateColumns="max-content auto"
              gridGap="8"
              borderRadius="md"
            >
              <Box>
                <Heading fontSize="xl" my="0" lineHeight="short">
                  {item.fields["Name"]}
                </Heading>
                <Box
                  color="primarytext"
                  dangerouslySetInnerHTML={{
                    __html: `${item.fields["Description"]}`,
                  }}
                />
                {item.fields["ExtraLink"] && (
                  <Button>
                    <NextLink href={item.fields["ExtraLink"]}>
                      {item.fields["CTA"]}
                    </NextLink>
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </Grid>
      )}
      {/* Apps */}
    </Layout>
  );
};

export default UsesPage;
