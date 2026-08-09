import AppLink from "@/components/AppLink";
import {
  TbBrandLinkedinFilled,
  TbBrandX,
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

type SocialLinksProps = {
  variant?: "footer" | "mobile";
};

export default function SocialLinks({ variant = "footer" }: SocialLinksProps) {
  const buttonClass =
    variant === "footer"
      ? "inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent-foreground/15 text-accent-foreground no-underline hover:bg-accent-foreground/30 transition-colors"
      : "inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted text-foreground no-underline hover:bg-accent transition-colors";

  return (
    <div className="flex gap-2.5">
      {socials.map(({ Icon, href, label }) => (
        <AppLink
          key={href}
          href={href}
          target="_blank"
          aria-label={label}
          className={buttonClass}
        >
          <Icon size={16} />
        </AppLink>
      ))}
    </div>
  );
}
