import { base } from "lib/airtable";

const handler = async (_req, res) => {
  try {
    const records = await base("Tech")
      .select({
        fields: [
          "Name",
          // "Description",
          // "Category",
          // "CreateTime",
          "ExtraLink",
          "Link",
          "LastUpdateTime",
          "CTA",
          "Image",
        ],
        filterByFormula:
          "AND({Status} = 'Published', NOT({Category} = 'Hardware'))",
        sort: [{ field: "LastUpdateTime", direction: "desc" }],
      })
      .firstPage();

    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong! 😕" });
  }
};

export default handler;
