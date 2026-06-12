import AppLayout from "@/components/AppLayout";
import AppListBlog from "@/components/AppListBlog";
import AppListPortfolio from "@/components/AppListPortfolio";
import AppCardBook from "@/components/AppCardBook";
import AppCardCurrentlyPlaying from "@/components/AppCardCurrentlyPlaying";
import AppCardMusic from "@/components/AppCardMusic";
import AppCardFilms from "@/components/AppCardFilms";
import AppLink from "@/components/AppLink";
import PhotoScrollGallery from "@/components/PhotoScrollGallery";
import SidebarSection from "@/components/SidebarSection";
import { filteredPosts, filteredFeaturedWorks, filteredPhotos } from "@/lib/content";
import { TbArrowUpRight } from "react-icons/tb";

export const metadata = {
  other: {
    "follow.it-verification-code": "aYHmMlGswgxauPT7REPs",
  },
};

const services = [
  { index: "01", label: "UI/UX Design" },
  { index: "02", label: "Design System" },
  { index: "03", label: "AI Design Workflow" },
];

const EXPERIENCE_YEARS = 2026 - 2015;

export default function IndexPage() {
  const posts = filteredPosts.slice(0, 4);
  const works = filteredFeaturedWorks.slice(0, 3);
  const photos = filteredPhotos.slice(0, 8);

  return (
    <AppLayout>
      {/* Hero — full viewport height, content pinned to bottom */}
      <section className="min-h-[90dvh] flex flex-col justify-end pb-20 gap-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          00 — Samuel Wong, Hong Kong
        </p>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold font-heading leading-[0.95] text-foreground">
          UI/UX designer
          <br className="hidden sm:block" />
          crafting digital
          <br className="hidden sm:block" />
          experiences
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
          Full-stack product designer with {EXPERIENCE_YEARS}+ years delivering bespoke
          interfaces for web3, finance, and travel — currently leading product design at
          Pepperstone.
        </p>
        {/* Live data cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <AppCardBook />
          <AppCardMusic />
          <AppCardCurrentlyPlaying />
          <AppCardFilms />
        </div>
      </section>

      {/* Work */}
      <SidebarSection label="01 — Work">
        <p className="text-muted-foreground leading-relaxed mb-10 max-w-prose">
          Extensive experience delivering products in corporations and start-ups across
          finance, web3, and travel industries.
        </p>
        <div className="flex flex-col gap-8">
          {works.map((post) => (
            <AppListPortfolio key={post.slug} data={post} />
          ))}
        </div>
        <AppLink
          href="/work"
          className="mt-10 inline-flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-widest hover:opacity-60 transition-opacity"
        >
          View all work <TbArrowUpRight size={16} />
        </AppLink>
      </SidebarSection>

      {/* Writing */}
      <SidebarSection label="02 — Writing">
        <p className="text-muted-foreground leading-relaxed mb-10 max-w-prose">
          Notes on design process, technology, and productivity.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <AppListBlog key={post.slug} data={post} />
          ))}
        </div>
        <AppLink
          href="/blog"
          className="mt-10 inline-flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-widest hover:opacity-60 transition-opacity"
        >
          Read the blog <TbArrowUpRight size={16} />
        </AppLink>
      </SidebarSection>

      {/* Photo */}
      <SidebarSection label="03 — Photo">
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-prose">
          Sets of photos from cities I have visited.
        </p>
        <div className="overflow-hidden rounded-xl">
          <PhotoScrollGallery photos={photos} />
        </div>
        <AppLink
          href="/photo"
          className="mt-8 inline-flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-widest hover:opacity-60 transition-opacity"
        >
          View all journeys <TbArrowUpRight size={16} />
        </AppLink>
      </SidebarSection>

      {/* Services — editorial pill rows */}
      <SidebarSection label="04 — Services">
        <div className="flex flex-col -mt-6">
          {services.map((svc) => (
            <div
              key={svc.label}
              className="group flex items-center justify-between py-8 border-b border-border cursor-default"
            >
              <div className="flex items-baseline gap-6">
                <span className="font-mono text-xs text-muted-foreground tabular-nums w-6 shrink-0">
                  {svc.index}
                </span>
                <span className="text-3xl md:text-5xl font-bold font-heading group-hover:translate-x-1 transition-transform duration-200 ease-out">
                  {svc.label}
                </span>
              </div>
              <TbArrowUpRight
                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                size={24}
              />
            </div>
          ))}
        </div>
        <div className="pt-16">
          <p className="text-muted-foreground mb-6 max-w-prose">
            Available for freelance engagements and design consulting.
          </p>
          <AppLink
            href="mailto:desktopofsamuel@gmail.com"
            className="inline-flex items-center gap-2 text-sm font-heading font-semibold uppercase tracking-widest hover:opacity-60 transition-opacity"
          >
            Get in touch <TbArrowUpRight size={16} />
          </AppLink>
        </div>
      </SidebarSection>
    </AppLayout>
  );
}
