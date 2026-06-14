import type { Metadata } from "next";
import Image, { StaticImageData } from "next/image";
import { Link } from "@/components/AppLink";
import SidebarSection from "@/components/SidebarSection";
import EngagementGallery from "@/components/EngagementGallery";
import ProfilePortraitLightbox from "@/components/ProfilePortraitLightbox";
import CareerVideoMockup from "@/components/CareerVideoMockup";
import CareerMobileVideoMockup from "@/components/CareerMobileVideoMockup";
import config from "@/config";

import Hsbclogo from "../../../public/about/hsbc-logo.svg";
import Hyperairlogo from "../../../public/about/hyperair-logo.svg";
import Playalogo from "../../../public/about/playa-logo.svg";
import Applelogo from "../../../public/about/apple-logo.svg";
import Okxlogo from "../../../public/about/okx-logo.svg";
import Pepperstonelogo from "../../../public/about/pepperstone-logo.svg";
import Figma from "../../../public/about/figma.svg";
import Ama from "../../../public/about/Design System AMA2.jpg";
import FirmVisit from "../../../public/about/Firm Visit.jpeg";
import WorldTour from "../../../public/about/architecting-design-for-scale.png";
import IntoDesignSystem from "../../../public/about/into-design-system.png";
import Config from "../../../public/static/2024-config.jpg";
import GridPlaya01 from "../../../public/about/Grid Playa 01.png";
import GridPlaya02 from "../../../public/about/Grid Playa 02.png";
import GridPlaya03 from "../../../public/about/Grid Playa 03.png";
import GridPlaya04 from "../../../public/about/Grid Playa 04.png";
import GridHyperair01 from "../../../public/about/Grid Hyperair 01.png";
import GridHyperair02 from "../../../public/about/Grid Hyperair 02.png";
import GridHSBC01 from "../../../public/about/Grid HSBC 01.png";
import GridHSBC02 from "../../../public/about/Grid HSBC 02.png";
import GridOKX01 from  "../../../public/about/Grid OKX 01.png";
import GridOKX02 from  "../../../public/about/Grid OKX 02.png";
import GridOKX03 from  "../../../public/about/Grid OKX 03.png";
import GridOKX04 from "../../../public/about/Grid OKX 04.png";


type CareerPhoto = {
  src?: StaticImageData;
  videoSrc?: string;
  videoMockup?: "laptop" | "mobile";
  caption: string;
  alt: string;
};

type CareerEntry = {
  company: string;
  role: string;
  period: string;
  description: string;
  logo: StaticImageData;
  color: string;
  href?: string;
  feature?: boolean;
  photos?: CareerPhoto[];
};

const career: CareerEntry[] = [
  {
    company: "Pepperstone",
    role: "Product Design Lead",
    period: "2025 – Now",
    feature: true,
    description:
      "Build a crypto exchange from ground-up, lead a design team to build seamless, accessible crypto investment products within a constantly evolving crypto landscape. Promoted from Senior Product Designer in 2025.",
    logo: Pepperstonelogo,
    color: "#FF5000",
    photos: [
      {
        videoSrc:
          "https://cdn.desktopofsamuel.com/pcrypto-web-landing-2-full.webm",
        caption: "Crypto platform",
        alt: "Pepperstone crypto exchange web UI",
      },
      {
        videoSrc:
          "https://cdn.desktopofsamuel.com/pcrypto-home-app-full.webm",
        videoMockup: "mobile",
        caption: "Mobile app",
        alt: "Pepperstone crypto exchange mobile app",
      },
    ],
  },
  {
    company: "OKX",
    role: "Product Design Lead",
    period: "2022 – 2024",
    description:
      "Lead a design team to build seamless, accessible crypto investment products within a constantly evolving crypto landscape. Promoted from Product Designer (II) in 2023.",
    logo: Okxlogo,
    color: "#000000",
    feature: true,
    photos: [
      {
        src: GridOKX01,
        caption: "Grow Tab",
        alt: "Stock Screener for HSBC Easy Invest",
      },
      {
        src: GridOKX03,
        caption: "Staking",
        alt: "Color System Upgrade",
      },
      {
        src: GridOKX04,
        caption: "Structured Products",
        alt: "BETH Shark Fin",
      },
    ]
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
    photos: [
      {
        src: GridHSBC01,
        caption: "Stock Screener",
        alt: "Stock Screener for HSBC Easy Invest",
      },
      {
        src: GridHSBC02,
        caption: "Global Buy Sell Color",
        alt: "Color System Upgrade",
      },
    ]
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
    photos: [
      {
        src: GridHyperair01,
        caption: "Travel Platform",
        alt: "Hong Kong Travel Platform",
      },
      {
        src: GridHyperair02,
        caption: "FX Exchange Prototype",
        alt: "FX Exchange Prototype",
      },
    ]
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
    photos: [
      {
        src: GridPlaya01,
        caption: "Storage Unit System",
        alt: "Playa agency project — e-commerce interface",
      },
      {
        src: GridPlaya02,
        caption: "District Cultural Event Exhibition App & Web",
        alt: "Hulu Culture - iTour & H.A.D Walk Website",
      },
      {
        src: GridPlaya03,
        caption: "Online Novel Reading Platform",
        alt: "Creation Cabin Novel Reading Platform",
      },
      {
        src: GridPlaya04,
        caption: "CRM for SENs & Parents",
        alt: "The Children Development Center CRM",
      },
    ],
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

function getCareerPhotoGridClass(job: CareerEntry): string {
  if (!job.photos?.length) return "grid grid-cols-3 gap-3 max-w-xs";
  if (!job.feature) return "grid w-full grid-cols-4 gap-3";

  const count = job.photos.length;
  if (count === 1) return "grid w-full grid-cols-1 gap-3";
  if (count === 2) return "grid w-full grid-cols-2 gap-3";
  if (count === 4) return "grid w-full grid-cols-2 gap-3";
  return "grid w-full grid-cols-3 gap-3";
}

function getCareerPhotoSizes(job: CareerEntry): string {
  if (!job.feature) return "(max-width: 768px) 25vw, 25vw";
  const count = job.photos?.length ?? 1;
  if (count === 1) return "(max-width: 768px) 100vw, 100vw";
  if (count === 2) return "(max-width: 768px) 50vw, 50vw";
  return "(max-width: 768px) 33vw, 33vw";
}

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
          <br />I got into product design because I&apos;m deeply passionate
          about technology and how it profoundly changes our way of living. For
          the past {experienceYears} years, I have been solving users and
          business problems and delivering delightful interfaces &amp;
          experiences across domains like web3, finance, and travel industries.
          <br />
          Over the past few years, I&apos;ve had the pleasure of working with
          some genuinely ambitious teams — helping HSBC redesign wealth
          management journeys for Asia, building HyperAir&apos;s product from
          prototype to scale as their first design hire, and most recently
          leading product design at Pepperstone. The work spans domains, but
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

      <SidebarSection label="Work">
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
                <span className="font-mono text-muted-foreground">
                  {job.period}
                </span>
              </div>
              <p className="font-body text-sm leading-7 text-muted-foreground mb-4">
                {job.description}
              </p>
              <div className={getCareerPhotoGridClass(job)}>
                {job.photos?.length
                  ? job.photos.map((photo) => {
                      if (photo.videoSrc) {
                        const VideoMockup =
                          photo.videoMockup === "mobile"
                            ? CareerMobileVideoMockup
                            : CareerVideoMockup;

                        return (
                          <VideoMockup
                            key={photo.alt}
                            src={photo.videoSrc}
                            alt={photo.alt}
                            caption={photo.caption}
                          />
                        );
                      }

                      return (
                        <div
                          key={photo.alt}
                          className="group relative aspect-square min-w-0 overflow-hidden rounded-sm border border-border bg-lift"
                        >
                          <Image
                            src={photo.src!}
                            alt={photo.alt}
                            fill
                            sizes={getCareerPhotoSizes(job)}
                            className="object-cover"
                          />
                          <span className="absolute top-2 right-2 z-10 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-foreground bg-background/25 backdrop-blur-md rounded-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            {photo.caption}
                          </span>
                        </div>
                      );
                    })
                  : (
                      <div
                        className="relative aspect-square col-span-1 bg-lift border border-border rounded-sm flex items-center justify-center p-5 transition-colors duration-500 ease-in-out hover:[background-color:var(--hover-color)]"
                        style={
                          {
                            "--hover-color": job.color,
                          } as React.CSSProperties
                        }
                      >
                        <Image
                          src={job.logo}
                          alt={`${job.company} logo`}
                          className="max-h-10 w-auto object-contain"
                        />
                      </div>
                    )}
              </div>
              {job.href ? (
                <Link
                  href={job.href}
                  className="inline-block font-body text-sm text-foreground border-b border-border hover:border-foreground transition-colors mt-4"
                >
                  View case study →
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="inline-block font-body text-sm text-muted-foreground border-b border-border/50 mt-4 cursor-not-allowed"
                >
                  Coming soon →
                </span>
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

      <SidebarSection label="Community">
        {community.map((entry) => (
          <div
            key={entry.title}
            className="flex items-center gap-4 pb-6 mb-6 border-b border-border/50"
          >
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
        ))}
        <EngagementGallery engagements={engagements} />
        {sideProjects.map((project) => (
          <div
            key={project.title}
            className="flex items-center gap-4 pt-6 mt-6 border-t border-border/50"
          >
            <div className="w-12 h-12 rounded-md bg-lift border border-border flex items-center justify-center flex-shrink-0 p-2">
              {project.logo ? (
                <Image
                  src={project.logo}
                  alt={`${project.title} logo`}
                  className="max-h-full w-auto object-contain"
                />
              ) : (
                <span className="font-mono text-xs font-medium text-muted-foreground">
                  W3
                </span>
              )}
            </div>
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
    </>
  );
}
