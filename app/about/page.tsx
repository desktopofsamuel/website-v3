import type { Metadata } from "next";
import Image, { StaticImageData } from "next/image";
import AppLayout from "@/components/AppLayout";
import { Link } from "@/components/AppLink";
import SidebarSection from "@/components/SidebarSection";
import EngagementGallery from "@/components/EngagementGallery";
import ProfilePortraitLightbox from "@/components/ProfilePortraitLightbox";
import config from "@/../config";

import Hsbclogo from "../../public/about/hsbc-logo.svg";
import Hyperairlogo from "../../public/about/hyperair-logo.svg";
import Playalogo from "../../public/about/playa-logo.svg";
import Applelogo from "../../public/about/apple-logo.svg";
import Okxlogo from "../../public/about/okx-logo.svg";
import Pepperstonelogo from "../../public/about/pepperstone-logo.svg";
import Figma from "../../public/about/figma.svg";
import Ama from "../../public/about/Design System AMA2.jpg";
import FirmVisit from "../../public/about/Firm Visit.jpeg";
import WorldTour from "../../public/about/architecting-design-for-scale.png";
import IntoDesignSystem from "../../public/about/into-design-system.png";

type CareerEntry = {
  company: string;
  role: string;
  period: string;
  description: string;
  logo: StaticImageData;
  color: string;
  href?: string;
};

const career: CareerEntry[] = [
  {
    company: "Pepperstone",
    role: "Product Design Lead",
    period: "2025 – Now",
    description:
      "Build a crypto exchange from ground-up, lead a design team to build seamless, accessible crypto investment products within a constantly evolving crypto landscape. Promoted from Senior Product Designer in 2025.",
    logo: Pepperstonelogo,
    color: "#FF5000",
  },
  {
    company: "OKX",
    role: "Senior Product Designer",
    period: "2022 – 2024",
    description:
      "Lead a design team to build seamless, accessible crypto investment products within a constantly evolving crypto landscape. Promoted from Product Designer (II) in 2023.",
    logo: Okxlogo,
    color: "#000000",
  },
  {
    company: "HSBC via Protiviti",
    role: "UX/UI Consultant",
    period: "2021 – 2022",
    description:
      "Consultant placed in HSBC Wealth team, designed end-to-end browser & app journeys to enhance stock trading and analysis experience for Asia market.",
    logo: Hsbclogo,
    color: "#DB0011",
    href: "/work/hsbc",
  },
  {
    company: "HyperAir",
    role: "Principal Designer",
    period: "2019 – 2021",
    description:
      "First design hire and design team of one, scaled product offering from prototype to multiple pillars with B2C & B2B platforms. Shipped data-driven design & feature enhancement for scale.",
    logo: Hyperairlogo,
    color: "#0176ee",
    href: "/work/hyperair-fx",
  },
  {
    company: "Playa",
    role: "Co-founder & Design Lead",
    period: "2015 – 2019",
    description:
      "Co-founder of a bootstrapped digital agency, shipped award-winning web and app projects from concept to delivery for SMB and start-up clients.",
    logo: Playalogo,
    color: "#49CC74",
    href: "https://playa.hk/portfolio.html",
  },
  {
    company: "Apple",
    role: "Cross Content Intern",
    period: "2012 – 2013",
    description:
      "Deferred from university for 1-year full-time internship at iTunes & App Store team to curate APAC editorial content for apps, films, music and books.",
    logo: Applelogo,
    color: "#86868B",
  },
];

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
    subtitle: "Leader of Friends of Figma Hong Kong ·(2022 - 2026)",
    image: WorldTour,
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
    <AppLayout>
      <SidebarSection
        label="About me"
        leftAside={<ProfilePortraitLightbox />}
      >
        <p className="font-body text-2xl leading-9 tracking-tight text-foreground mb-2 max-w-[56ch] text-pretty">
          Hello, my name is Samuel.
          <br />I got into product design because I&apos;m deeply passionate
          about technology and how it profoundly changes our way of living. For
          the past {experienceYears} years, I have been solving users and
          business problems and delivering delightful interfaces &amp;
          experiences across domains like web3, finance, and travel industries.
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

      <SidebarSection label="Work Experience">
        <div>
          {career.map((job, i) => (
            <div
              key={job.company}
              className={`py-8 ${
                i < career.length - 1 ? "border-b border-border/50" : ""
              } ${i === 0 ? "pt-0" : ""} ${
                i === career.length - 1 ? "pb-0" : ""
              }`}
            >
              <div className="font-body text-2xl leading-9 tracking-tight text-foreground mb-1">
                {job.company}
              </div>
              <div className="font-body text-base leading-6 tracking-tight text-foreground mb-3">
                {job.role}{" "}
                <span className="font-mono text-muted-foreground">{job.period}</span>
              </div>
              <p className="font-body text-sm leading-7 text-muted-foreground mb-4">
                {job.description}
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((slot) => (
                  <div
                    key={slot}
                    className="aspect-[16/10] bg-lift border border-border rounded-sm flex items-center justify-center p-5 transition-colors duration-500 ease-in-out hover:[background-color:var(--hover-color)]"
                    style={
                      {
                        "--hover-color": job.color,
                      } as React.CSSProperties
                    }
                  >
                    <Image
                      src={job.logo}
                      alt={`${job.company} logo`}
                      className="max-h-8 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
              {job.href && (
                <Link
                  href={job.href}
                  className="inline-block font-body text-sm text-foreground border-b border-border hover:border-foreground transition-colors mt-4"
                >
                  View work →
                </Link>
              )}
            </div>
          ))}
        </div>
      </SidebarSection>

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

      <SidebarSection label="Engagement">
        <EngagementGallery engagements={engagements} />
      </SidebarSection>

      <SidebarSection label="Community">
        <div>
          {community.map((entry, i) => (
            <div
              key={entry.title}
              className={`py-4 ${
                i < community.length - 1 ? "border-b border-border/50" : ""
              } ${i === 0 ? "pt-0" : ""} ${
                i === community.length - 1 ? "pb-0" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-lift border border-border flex items-center justify-center flex-shrink-0 p-2">
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
            </div>
          ))}
        </div>
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
        <h2 className="font-body font-extrabold text-5xl md:text-7xl tracking-tighter leading-none text-foreground mb-5">
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
    </AppLayout>
  );
}
