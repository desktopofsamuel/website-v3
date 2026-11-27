import { notFound } from "next/navigation";
import PrintDemo from "@/components/work-cd/PrintDemo";
import {
  PRINT_DEMO_IDS,
  isPrintDemoId,
  printDemoById,
} from "@/lib/work-cd/print-demo";

type Props = { params: Promise<{ mode: string }> };

export function generateStaticParams() {
  return PRINT_DEMO_IDS.map((mode) => ({ mode }));
}

export async function generateMetadata({ params }: Props) {
  const { mode } = await params;
  if (!isPrintDemoId(mode)) return { title: "Print demo", robots: { index: false, follow: false } };
  const demo = printDemoById(mode);
  return {
    title: `Print demo ${demo.letter}`,
    robots: { index: false, follow: false },
  };
}

export default async function PrintDemoModePage({ params }: Props) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { mode } = await params;
  if (!isPrintDemoId(mode)) notFound();

  return <PrintDemo mode={mode} />;
}
