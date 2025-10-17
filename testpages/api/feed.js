import { base } from "lib/airtable";

const handler = async (_req, res) => {
  try {
    const records = await base("Feed").select({
      fields: [
        "EntryName",
        "Description",
        // "Category",
        // "CreateTime",
        // "ExtraLink",
        "Link",
        "LastUpdateTime",
        "EntryDate",
        "CTA",
        "Metadata",
        // "Image"
      ],
      filterByFormula: "{Status} = 'Published'",
      sort: [ {field: "EntryDate", direction: "desc"} ]
    }).firstPage();


    res.status(200).json(records);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong! 😕" });
  }
};

export default handler;