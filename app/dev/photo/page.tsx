import { notFound } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import PhotoShell from "@/components/dev/PhotoShell";

export default function PhotoDevPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <AppLayout>
      <PhotoShell />
    </AppLayout>
  );
}
