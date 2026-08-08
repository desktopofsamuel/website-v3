import React from "react";
import AppLink from "@/components/AppLink";
import SocialLinks from "@/components/SocialLinks";

export default function AppFooter() {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="px-page pt-16 pb-10">
        <h2 className="font-body font-normal text-5xl md:text-7xl tracking-tighter leading-none text-accent-foreground mb-6">
          Let&apos;s chat.
        </h2>
        <p className="font-body text-base leading-relaxed max-w-[44ch] mb-8 text-accent-foreground/75">
          I am excited for new opportunities. Let&apos;s talk about working
          together.
        </p>
        <div className="flex flex-wrap gap-3 mb-12">
          <AppLink
            href="mailto:desktopofsamuel@gmail.com"
            className="inline-flex items-center font-body font-semibold text-base px-6 py-3 border-2 border-accent-foreground text-accent-foreground rounded-md no-underline hover:bg-accent-foreground/10 transition-colors"
          >
            Get in Touch
          </AppLink>
          <AppLink
            href="https://desktopofsamuel.medium.com/subscribe"
            target="_blank"
            className="inline-flex items-center font-body font-semibold text-base px-6 py-3 border-2 border-accent-foreground/40 text-accent-foreground rounded-md no-underline hover:bg-accent-foreground/10 transition-colors"
          >
            Subscribe
          </AppLink>
        </div>
        <div className="border-t border-accent-foreground/20 pt-6 flex items-center justify-between flex-wrap gap-4">
          <span className="font-mono text-xs text-accent-foreground/60">
            © 2026 Desktop of Samuel · Not created by Framer · All rights reserved
          </span>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
