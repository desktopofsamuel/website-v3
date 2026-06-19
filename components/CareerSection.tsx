import Image, { StaticImageData } from "next/image";
import { Link } from "@/components/AppLink";
import SidebarSection from "@/components/SidebarSection";
import CareerVideoMockup from "@/components/CareerVideoMockup";
import CareerMobileVideoMockup from "@/components/CareerMobileVideoMockup";

import Hsbclogo from "../public/about/hsbc-logo.svg";
import Hyperairlogo from "../public/about/hyperair-logo.svg";
import Playalogo from "../public/about/playa-logo.svg";
import Applelogo from "../public/about/apple-logo.svg";
import Okxlogo from "../public/about/okx-logo.svg";
import Pepperstonelogo from "../public/about/pepperstone-logo.svg";
import GridPlaya01 from "../public/about/Grid Playa 01.png";
import GridPlaya02 from "../public/about/Grid Playa 02.png";
import GridPlaya03 from "../public/about/Grid Playa 03.png";
import GridPlaya04 from "../public/about/Grid Playa 04.png";
import GridHyperair01 from "../public/about/Grid Hyperair 01.png";
import GridHyperair02 from "../public/about/Grid Hyperair 02.png";
import GridHSBC01 from "../public/about/Grid HSBC 01.png";
import GridHSBC02 from "../public/about/Grid HSBC 02.png";
import GridOKX01 from "../public/about/Grid OKX 01.png";
import GridOKX03 from "../public/about/Grid OKX 03.png";
import GridOKX04 from "../public/about/Grid OKX 04.png";

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
  hideComingSoon?: boolean;
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
        caption: "AU Site Landing Page",
        alt: "Pepperstone crypto exchange web UI",
      },
      {
        videoSrc:
          "https://cdn.desktopofsamuel.com/pcrypto-home-app-full.webm",
        videoMockup: "mobile",
        caption: "Native App",
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
    ],
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
    ],
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
    ],
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
    hideComingSoon: true,
  },
];

function getCareerPhotoGridClass(job: CareerEntry): string {
  if (!job.photos?.length) return "grid grid-cols-3 gap-3 max-w-xs";
  if (!job.feature) return "grid w-full grid-cols-2 md:grid-cols-4 gap-3";

  const count = job.photos.length;
  if (count === 1) return "grid w-full grid-cols-1 gap-3";
  if (count === 2) return "grid w-full grid-cols-1 md:grid-cols-2 gap-3";
  if (count === 4) return "grid w-full grid-cols-1 md:grid-cols-2 gap-3";
  return "grid w-full grid-cols-1 md:grid-cols-3 gap-3";
}

function getCareerPhotoSizes(job: CareerEntry): string {
  if (!job.feature) return "(max-width: 768px) 50vw, 25vw";
  const count = job.photos?.length ?? 1;
  if (count === 1) return "(max-width: 768px) 100vw, 100vw";
  if (count === 2) return "(max-width: 768px) 100vw, 50vw";
  return "(max-width: 768px) 100vw, 33vw";
}

type CareerSectionProps = {
  label?: string;
};

export default function CareerSection({ label = "Work" }: CareerSectionProps) {
  return (
    <SidebarSection label={label}>
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
            <div className="flex items-center justify-between gap-4 font-body text-base leading-6 tracking-tight text-foreground mb-3">
              <div>{job.role}</div>
              <span className="shrink-0 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
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
            ) : job.hideComingSoon ? null : (
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
  );
}
