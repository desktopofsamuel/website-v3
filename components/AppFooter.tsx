import React from "react";
import AppLink from "@/components/AppLink";
import {
  TbBrandLinkedinFilled,
  TbBrandX,
  TbBrandInstagram,
  TbBrandMedium,
  TbBrandGithubFilled,
} from "react-icons/tb";
import { Button } from "@/components/ui/button";

export default function AppFooter() {
  return (
    <footer className="max-w-[1080px] mx-auto px-5 py-8">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Let's Chat Section */}
        <div>
          <h3 className="font-heading text-lg font-bold mb-3">
            Let&apos;s Chat
          </h3>
          <p className="text-sm text-secondarytext m-0 leading-relaxed">
            I am excited for new opportunities, let&apos;s talk about working
            together.
          </p>
        </div>

        {/* Keep In Touch Section */}
        <div>
          <h3 className="font-heading text-lg font-bold mb-3">Keep In Touch</h3>
          <p className="text-sm text-secondarytext mb-4 leading-relaxed">
            Follow my social media and see what I&apos;m up to.
          </p>
          <div className="flex gap-2">
            <AppLink
              href="https://www.linkedin.com/in/desktopofsamuel/"
              target="_blank"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md no-underline transition-colors bg-gray-100 text-gray-600 hover:bg-primary-500 hover:text-white dark:bg-primary-800 dark:text-primary-500 dark:hover:bg-primary-700 dark:hover:text-primary-400"
            >
              <TbBrandLinkedinFilled size={24} />
            </AppLink>
            <AppLink
              href="https://www.x.com/desktopofsamuel"
              target="_blank"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md no-underline transition-colors bg-gray-100 text-gray-600 hover:bg-primary-500 hover:text-white dark:bg-primary-800 dark:text-primary-500 dark:hover:bg-primary-700 dark:hover:text-primary-400"
            >
              <TbBrandX size={24} />
            </AppLink>
            <AppLink
              href="https://www.instagram.com/desktopofsamuel"
              target="_blank"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md no-underline transition-colors bg-gray-100 text-gray-600 hover:bg-primary-500 hover:text-white dark:bg-primary-800 dark:text-primary-500 dark:hover:bg-primary-700 dark:hover:text-primary-400"
            >
              <TbBrandInstagram size={24} />
            </AppLink>
            <AppLink
              href="https://medium.com/desktop-of-samuel"
              target="_blank"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md no-underline transition-colors bg-gray-100 text-gray-600 hover:bg-primary-500 hover:text-white dark:bg-primary-800 dark:text-primary-500 dark:hover:bg-primary-700 dark:hover:text-primary-400"
            >
              <TbBrandMedium size={24} />
            </AppLink>
            <AppLink
              href="https://www.github.com/desktopofsamuel"
              target="_blank"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md no-underline transition-colors bg-gray-100 text-gray-600 hover:bg-primary-500 hover:text-white dark:bg-primary-800 dark:text-primary-500 dark:hover:bg-primary-700 dark:hover:text-primary-400"
            >
              <TbBrandGithubFilled size={24} />
            </AppLink>
          </div>
        </div>

        {/* Subscribe Section */}
        <div>
          <h3 className="font-heading  text-lg font-bold mb-3">Subscribe</h3>
          <p className="text-sm text-secondarytext mb-4 leading-relaxed">
            I write regularly on the subject of design and technology. Feel free
            to subscribe my latest writings.
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
