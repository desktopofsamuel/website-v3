"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import Image, { StaticImageData } from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AppLayout from "@/components/AppLayout";
import { Link } from "@/components/AppLink";
import { Button } from "@/components/ui/button";
import { TbBrandGithub, TbBrandLinkedin, TbMail } from "react-icons/tb";

import Profile2022 from "../../public/static/samuel-profile-2022.jpeg";
import Profile from "../../public/static/profile-2014.jpeg";
import Hsbclogo from "../../public/about/hsbc-logo.svg";
import Hyperairlogo from "../../public/about/hyperair-logo.svg";
import Playalogo from "../../public/about/playa-logo.svg";
import Applelogo from "../../public/about/apple-logo.svg";
import Okxlogo from "../../public/about/okx-logo.svg";
import Figma from "../../public/about/figma.svg";
import Adplist from "../../public/about/adplist.svg";
import Ama from "../../public/about/Design System AMA2.jpg";
import FirmVisit from "../../public/about/Firm Visit.jpeg";
import WorldTour from "../../public/about/architecting-design-for-scale.png";
import IntoDesignSystem from "../../public/about/into-design-system.png";

const socials = [
  {
    href: "https://www.linkedin.com/in/desktopofsamuel/",
    icon: TbBrandLinkedin,
    label: "LinkedIn",
  },
  {
    href: "mailto:desktopofsamuel@gmail.com",
    icon: TbMail,
    label: "Email",
  },
  {
    href: "https://www.github.com/desktopofsamuel",
    icon: TbBrandGithub,
    label: "Github",
  },
];

const journey = [
  {
    year: "2012",
    title: "Interned at Apple",
    description:
      "Majoring in Arts in college, I took a gap year with Apple\'s iTunes & App Store team. The experience grounded my love for digital products and the pace of shipping at scale.",
  },
  {
    year: "2015",
    title: "Co-founding an agency",
    description:
      "With growing freelance projects, I co-founded a digital agency to help small businesses, entrepreneurs, and non-profits launch their products from strategy to delivery.",
  },
  {
    year: "2019",
    title: "Leading product design",
    description:
      "I moved into start-ups and corporations as a product designer, leading multi-disciplinary teams across travel, banking, and crypto to ship outcomes that scale.",
  },
];

const career = [
  {
    image: Okxlogo,
    title: "Senior Product Designer",
    subtitle: "OKX",
    text: "Lead a design team to build seamless, accessible crypto investment products within a constantly evolving crypto landscape. Promoted from Product Designer (II) in 2023.",
    small: "2022 - 2024",
    cta: "Coming soon",
    href: "",
    color: "#000000",
  },
  {
    title: "UX/UI Consultant",
    subtitle: "HSBC via Protiviti",
    text: "Consultant placed in HSBC Wealth team, designed end-to-end browser & app journeys to enhance stock trading and analysis experience for Asia market.",
    small: "2021 - 2022",
    image: Hsbclogo,
    color: "#DB0011",
    cta: "View Work",
    href: "/work/hsbc",
  },
  {
    title: "Principal Designer",
    subtitle: "HyperAir",
    small: "2019 - 2021",
    text: "First design hire and design team of one, scaled product offering from prototype to multiple pillars with B2C & B2B platforms. Shipped data-driven design & feature enhancement for scale.",
    image: Hyperairlogo,
    cta: "View Work",
    href: "/work/hyperair-fx",
    color: "#0176ee",
  },
  {
    image: Playalogo,
    title: "Co-founder & Design Lead",
    subtitle: "Playa",
    text: "Co-founder of a bootstrapped digital agency, shipped award-winning web and app projects from concept to delivery for SMB and start-up clients.",
    small: "2015 - 2019",
    color: "#49CC74",
    cta: "View Work",
    href: "https://playa.hk/portfolio.html",
  },
  {
    title: "Cross Content Intern",
    subtitle: "Apple",
    small: "2012 - 2013",
    text: "Deferred from university for 1-year full-time internship at iTunes & App Store team to curate APAC editorial content for apps, films, music and books.",
    image: Applelogo,
    color: "#86868B",
  },
];

const education = [
  {
    title: "The University of Hong Kong",
    subtitle: "Bachelor of Arts",
  },
  {
    title: "IDEO U",
    subtitle: "Human Centered Strategy",
    text: "2023",
  },
  {
    title: "Glide",
    subtitle: "Glide Certifcation Level 1 - 3",
    text: "2024",
  },
];

const engagements = [
  {
    image: IntoDesignSystem,
    subtitle: "Host and Organiser",
    title: "Into Design System",
    small: "2025 July",
    noAnimation: true,
  },
  {
    image: WorldTour,
    subtitle: "Host of Friends of Figma World Tour",
    title: "Architecting design for scale ",
    small: "2025 July",
    noAnimation: true,
  },
  {
    image: FirmVisit,
    subtitle: "OKX Product Design Team Representative",
    title: "Campus Recruitment: HKUST Firm Visit",
    small: "2023",
    noAnimation: true,
  },
  {
    image: Ama,
    subtitle: "Host of Friends of Figma HK",
    title: "Let's talk about Design System",
    small: "2022 Sep",
    noAnimation: true,
  },
];

const community = [
  {
    title: "Community Leader",
    subtitle: "Friends of Figma, Hong Kong",
    text: "",
    image: Figma,
    cta: "Join upcoming events",
    href: "https://friends.figma.com/hong-kong",
  },
  {
    title: "Mentor",
    subtitle: "ADPList",
    text: "",
    image: Adplist,
    cta: "Schedule session",
    href: "https://adplist.org/mentors/samuel-wong",
  },
];

const awards = [
  {
    title: "Google Play",
    subtitle: "Best of 2022 - Everyday Essential Nominee",
    text: "2022",
  },
  {
    title: "OGCIO",
    subtitle: "Web Accessibility Recognition Scheme Triple Gold Award",
    text: "2018, 2016",
  },
  {
    subtitle: "Best .HK LegCo Members Website Award (Gold)",
    title: "HKIRC",
    text: "2017",
  },
  {
    subtitle: "Hong Kong Cyberport Creative Micro Fund",
    title: "Cyberport",
    text: "2016",
  },
];

type CompanyCardProps = {
  title: string;
  subtitle?: string;
  text?: string;
  image: string | StaticImageData;
  small?: string;
  color?: string;
  cta?: string;
  href?: string;
  noAnimation?: boolean;
};

function CompanyCard({
  title,
  subtitle,
  small,
  text,
  image,
  cta,
  color,
  href = "",
  noAnimation = false,
}: CompanyCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const hasImage = Boolean(image);
  const showHoverImage = !noAnimation && hasImage;

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursor({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const hoverHandlers = showHoverImage
    ? {
        onMouseEnter: () => setIsHovering(true),
        onMouseLeave: () => setIsHovering(false),
        onMouseMove: (event: MouseEvent<HTMLDivElement>) => handleMouseMove(event),
      }
    : {};

  return (
    <div
      ref={containerRef}
      className="group relative overflow-hidden rounded-3xl border border-border bg-background p-8 shadow-sm transition-colors duration-500 hover:border-primary-500/60"
      style={{
        "--accent-color": color ?? "var(--primary-500)",
      } as CSSProperties}
      {...hoverHandlers}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, var(--accent-color) 0%, transparent 55%)",
        }}
        aria-hidden
      />

      {showHoverImage && (
        <div
          className={`pointer-events-none absolute z-20 hidden md:block transition-opacity duration-200 ${isHovering ? "opacity-100" : "opacity-0"}`}
          style={{
            top: cursor.y,
            left: cursor.x,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative aspect-square w-32 rounded-2xl border border-border/40 bg-background/90 p-4 shadow-2xl backdrop-blur-md">
            <Image src={image} alt={`${title}`} fill className="object-contain" sizes="128px" />
          </div>
        </div>
      )}

      <div className="relative z-10 space-y-4">
        {!showHoverImage && hasImage && (
          <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-border/60 bg-border/30">
            <Image
              src={image}
              alt={`${title}`}
              fill
              className="object-contain p-6"
              sizes="(min-width: 1024px) 320px, 100vw"
            />
          </div>
        )}
        <div className="space-y-2">
          <span className="text-xs font-heading uppercase tracking-[0.3em] text-secondarytext">
            {subtitle}
            {small ? ` · ${small}` : ""}
          </span>
          <h3 className="text-2xl font-heading font-semibold leading-tight md:text-3xl">
            {title}
          </h3>
        </div>
        <p className="text-secondarytext">{text}</p>
        {cta && (
          href === "" ? (
            <Button variant="disabled" className="w-min" aria-disabled>
              {cta}
            </Button>
          ) : (
            <Button asChild variant="outline" className="w-min">
              <Link href={href} className="no-underline">
                {cta}
              </Link>
            </Button>
          )
        )}
      </div>
    </div>
  );
}

type EntryCardProps = {
  title: string;
  subtitle?: string;
  text?: string;
  image?: StaticImageData;
  cta?: string;
  href?: string;
};

function EntryCard({ title, text, image, subtitle, cta, href }: EntryCardProps) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-background px-4 py-6 shadow-sm md:flex-row md:items-center md:px-6">
      {image && (
        <div className="flex max-w-[72px] shrink-0 items-center transition-opacity duration-500 ease-out hover:opacity-70">
          <Image src={image} alt={`Logo of ${subtitle ?? title}`} />
        </div>
      )}
      <div className="flex w-full flex-col gap-2">
        <h3 className="text-xl font-heading font-semibold md:text-2xl">{title}</h3>
        {subtitle && (
          <p className="font-heading text-sm uppercase tracking-wide text-secondarytext">
            {subtitle}
          </p>
        )}
        {text && <p className="text-sm text-secondarytext">{text}</p>}
        {cta && href && (
          <div className="pt-2">
            <Button variant="outline" asChild>
              <Link href={href} target="_blank" className="no-underline">
                {cta}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AboutPage() {
  const startYear = 2015;
  const currentYear = new Date().getFullYear();
  const experienceYears = currentYear - startYear;
  const pageRef = useRef<HTMLDivElement | null>(null);
  const journeySectionRef = useRef<HTMLElement | null>(null);
  const journeyLineRef = useRef<HTMLSpanElement | null>(null);
  const journeyCardsRef = useRef<HTMLDivElement[]>([]);
  const stageLogoRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLElement | null>(null);
  const marqueeItemsRef = useRef<HTMLDivElement[]>([]);

  const stats = [
    {
      value: `${experienceYears}+`,
      label: "Years designing digital products",
    },
    {
      value: `${career.length}`,
      label: "Leadership roles across web3, finance, and travel",
    },
    {
      value: `${community.length + engagements.length}`,
      label: "Community programs, mentorships, and talks hosted",
    },
  ];

  useEffect(() => {
    if (!pageRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const fadeElements = gsap.utils.toArray<HTMLElement>("[data-gsap='fade-up']");

      fadeElements.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 48 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      if (journeySectionRef.current && journeyLineRef.current) {
        gsap.fromTo(
          journeyLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: journeySectionRef.current,
              start: "top 70%",
              end: "bottom 30%",
              scrub: true,
            },
          }
        );
      }

      journeyCardsRef.current.forEach((card) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { autoAlpha: 0.35, y: 48 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "bottom 40%",
              toggleActions: "play none none reverse",
            },
          }
        );

        ScrollTrigger.create({
          trigger: card,
          start: "top center",
          end: "bottom center",
          onLeave: () =>
            gsap.to(card, {
              autoAlpha: 0.4,
              duration: 0.3,
              overwrite: "auto",
            }),
          onLeaveBack: () =>
            gsap.to(card, {
              autoAlpha: 0.4,
              duration: 0.3,
              overwrite: "auto",
            }),
          onEnter: () =>
            gsap.to(card, {
              autoAlpha: 1,
              duration: 0.3,
              overwrite: "auto",
            }),
          onEnterBack: () =>
            gsap.to(card, {
              autoAlpha: 1,
              duration: 0.3,
              overwrite: "auto",
            }),
        });
      });

      if (stageLogoRef.current) {
        gsap.set(stageLogoRef.current, {
          top: "50%",
          left: "50%",
          xPercent: -50,
          yPercent: -50,
          scale: 1.1,
          autoAlpha: 0,
        });

        gsap
          .timeline()
          .to(stageLogoRef.current, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
          })
          .to(
            stageLogoRef.current,
            {
              top: "18%",
              left: "18%",
              scale: 0.7,
              duration: 1.1,
              ease: "power3.inOut",
            },
            "-=0.2"
          );

        gsap.to(stageLogoRef.current, {
          yPercent: -20,
          scrollTrigger: {
            trigger: pageRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      marqueeItemsRef.current.forEach((item, index) => {
        if (!item) return;

        gsap.set(item, { xPercent: index % 2 === 0 ? 0 : -50 });

        gsap.to(item, {
          xPercent: (index % 2 === 0 ? -150 : -50),
          repeat: -1,
          duration: 18,
          ease: "none",
          modifiers: {
            xPercent: (value) => {
              const parsed = parseFloat(value);
              if (Number.isNaN(parsed)) return value;
              return (parsed % 100).toString();
            },
          },
        });
      });

      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          yPercent: -20,
          scrollTrigger: {
            trigger: marqueeRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  marqueeItemsRef.current = [];
  journeyCardsRef.current = [];

  return (
    <AppLayout>
      <div ref={pageRef} className="flex-1 pb-24">
        <section className="relative isolate overflow-visible pt-16 md:pt-24" data-gsap="fade-up">
          <div
            ref={stageLogoRef}
            className="pointer-events-none absolute z-0 font-heading text-[18vw] font-black uppercase leading-none tracking-[-0.06em] text-primary-500/12 md:text-[14vw]"
            aria-hidden
          >
            Samuel
          </div>
          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 text-sm font-heading uppercase tracking-[0.25em] text-secondarytext">
                <span className="h-2 w-2 rounded-full bg-primary-500" aria-hidden />
                <span>About</span>
              </div>
              <h1 className="text-4xl font-heading font-bold leading-tight md:text-5xl">
                Hello, my name is Samuel.
              </h1>
              <p className="text-base leading-relaxed text-secondarytext md:text-lg">
                I got into product design because I&apos;m deeply passionate about technology and how it profoundly changes our way of living. For the past {experienceYears} years, I have been solving users and business problems and delivering delightful interfaces & experiences across domains like web3, finance, and travel industries.
              </p>
              <div className="flex flex-wrap items-center gap-5">
                <Button asChild size="lg">
                  <Link href="#journey" className="no-underline">
                    Explore my journey
                  </Link>
                </Button>
                <div className="flex gap-4 text-secondarytext">
                  {socials.map((social) => (
                    <Link
                      key={social.href}
                      href={social.href}
                      className="transition-colors hover:text-primary"
                      aria-label={social.label}
                    >
                      <social.icon size={24} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative mx-auto flex w-full max-w-xs items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary-500/30 blur-3xl" aria-hidden />
              <Image
                src={Profile2022}
                alt="Portrait of Samuel Wong"
                placeholder="blur"
                width={240}
                height={240}
                className="relative rounded-full border-4 border-border/60 shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="mt-16 md:mt-20" data-gsap="fade-up">
          <div className="rounded-3xl border border-border bg-background px-6 py-10 md:px-12 md:py-14">
            <div className="grid gap-8 md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-4">
                  <p className="text-3xl font-heading font-semibold md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="text-sm leading-relaxed text-secondarytext md:text-base">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={marqueeRef}
          className="relative mt-12 overflow-hidden rounded-full border border-border bg-background/80 py-4 shadow-inner backdrop-blur"
          aria-hidden
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background via-background/90 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background via-background/90 to-transparent" />
          <div className="flex gap-10">
            {[0, 1].map((groupIndex) => (
              <div
                key={groupIndex}
                ref={(element) => {
                  if (element) {
                    marqueeItemsRef.current[groupIndex] = element;
                  }
                }}
                className="flex min-w-full shrink-0 items-center gap-10 text-sm font-heading uppercase tracking-[0.7em] text-secondarytext md:text-base"
              >
                {Array.from({ length: 8 }).map((_, copyIndex) => (
                  <span key={`${groupIndex}-${copyIndex}`} className="whitespace-nowrap">
                    Product design lead
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section
          id="journey"
          ref={journeySectionRef}
          className="py-20 md:py-28"
        >
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="space-y-6" data-gsap="fade-up">
              <h2 className="text-3xl font-heading font-bold md:text-4xl">My Journey</h2>
              <p className="text-secondarytext md:text-lg">
                From a gap year immersed in Apple&apos;s iTunes & App Store team to co-founding a digital agency and leading product design across web3, finance, and travel, each chapter sharpened how I blend craft, strategy, and empathy.
              </p>
              <p className="text-secondarytext md:text-lg">
                Scroll to trace the milestones that anchor my practice.
              </p>
            </div>
            <div className="relative border-l border-border pl-12 lg:pl-16">
              <span
                ref={journeyLineRef}
                className="absolute left-0 top-0 h-full w-px origin-top bg-primary-500/60"
                aria-hidden
              />
              <div className="space-y-14">
                {journey.map((item, index) => (
                  <div
                    key={item.title}
                    className="relative grid gap-6 md:grid-cols-[minmax(0,0.25fr)_minmax(0,1fr)]"
                  >
                    <div className="relative">
                      <span className="pointer-events-none block font-heading text-5xl uppercase tracking-tight text-primary-500/80 md:text-7xl">
                        {item.year}
                      </span>
                    </div>
                    <div
                      ref={(element) => {
                        if (element) {
                          journeyCardsRef.current[index] = element;
                        }
                      }}
                      className="relative rounded-2xl border border-border bg-background px-6 py-8 shadow-sm"
                    >
                      <p className="text-sm font-heading uppercase tracking-[0.3em] text-secondarytext">
                        {item.title}
                      </p>
                      <p className="mt-3 text-secondarytext md:text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28" data-gsap="fade-up">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
            <div className="space-y-5">
              <h2 className="text-3xl font-heading font-bold md:text-4xl">
                Staying close to the craft
              </h2>
              <p className="text-secondarytext md:text-lg">
                Majoring in Arts led me to take a gap year at Apple&apos;s iTunes & App Store team—where I first experienced the pace of digital products and the impact of thoughtful curation.
              </p>
              <p className="text-secondarytext md:text-lg">
                After graduation, I co-founded a digital agency and helped small businesses, entrepreneurs, and non-profits launch their projects end to end.
              </p>
              <p className="text-secondarytext md:text-lg">
                Today I lead product design in start-ups and global organisations across travel, banking, and crypto industries—bringing a systems lens to every experience I touch.
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-border shadow-lg">
              <Image
                src={Profile}
                alt="Samuel Wong speaking at a community event"
                placeholder="blur"
                width={1920}
                height={1280}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section id="experience" className="py-20 md:py-28" data-gsap="fade-up">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-heading font-bold md:text-4xl">
                Experience
              </h2>
              <p className="text-secondarytext md:text-lg">
                Leading cross-functional teams to ship accessible, data-informed experiences across highly regulated and fast-moving environments.
              </p>
            </div>
            <div className="space-y-8">
              {career.map((job) => (
                <div key={job.title} data-gsap="fade-up">
                  <CompanyCard {...job} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28" data-gsap="fade-up">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-heading font-bold md:text-4xl">
                Learning, community, and recognition
              </h2>
              <p className="text-secondarytext md:text-lg">
                Sharing knowledge keeps me accountable to the craft—through formal learning, mentorship, and building communities that move design forward.
              </p>
            </div>
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-sm font-heading uppercase tracking-[0.25em] text-secondarytext">
                    Education
                  </h3>
                  <div className="space-y-4" data-gsap="fade-up">
                    {education.map((edu) => (
                      <EntryCard key={edu.title} {...edu} />
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-heading uppercase tracking-[0.25em] text-secondarytext">
                    Awards & recognitions
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {awards.map((award) => (
                      <div key={`${award.title}-${award.subtitle}`} data-gsap="fade-up">
                        <EntryCard {...award} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-sm font-heading uppercase tracking-[0.25em] text-secondarytext">
                    Speaking & engagements
                  </h3>
                  <div className="space-y-8">
                    {engagements.map((event) => (
                      <div key={event.title} data-gsap="fade-up">
                        <CompanyCard {...event} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-heading uppercase tracking-[0.25em] text-secondarytext">
                    Community
                  </h3>
                  <div className="space-y-4" data-gsap="fade-up">
                    {community.map((comm) => (
                      <EntryCard key={comm.title} {...comm} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24" id="contact" data-gsap="fade-up">
          <div className="rounded-3xl border border-border bg-background px-8 py-16 text-center shadow-xl">
            <h2 className="text-3xl font-heading font-bold leading-tight md:text-4xl">
              Let&apos;s connect
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-secondarytext md:text-lg">
              Drop me a line if you want to say hi, collaborate, or exchange thoughts on design, technology, and leadership.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="mailto:desktopofsamuel@gmail.com" className="no-underline">
                Get in touch
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
