import { Client } from "@notionhq/client";

const client = new Client({
  auth: process.env.NOTION_KEY,
});

export const getUsesEntries = async () => {
  const myPosts = await client.databases.query({
    database_id: `${process.env.NOTION_DATABASE}`,
  });
  return myPosts;
};
