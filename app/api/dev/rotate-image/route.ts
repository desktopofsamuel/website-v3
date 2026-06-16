import { NextRequest, NextResponse } from "next/server";
import {
  rotateStaticImage,
  resolveStaticImagePath,
} from "@/lib/rotate-static-image";
import { normalizeFileRotation } from "@/lib/photo-rotation";

function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

type RotateBody = {
  path: string;
  degrees: number;
};

export async function POST(request: NextRequest) {
  if (!isDev()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: RotateBody;
  try {
    body = (await request.json()) as RotateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const degrees = normalizeFileRotation(body.degrees);
  if (degrees === undefined) {
    return NextResponse.json(
      { error: "degrees must be 90, -90, 180, or 270" },
      { status: 400 },
    );
  }

  if (!body.path || !resolveStaticImagePath(body.path)) {
    return NextResponse.json({ error: "Invalid image path" }, { status: 400 });
  }

  try {
    await rotateStaticImage(body.path, degrees);
    return NextResponse.json({ ok: true, path: body.path, degrees });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to rotate image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
