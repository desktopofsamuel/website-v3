import React from "react";
import { Metadata } from "next";
import AppLayout from "@/components/AppLayout";
import CameraGallery from "./CameraGallery";

export const metadata: Metadata = {
  title: "Camera Collection",
  description: "My collection of cameras and the photos taken with them.",
};

export default function CameraPage() {
  return (
    <AppLayout>
      <div className="py-12 md:py-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Camera Collection</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            A curated view of the cameras I&apos;ve used over the years, and the moments captured through their lenses.
          </p>
        </div>
        
        <CameraGallery />
      </div>
    </AppLayout>
  );
}
