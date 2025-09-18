import Image, { StaticImageData } from "next/image";
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
import Pepperstonelogo from "../../public/about/pepperstone-logo.svg";
import Figma from "../../public/about/figma.svg";
import Adplist from "../../public/about/adplist.svg";
import Ama from "../../public/about/Design System AMA2.jpg";
import FirmVisit from "../../public/about/Firm Visit.jpeg";

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
        title: "Interned at Apple",
        description: "Majoring in Arts in college, I took a gap year working for Apple's iTunes & App Store team. This valuable experience cultivated my interest and knowledge in digital products."
    },
    {
        title: "Co-founding an agency",
        description: "With growing freelance web & design projects, I co-founded a digital agency after graduation. Me and my team helped small businesses, entrepreneurs, and non-profits launching their projects."
    },
    {
        title: "Lead product design",
        description: "After that, I transitioned to start-up & corporations as a prdouct designer to lead design projects in travel, banking and crypto industries."
    }
]

const career = [
  {
    image: Pepperstonelogo,
    title: "Senior UX Designer",
    subtitle: "Pepperstone",
    text: "Build a crypto exchange ",
    small: "2022 - 2024",
    cta: "Coming soon",
    href: "",
    color: "#FF5000",
  },
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
  {
    image: Ama,
    subtitle: "Host of Friends of Figma HK",
    title: "Architecting design for scale ",
    small: "2025 July",
    noAnimation: true,
  },
  {
    image: Ama,
    subtitle: "Host of Friends of Figma HK",
    title: "Into Design System",
    small: "2025 July",
    noAnimation: true,
  }
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

const CompanyCard: React.FC<CompanyCardProps> = ({
  title,
  subtitle,
  small,
  text,
  image,
  cta,
  color,
  href = "",
  noAnimation = false,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 items-center group">
      <div className="h-full">
        <div
          className="w-full h-full min-h-[200px] md:min-h-[250px] rounded-2xl flex items-center justify-center bg-border transition-all duration-600 ease-in-out group-hover:[background-color:var(--hover-color)]"
          style={{
            '--hover-color': color,
          } as React.CSSProperties}
        >
          <div
            className={`transition-all duration-250 ease-in delay-200 ${
              !noAnimation && "group-hover:scale-105"
            }`}
          >
            <Image src={image} alt={`${title}`} />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg md:text-2xl font-bold font-heading leading-tight">{title}</h3>
        <div className="flex items-center text-secondarytext uppercase font-semibold my-4 font-heading text-sm">
          <p className="">{subtitle}</p>
          <p className="mx-2"> | </p>
          <p className="">{small}</p>
        </div>
        <p className="my-2 md:my-4">{text}</p>
        {cta &&
          (href === "" ? (
            <Button variant="disabled" className="w-min" aria-disabled>
              {cta}
            </Button>
          ) : (
            <Button asChild variant="outline" className="w-min">
              <Link href={href} className="no-underline">
                {cta}
              </Link>
            </Button>
          ))}
      </div>
    </div>
  );
};

type EntryCardProps = {
  title: string;
  subtitle?: string;
  text?: string;
  image?: StaticImageData;
  cta?: string;
  href?: string;
};

const EntryCard: React.FC<EntryCardProps> = ({
  title,
  text,
  image,
  subtitle,
  cta,
  href,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center border border-border rounded-lg px-2 md:px-4 py-2 md:py-6">
      {image && (
        <div className="max-w-[72px] transition-all duration-500 ease-in-out hover:opacity-50 opacity-100">
          <Image src={image} alt={`Logo of ${subtitle}`} />
        </div>
      )}
      <div className="grid grid-cols-1 w-full items-center">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
          <p className="font-heading text-md text-secondarytext my-0">{subtitle}</p>
          <p className="text-sm my-0 text-secondarytext font-heading">{text}</p>
        </div>
        <div className="" />
        <div>
          {cta && href && (
            <Button asChild variant="outline" size="sm">
              <Link href={href} className="" target="_blank">
                {cta}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AboutPage() {
  const startYear = 2015;
  const currentYear = new Date().getFullYear();
  const experienceYears = currentYear - startYear;
  return (
    <AppLayout>
      <section className="grid grid-cols-1 gap-4 md:gap-16 items-center py-4 md:py-16 mt-4 md:mt-16">
        <Image
          src={Profile2022}
          alt="Portrait of Samuel Wong"
          placeholder="blur"
          width="240"
          height="240"
          className="rounded-full"
        />
        <div className="max-w-prose flex flex-col gap-8">
          <h1 className="text-4xl font-bold leading-tight">
            Hello, my name is Samuel.
          </h1>
          <p className="text-secondarytext leading-relaxed">
            I got into product design because I&apos;m deeply passionate about
            technology and how it profoundly changes our way of living. For the
            past {experienceYears} years, I have been solving users and business
            problems and delivering delightful interfaces & experiences across
            domains like web3, finance, and travel industries.
          </p>
          <div className="flex gap-x-4">
            {socials.map((social) => (
              <Link key={social.href} href={social.href} className="text-secondarytext hover:text-primary" aria-label={social.label}>
                <social.icon size={24} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <span className="block diagonal border-gray-300 mt-2 w-full"></span>
     
      <section className="py-16">
        <h2 className="text-3xl font-bold my-10 font-heading">My Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {journey.map((item) => (
                <div key={item.title}>
                    <h3 className="text-2xl font-bold font-heading mb-4">{item.title}</h3>
                    <p className="text-secondarytext">{item.description}</p>
                </div>
            ))}
        </div>
      </section>

      <section className="py-4 md:py-16">
        <Image
          src={Profile}
          alt="Portrait of Samuel Wong"
          placeholder="blur"
          width={1920}
          height={1280}
          className="rounded-lg"
        />
      </section>

      <section id="resume" className="py-16">
        <h2 className="text-4xl font-bold">Experiences</h2>
        
        <div className="py-4">
          <h3 className="text-sm uppercase tracking-wide font-heading font-semibold text-secondarytext">Career</h3>
          <div className="grid gap-8 mt-4">
            {career.map((job) => (
              <CompanyCard key={job.title} {...job} />
            ))}
          </div>
        </div>
        
        <div className="py-4">
          <h3 className="text-sm uppercase tracking-wide font-heading font-semibold text-secondarytext">Education</h3>
          <div className="grid gap-4 mt-4">
            {education.map((edu) => (
              <EntryCard key={edu.title} {...edu} />
            ))}
          </div>
        </div>
        
        <div className="py-4">
          <h3 className="text-sm uppercase tracking-wide font-heading font-semibold text-secondarytext">Engagement</h3>
          <div className="grid gap-4 mt-4">
            {engagements.map((event) => (
              <CompanyCard key={event.title} {...event} />
            ))}
          </div>
        </div>
        
        <div className="py-4">
          <h3 className="text-sm uppercase tracking-wide font-heading font-semibold text-secondarytext">Community</h3>
          <div className="grid gap-4 mt-4">
            {community.map((comm) => (
              <EntryCard key={comm.title} {...comm} />
            ))}
          </div>
        </div>
        
        <div className="py-4">
          <h3 className="text-sm uppercase tracking-wide font-heading font-semibold text-secondarytext">Awards & recognitions</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-4">
            {awards.map((award) => (
              <EntryCard key={award.title} {...award} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-36 text-center" id="contact">
        <h2 className="text-3xl font-bold">Let&apos;s connect</h2>
        <p>
          Drop me a line if you want to say hi, or share your thoughts on my
          writings.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="mailto:desktopofsamuel@gmail.com" className="no-underline">
            Get in Touch
          </Link>
        </Button>
      </section>
    </AppLayout>
  );
}
