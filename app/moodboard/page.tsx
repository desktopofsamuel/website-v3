import { MoodboardCanvas } from "@/components/Moodboard/MoodboardCanvas";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infinite Moodboard",
  description: "A draggable, infinite canvas moodboard with physics-based interactions.",
};

export default function MoodboardPage() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <MoodboardCanvas />
    </main>
  );
}
