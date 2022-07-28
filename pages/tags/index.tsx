import Layout from "@/components/Layout";
import { allTags } from "@/lib/content";
import { Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function TagListPage() {
  return (
    <Layout>
      <Heading variant="pagetitle">Tags</Heading>
      {allTags.map((tag, i) => (
        <Link href={tag.path} key={i}>
          <Text>{tag.name}</Text>
        </Link>
      ))}
    </Layout>
  );
}
