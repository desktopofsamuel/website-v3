import { table } from "../../lib/airtable";

export default async (_req, res) => {
  try {
    const records = await table.select({
      fields: [
        "Name",
        "Description",
        "Category",
        "CreateTime",
        "ExtraLink",
        "CTA",
        "Image"
      ],
      filterByFormula: "AND({Status} = 'Published', NOT({Category} = 'Hardware'))",
      sort: [ {field: "CreateTime", direction: "desc"} ]
    }).firstPage();


    res.status(200).json(records);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong! 😕" });
  }
};