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
    title: "Product Design Lead",
    subtitle: "Pepperstone",
    text: "Lead a design team to build seamless, accessible crypto investment products within a constantly evolving crypto landscape. Promoted from Product Designer (II) in 2023.",
    small: "2025",
    cta: "Coming soon",
    href: "",
    color: "#000000",
  },
  {
    image: Okxlogo,
    title: "Senior Product Designer",
    subtitle: "OKX",
    text: "Lead a design team to build seamless, accessible crypto investment products within a constantly evolving crypto landscape. Promoted from Product Designer (II) in 2023.",
    small: "2022",
    cta: "Coming soon",
    href: "",
    color: "#000000",
  },
  {
    title: "UX/UI Consultant",
    subtitle: "HSBC via Protiviti",
    text: "Consultant placed in HSBC Wealth team, designed end-to-end browser & app journeys to enhance stock trading and analysis experience for Asia market.",
    small: "2021",
    image: Hsbclogo,
    color: "#DB0011",
    cta: "View Work",
    href: "/work/hsbc",
  },
  {
    title: "Principal Designer",
    subtitle: "HyperAir",
    small: "2019",
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
    small: "2015",
    color: "#49CC74",
    cta: "View Work",
    href: "https://playa.hk/portfolio.html",
  },
  {
    title: "Cross Content Intern",
    subtitle: "Apple",
    small: "2012",
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
  {
    title: "OGCIO",
    subtitle: "Web Accessibility Recognition Scheme Triple Gold Award",
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
          transformOrigin: "20% 20%",
          willChange: "transform, opacity",
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
              className="object-cover"
              sizes="(min-width: 1024px) 320px, 100vw"
            />
          </div>
        )}
        <div className="space-y-2">
          <span className="text-xs font-heading uppercase tracking-wide text-secondarytext">
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

type TimelineCardProps = {
  title: string;
  subtitle?: string;
  text?: string;
  image?: string | StaticImageData;
  small?: string;
  color?: string;
  cta?: string;
  href?: string;
};

function TimelineCard({
  title,
  subtitle,
  small,
  text,
  image,
  cta,
  color,
  href = "",
}: TimelineCardProps) {
  return (
    <div className="group relative w-full border-b border-border py-8">
      {/* Full-width hover background that breaks out of container */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-primary-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
      
      {/* Background image at bottom right - only visible on hover with gradient overlay */}
      {image && (
        <div className="pointer-events-none absolute bottom-0 right-0 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="relative h-48 w-48 md:h-64 md:w-64">
            <Image
              src={image}
              alt={`${subtitle ?? title} logo`}
              fill
              className="object-contain opacity-30"
              sizes="(max-width: 768px) 192px, 256px"
            />
            {/* Gradient overlay from bottom to top for additional fade effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" aria-hidden />
          </div>
        </div>
      )}
      
      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-[30%_1fr]">
        {/* Year on left - 30% width */}
        <div className="flex flex-col items-start">
          <span className="text-4xl font-heading font-bold uppercase tracking-tight transition-colors duration-300 group-hover:text-primary-500 md:text-4xl lg:text-8xl">
            {small || ""}
          </span>
          {subtitle && (
              <h4 className="text-2xl font-heading md:text-3xl text-secondarytext">
                {subtitle}
              </h4>)}

        </div>
        
        {/* Content on right */}
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
          
          
            <h3 className="text-2xl font-heading font-semibold leading-tight md:text-3xl">
              {title}
            </h3>
          </div>
          {text && <p className="text-secondarytext">{text}</p>}
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
  const samuelNameRef = useRef<HTMLSpanElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

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

      // Set overlay initial state
      if (overlayRef.current) {
        gsap.set(overlayRef.current, {
          autoAlpha: 0,
        });
      }

      if (samuelNameRef.current) {
        const nameElement = samuelNameRef.current;
        
        // Immediately hide the element to prevent any flash
        // Use will-change to optimize for transforms
        gsap.set(nameElement, {
          autoAlpha: 0,
          scale: 3,
          willChange: "transform, opacity",
        });

        // Calculate and set initial transform position after layout is ready
        // Using double RAF to ensure layout is complete
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!samuelNameRef.current) return;
            
            const nameRect = samuelNameRef.current.getBoundingClientRect();
            const viewportCenterX = window.innerWidth / 2;
            const viewportCenterY = window.innerHeight / 2;
            
            // Calculate transform offset to center the element on screen
            const nameCenterX = nameRect.left + nameRect.width / 2;
            const nameCenterY = nameRect.top + nameRect.height / 2;
            const offsetX = viewportCenterX - nameCenterX;
            const offsetY = viewportCenterY - nameCenterY;
            
            // Set transform instantly (element remains in normal flow, no layout shift)
            // Ensure z-index is maintained during animation
            gsap.set(samuelNameRef.current, {
              x: offsetX,
              y: offsetY,
              zIndex: 100,
            });

            // Animate to natural position with overlay
            const timeline = gsap.timeline();
            
            // Fade in overlay
            if (overlayRef.current) {
              timeline.to(overlayRef.current, {
                autoAlpha: 1,
                duration: 0.3,
                ease: "power2.out",
              });
            }
            
            // Fade in and scale down name
            timeline.to(samuelNameRef.current, {
              autoAlpha: 1,
              scale: 2.5,
              duration: 0.8,
              ease: "power3.out",
            });
            
            // Move name to position and fade out overlay simultaneously
            timeline.to(
              samuelNameRef.current,
              {
                x: 0,
                y: 0,
                scale: 1,
                duration: 1.1,
                ease: "power3.inOut",
              },
              "-=0.2"
            );
            
            if (overlayRef.current) {
              timeline.to(
                overlayRef.current,
                {
                  autoAlpha: 0,
                  duration: 0.6,
                  ease: "power2.in",
                },
                "-=0.8"
              );
            }
            
            timeline.set(samuelNameRef.current, {
              willChange: "auto",
            });
          });
        });
      }

    }, pageRef);

    return () => ctx.revert();
  }, []);

  journeyCardsRef.current = [];

  return (
    <AppLayout>
      <div ref={pageRef} className="flex-1 pb-24">
        <div
          ref={overlayRef}
          className="pointer-events-none fixed inset-0 z-40 bg-background/80"
          aria-hidden
        />
        <section className="relative z-20 isolate flex min-h-[70svh] items-center overflow-visible pt-16 md:pt-24" data-gsap="fade-up">
          <div className="relative z-10 grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 text-sm font-heading uppercase tracking-[0.25em] text-secondarytext">
                <span className="h-2 w-2 rounded-full bg-primary-500" aria-hidden />
                <span>About</span>
              </div>
              <h1 className="relative text-4xl font-heading font-bold leading-tight md:text-5xl">
                Hello, my name is <span ref={samuelNameRef} className="relative z-[100] inline-block">Samuel</span>.
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
            <div className="relative">
              {/* All career items as TimelineCard */}
              {career.map((job, i) => (
                <div key={`${job.title}-timeline-${i}`} data-gsap="fade-up">
                  <TimelineCard {...job} />
                </div>
              ))}
              {/* 
              // Existing CompanyCard components hidden for now.
              {career.slice(1).map((job) => (
                <div key={job.title} data-gsap="fade-up">
                  <CompanyCard {...job} />
                </div>
              ))}
              */}
            </div>
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
                    ref={(element) => {
                      if (element) {
                        journeyCardsRef.current[index] = element;
                      }
                    }}
                    className="relative flex flex-col gap-4"
                  >
                    <span className="pointer-events-none block font-heading text-5xl uppercase tracking-tight text-primary-500/80 md:text-7xl">
                      {item.year}
                    </span>
                    <p className="text-sm font-heading uppercase tracking-[0.3em] text-secondarytext">
                      {item.title}
                    </p>
                    <p className="text-secondarytext md:text-base">
                      {item.description}
                    </p>
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
