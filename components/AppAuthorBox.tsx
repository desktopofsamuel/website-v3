import Image from "next/image";
import { Link } from "@/components/AppLink";

type AppAuthorBoxProps = {
  className?: string;
};

export default function AppAuthorBox({ className = "" }: AppAuthorBoxProps) {
  return (
    <section className={`mt-16 mb-8 ${className}`}>
      <div className="relative mx-auto max-w-3xl pt-16">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10">
          <Image
            src="/static/samuel-profile-2022.jpeg"
            alt="Portrait of Samuel Wong"
            width={80}
            height={80}
            className="h-32 w-32 rounded-full border-4 border-background object-cover"
            priority={false}
          />
        </div>

        <div className="relative rounded-sm bg-muted px-8 pb-10 pt-14 text-center">
          <div className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 -translate-y-full border-l-[12px] border-r-[12px] border-b-[18px] border-l-transparent border-r-transparent border-b-muted" />

          <p className="mt-8 mb-4 font-heading text-xl text-secondarytext">Greetings ✌️</p>
          <p className="mx-auto mb-6 max-w-2xl text-xl leading-relaxed text-foreground">
            My name is Samuel. I wrote all these articles because I love design and tech.
          </p>
          <p className="text-base font-medium text-foreground">
            <Link
              href="https://www.x.com/desktopofsamuel"
              target="_blank"
              className="underline-offset-4 hover:underline"
            >
              Twitter
            </Link>
            <span className="px-3 text-secondarytext">|</span>
            <Link
              href="https://medium.com/desktop-of-samuel"
              target="_blank"
              className="underline-offset-4 hover:underline"
            >
              Medium
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
