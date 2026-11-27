import WorkCdIndex from "@/components/work-cd/WorkCdIndex";

export const metadata = {
  title: "Work CD index",
  robots: { index: false, follow: false },
};

export default function WorkCdDevPage() {
  return <WorkCdIndex />;
}
