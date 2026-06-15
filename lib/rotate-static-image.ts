import fs from "fs";
import path from "path";
import sharp from "sharp";
import type { FileRotationDegrees } from "./photo-rotation";

const STATIC_DIR = path.join(process.cwd(), "public", "static");

export function resolveStaticImagePath(staticPath: string): string | null {
  if (!staticPath.startsWith("/static/")) return null;

  const filename = path.basename(staticPath);
  if (!/^[\w.-]+\.(jpe?g|png|webp|gif)$/i.test(filename)) return null;

  const resolved = path.resolve(STATIC_DIR, filename);
  if (!resolved.startsWith(STATIC_DIR + path.sep)) return null;

  return resolved;
}

export async function rotateStaticImage(
  staticPath: string,
  degrees: FileRotationDegrees,
): Promise<void> {
  if (!degrees) {
    throw new Error("Rotation degrees must be 90, -90, 180, or 270");
  }

  const filePath = resolveStaticImagePath(staticPath);
  if (!filePath) {
    throw new Error("Invalid static image path");
  }

  if (!fs.existsSync(filePath)) {
    throw new Error("Image file not found");
  }

  const input = fs.readFileSync(filePath);
  const output = await sharp(input)
    .rotate() // normalize EXIF orientation into pixels first
    .rotate(degrees)
    .withMetadata({ orientation: 1 })
    .toBuffer();
  fs.writeFileSync(filePath, output);
}
