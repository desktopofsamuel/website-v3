import { base } from "lib/airtable";

export default async (_req, res) => {
  try {
    const records = await base("Career").select({
      fields: [
        "Name",
        "Text",
        "Link",
        "Status",
        "Category",
        "Handle",
        "AuthorLink",
        "Stage",
        "Tag",
      ],
      filterByFormula: "AND({Status} = 'Published', NOT({Category} = 'Thread'))",
      sort: [ {field: "LastUpdateTime", direction: "desc"} ]
    }).firstPage();

    res.status(200).json(records);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong! 😕" });
  }
};