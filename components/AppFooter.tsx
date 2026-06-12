import React from "react";
import AppLink from "@/components/AppLink";
import {
  TbBrandLinkedinFilled,
  TbBrandX,
  TbBrandInstagram,
  TbBrandMedium,
  TbBrandGithubFilled,
} from "react-icons/tb";

const socials = [
  {
    Icon: TbBrandLinkedinFilled,
    href: "https://www.linkedin.com/in/desktopofsamuel/",
    label: "LinkedIn",
  },
  {
    Icon: TbBrandX,
    href: "https://www.x.com/desktopofsamuel",
    label: "X",
  },
  {
    Icon: TbBrandInstagram,
    href: "https://www.instagram.com/desktopofsamuel",
    label: "Instagram",
  },
  {
    Icon: TbBrandMedium,
    href: "https://medium.com/desktop-of-samuel",
    label: "Medium",
  },
  {
    Icon: TbBrandGithubFilled,
    href: "https://www.github.com/desktopofsamuel",
    label: "GitHub",
  },
];

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
            className="inline-flex items-center font-body font-semibold text-base px-6 py-3 bg-background text-accent rounded-md no-underline hover:opacity-90 transition-opacity"
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
            © 2026 Desktop of Samuel · Hong Kong
          </span>
          <div className="flex gap-2.5">
            {socials.map(({ Icon, href, label }) => (
              <AppLink
                key={href}
                href={href}
                target="_blank"
                aria-label={label}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent-foreground/15 text-accent-foreground no-underline hover:bg-accent-foreground/30 transition-colors"
              >
                <Icon size={16} />
              </AppLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
