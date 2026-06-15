import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  generateFullMdx,
  type PhotoFrontmatter,
  type PhotoGridItem,
} from "@/lib/photo-mdx-generator";
import {
  isValidPhotoFilename,
  parsePhotoMdx,
} from "@/lib/photo-mdx-parser";
import { naturalSort } from "@/lib/natural-sort";

const PHOTO_DIR = path.join(process.cwd(), "content", "photo");

function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

function resolvePhotoPath(filename: string): string | null {
  if (!isValidPhotoFilename(filename)) return null;
  const resolved = path.resolve(PHOTO_DIR, filename);
  if (!resolved.startsWith(PHOTO_DIR + path.sep)) return null;
  return resolved;
}

export async function GET(request: NextRequest) {
  if (!isDev()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const file = request.nextUrl.searchParams.get("file");

  if (file) {
    const filePath = resolvePhotoPath(file);
    if (!filePath) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const content = fs.readFileSync(filePath, "utf8");
    const parsed = parsePhotoMdx(content);

    return NextResponse.json({
      filename: file,
      ...parsed,
    });
  }

  let filenames: string[] = [];
  try {
    filenames = fs
      .readdirSync(PHOTO_DIR)
      .filter((name) => name.endsWith(".mdx"))
      .sort(naturalSort);
  } catch {
    filenames = [];
  }

  const files = filenames.map((filename) => {
    const filePath = path.join(PHOTO_DIR, filename);
    const content = fs.readFileSync(filePath, "utf8");
    const parsed = parsePhotoMdx(content);

    return {
      filename,
      title: parsed.frontmatter.title,
      path: parsed.frontmatter.path,
      imageCount: parsed.gridItems.length,
    };
  });

  return NextResponse.json({ files });
}

type WriteBody = {
  filename: string;
  frontmatter: PhotoFrontmatter;
  intro: string;
  gridItems: PhotoGridItem[];
};

export async function POST(request: NextRequest) {
  if (!isDev()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: WriteBody;
  try {
    body = (await request.json()) as WriteBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { filename, frontmatter, intro, gridItems } = body;

  if (!filename || !frontmatter?.title || !frontmatter?.date) {
    return NextResponse.json(
      { error: "filename, title, and date are required" },
      { status: 400 },
    );
  }

  const filePath = resolvePhotoPath(filename);
  if (!filePath) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const content = generateFullMdx(frontmatter, intro ?? "", gridItems ?? []);
  fs.writeFileSync(filePath, content, "utf8");

  return NextResponse.json({
    ok: true,
    filename,
    content,
  });
}
