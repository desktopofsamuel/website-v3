import { base } from "lib/airtable";

export default async (_req, res) => {
  try {
    const records = await base("Tech").select({
      fields: [
        "Name",
        "Description",
        "Category",
        "CreateTime",
        "ExtraLink",
        "LastUpdateTime",
        "CTA"
      ],
      filterByFormula: "AND({Status} = 'Published', {Category} = 'Hardware')",
      sort: [ {field: "LastUpdateTime", direction: "desc"} ]
    }).firstPage();

    res.status(200).json(records);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong! 😕" });
  }
};