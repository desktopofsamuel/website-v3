import { notFound } from "next/navigation";
import JewelCase from "@/components/work-cd/JewelCase";

export const metadata = {
  title: "Work 3D preview",
  robots: { index: false, follow: false },
};

export default function Work3dPreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <JewelCase />;
}
