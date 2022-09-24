import { NextPage } from "next";
import { Heading } from "@chakra-ui/react";
import Layout from "@/components/Layout";
import CardResources from "@/components/CardResources"

const ResourcesPage: NextPage = () => {
  return (
    <Layout title="Resources">
      <Heading variant="pagetitle">Resources</Heading>
      <CardResources />
   </Layout>
  )
}

export default ResourcesPage