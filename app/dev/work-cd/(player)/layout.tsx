import { notFound } from "next/navigation";
import { getWorkCdItems } from "@/lib/work-cd/items";
import WorkCdStage from "@/components/work-cd/WorkCdStage";

export default function WorkCdPlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <WorkCdStage items={getWorkCdItems()}>{children}</WorkCdStage>;
}
