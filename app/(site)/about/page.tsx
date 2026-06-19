import type { Metadata } from "next";
import Image, { StaticImageData } from "next/image";
import { Link } from "@/components/AppLink";
import SidebarSection from "@/components/SidebarSection";
import EngagementGallery from "@/components/EngagementGallery";
import ProfilePortraitLightbox from "@/components/ProfilePortraitLightbox";
import CareerSection from "@/components/CareerSection";
import config from "@/config";

import Figma from "../../../public/about/figma.svg";
import Ama from "../../../public/about/Design System AMA2.jpg";
import FirmVisit from "../../../public/about/Firm Visit.jpeg";
import WorldTour from "../../../public/about/architecting-design-for-scale.png";
import IntoDesignSystem from "../../../public/about/into-design-system.png";
import Config from "../../../public/static/2024-config.jpg";

const journey = [
  {
    title: "Interned at Apple",
    description:
      "Majoring in Arts in college, I took a gap year working for Apple's iTunes & App Store team. This valuable experience cultivated my interest and knowledge in digital products.",
  },
  {
    title: "Co-founding an agency",
    description:
      "With growing freelance web & design projects, I co-founded a digital agency after graduation. Me and my team helped small businesses, entrepreneurs, and non-profits launching their projects.",
  },
  {
    title: "Lead product design",
    description:
      "After that, I transitioned to start-up & corporations as a product designer to lead design projects in travel, banking and crypto industries.",
  },
];

const education = [
  { title: "The University of Hong Kong", subtitle: "Bachelor of Arts" },
  { title: "IDEO U", subtitle: "Human Centered Strategy · 2023" },
  { title: "Glide", subtitle: "Glide Certification Level 1 – 3 · 2024" },
];

type Engagement = {
  title: string;
  subtitle: string;
  image: StaticImageData;
};

const engagements: Engagement[] = [
  {
    title: "Into Design System",
    subtitle: "Host and Organiser · 2025 July",
    image: IntoDesignSystem,
  },
  {
    title: "Architecting design for scale",
    subtitle: "Host of Friends of Figma World Tour · 2025 July",
    image: WorldTour,
  },
  {
    title: "Config Watch Party Hong Kong ",
    subtitle: "Leader of Friends of Figma Hong Kong ·2022 - 2026",
    image: Config,
  },
  {
    title: "Campus Recruitment: HKUST Firm Visit",
    subtitle: "OKX Product Design Team Representative · 2023",
    image: FirmVisit,
  },
  {
    title: "Let's talk about Design System",
    subtitle: "Host of Friends of Figma HK · 2022 Sep",
    image: Ama,
  },
];

const community = [
  {
    title: "Friends of Figma, Hong Kong",
    subtitle: "Community Leader",
    href: "https://friends.figma.com/hong-kong",
    logo: Figma,
  },
];

type SideProject = {
  title: string;
  subtitle: string;
  href: string;
  logo?: StaticImageData;
};

const sideProjects: SideProject[] = [
  {
    title: "Web3 Design Pal",
    subtitle:
      "Open source side project · Figma plugin for mock crypto wallet addresses in UI work",
    href: "https://github.com/desktopofsamuel/web3-design-pal",
  },
];

const awards = [
  {
    title: "Google Play",
    subtitle: "Best of 2022 — Everyday Essential Nominee · 2022",
  },
  {
    title: "OGCIO",
    subtitle:
      "Web Accessibility Recognition Scheme Triple Gold Award · 2018, 2016",
  },
  {
    title: "HKIRC",
    subtitle: "Best .HK LegCo Members Website Award (Gold) · 2017",
  },
  {
    title: "Cyberport",
    subtitle: "Hong Kong Cyberport Creative Micro Fund · 2016",
  },
];

const CURRENT_YEAR = 2026;
const START_YEAR = 2015;

export const metadata: Metadata = {
  title: "About | Desktop of Samuel",
  description:
    "Samuel Wong — Hong Kong based UI/UX Designer. User Interface Design, User Experience Design, Product Design.",
  openGraph: {
    title: "About | Desktop of Samuel",
    description:
      "Samuel Wong — Hong Kong based UI/UX Designer. User Interface Design, User Experience Design, Product Design.",
    url: `${config.URL}/about`,
  },
};

export default function AboutPage() {
  const experienceYears = CURRENT_YEAR - START_YEAR;

  return (
    <>
      <SidebarSection label="About me" leftAside={<ProfilePortraitLightbox />}>
        <p className="font-body text-2xl leading-9 tracking-tight text-foreground mb-2 max-w-[56ch] text-pretty">
          Hello, my name is Samuel.
          <br />
          <br />I got into product design because I&apos;m deeply passionate
          about technology and how it profoundly changes our way of living. For
          the past {experienceYears} years, I have been solving users and
          business problems and delivering delightful interfaces &amp;
          experiences across domains like web3 and finance industries.
          <br />
          <br />
          Over the past few years, I&apos;ve had the pleasure of working with
          some genuinely ambitious teams in Hong Kong — helping HSBC shipped stock screener for APAC regions, building OKX&apos;s Grow tab and leading Financial Products design team, and most recently
          leading product design at Pepperstone Crypto, building a brand new crypto exchange. The work spans domains, but
          it&apos;s always fundamentally about people and how they make sense
          of complexity.
        </p>
      </SidebarSection>

      <SidebarSection label="My journey">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {journey.map((item) => (
            <div key={item.title}>
              <h3 className="font-body text-2xl tracking-tight text-foreground mb-2.5 leading-snug">
                {item.title}
              </h3>
              <p className="font-body text-sm leading-7 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </SidebarSection>

      <CareerSection label="Work" />

      <SidebarSection label="Education">
        <div>
          {education.map((edu, i) => (
            <div
              key={edu.title}
              className={`py-4 ${
                i < education.length - 1 ? "border-b border-border/50" : ""
              } ${i === 0 ? "pt-0" : ""} ${
                i === education.length - 1 ? "pb-0" : ""
              }`}
            >
              <div className="font-body text-xl tracking-tight text-foreground mb-1">
                {edu.title}
              </div>
              <div className="font-body text-sm leading-6 text-muted-foreground">
                {edu.subtitle}
              </div>
            </div>
          ))}
        </div>
      </SidebarSection>

      <SidebarSection label="Community">
        {community.map((entry) => (
          <div
            key={entry.title}
            className="flex items-center gap-4 pb-6 mb-6 border-b border-border/50"
          >
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <Image
                src={entry.logo}
                alt={`${entry.title} logo`}
                className="max-h-full w-auto object-contain"
              />
            </div>
            <div>
              <div className="font-body text-xl tracking-tight text-foreground mb-1">
                {entry.title}
              </div>
              <div className="font-body text-sm leading-6 text-muted-foreground">
                {entry.subtitle}
              </div>
            </div>
            <Link
              href={entry.href}
              target="_blank"
              className="ml-auto font-body text-sm text-foreground border-b border-border hover:border-foreground transition-colors"
            >
              Join upcoming events →
            </Link>
          </div>
        ))}
        <EngagementGallery engagements={engagements} />
        {sideProjects.map((project) => (
          <div
            key={project.title}
            className="flex items-center gap-4 pt-6 mt-6 border-t border-border/50"
          >
            {project.logo ? (
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <Image
                  src={project.logo}
                  alt={`${project.title} logo`}
                  className="max-h-full w-auto object-contain"
                />
              </div>
            ) : null}
            <div>
              <div className="font-body text-xl tracking-tight text-foreground mb-1">
                {project.title}
              </div>
              <div className="font-body text-sm leading-6 text-muted-foreground">
                {project.subtitle}
              </div>
            </div>
            <Link
              href={project.href}
              target="_blank"
              className="ml-auto font-body text-sm text-foreground border-b border-border hover:border-foreground transition-colors"
            >
              View on GitHub →
            </Link>
          </div>
        ))}
      </SidebarSection>

      <SidebarSection label="Awards">
        <div>
          {awards.map((award, i) => (
            <div
              key={`${award.title}-${i}`}
              className={`py-4 ${
                i < awards.length - 1 ? "border-b border-border/50" : ""
              } ${i === 0 ? "pt-0" : ""} ${
                i === awards.length - 1 ? "pb-0" : ""
              }`}
            >
              <div className="font-body text-xl tracking-tight text-foreground mb-1">
                {award.title}
              </div>
              <div className="font-body text-sm leading-6 text-muted-foreground">
                {award.subtitle}
              </div>
            </div>
          ))}
        </div>
      </SidebarSection>

      <section className="mx-divider py-20 text-center border-t border-border">
        <h2 className="font-body font-normal text-5xl md:text-7xl tracking-tighter leading-none text-foreground mb-5">
          Let&apos;s connect
        </h2>
        <p className="font-body text-sm leading-7 text-muted-foreground mb-7 max-w-[60ch] mx-auto">
          Drop me a line if you want to say hi, or share your thoughts on my
          writings.
        </p>
        <Link
          href="mailto:desktopofsamuel@gmail.com"
          className="inline-flex items-center font-body text-base font-medium px-7 py-2.5 bg-foreground text-background rounded-sm no-underline hover:opacity-85 transition-opacity"
        >
          Get in Touch
        </Link>
      </section>
    </>
  );
}
