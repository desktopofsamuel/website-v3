import { base } from "lib/airtable";
import { NextResponse } from "next/server";

export async function GET() {
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
      sort: [{ field: "LastUpdateTime", direction: "desc" }]
    }).firstPage();

    return NextResponse.json(records, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Resources career API error:', error);
    return NextResponse.json({ error: "Something went wrong! 😕" }, { status: 500 });
  }
}