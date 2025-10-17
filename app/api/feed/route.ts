import { base } from "lib/airtable";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const records = await base("Feed").select({
      fields: [
        "EntryName",
        "Description",
        "Link",
        "LastUpdateTime",
        "EntryDate",
        "CTA",
        "Metadata",
      ],
      filterByFormula: "{Status} = 'Published'",
      sort: [{ field: "EntryDate", direction: "desc" }]
    }).firstPage();

    return NextResponse.json(records);
    
  } catch (error) {
    console.error("Feed API Error:", error);
    return NextResponse.json(
      { error: "Something went wrong! 😕" },
      { status: 500 }
    );
  }
}