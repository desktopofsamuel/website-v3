import React from "react";
import AppLink from "@/components/AppLink";
import { Button } from "@/components/ui/button";

export default function AppFooter() {
  return (
    <footer className="max-w-[1080px] mx-auto px-5 py-8 font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
        {/* Let's Chat Section */}
        <div>
          <h3 className="text-lg font-bold mb-3">
            Let&apos;s Chat
          </h3>
          <p className="text-sm text-gray-600 m-0 leading-relaxed">
            I am excited for new opportunities, let&apos;s talk about working together.
          </p>
        </div>

        {/* Keep In Touch Section */}
        <div>
          <h3 className="text-lg font-bold mb-3">
            Keep In Touch
          </h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Follow my social media and see what I&apos;m up to.
          </p>
          <div className="flex gap-2">
            <AppLink 
              href="https://www.linkedin.com/in/desktopofsamuel/"
              target="_blank"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-100 no-underline text-gray-600 transition-colors hover:bg-gray-200"
            >
              <span className="text-xl">💼</span>
            </AppLink>
            <AppLink 
              href="https://www.x.com/desktopofsamuel"
              target="_blank"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-100 no-underline text-gray-600 transition-colors hover:bg-gray-200"
            >
              <span className="text-xl">𝕏</span>
            </AppLink>
            <AppLink 
              href="https://www.instagram.com/desktopofsamuel"
              target="_blank"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-100 no-underline text-gray-600 transition-colors hover:bg-gray-200"
            >
              <span className="text-xl">📷</span>
            </AppLink>
            <AppLink 
              href="https://medium.com/desktop-of-samuel"
              target="_blank"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-100 no-underline text-gray-600 transition-colors hover:bg-gray-200"
            >
              <span className="text-xl">📝</span>
            </AppLink>
            <AppLink 
              href="https://www.github.com/desktopofsamuel"
              target="_blank"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-100 no-underline text-gray-600 transition-colors hover:bg-gray-200"
            >
              <span className="text-xl">💻</span>
            </AppLink>
          </div>
        </div>

        {/* Subscribe Section */}
        <div>
          <h3 className="text-lg font-bold mb-3">
            Subscribe
          </h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            I write regularly on the subject of design and technology. Feel free to subscribe my latest writings.
          </p>
          <Button asChild>
            <AppLink
              href="https://desktopofsamuel.medium.com/subscribe"
              target="_blank"
            >
              Subscribe
            </AppLink>
          </Button>
        </div>
      </div>
    </footer>
  );
}