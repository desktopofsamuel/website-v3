import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { naturalSort } from "@/lib/natural-sort";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export async function GET(request: NextRequest) {
  if (!isDev()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const prefix = request.nextUrl.searchParams.get("prefix") ?? "";
  const staticDir = path.join(process.cwd(), "public", "static");

  let filenames: string[];
  try {
    filenames = fs.readdirSync(staticDir);
  } catch {
    return NextResponse.json({ images: [] });
  }

  const images = filenames
    .filter((filename) => {
      const ext = path.extname(filename).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(ext)) return false;
      if (prefix && !filename.startsWith(prefix)) return false;
      return true;
    })
    .sort(naturalSort)
    .map((filename) => ({
      filename,
      path: `/static/${filename}`,
    }));

  return NextResponse.json({ images });
}
