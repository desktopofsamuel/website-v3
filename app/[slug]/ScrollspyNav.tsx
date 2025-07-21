"use client";

import React from "react";
import Link from "next/link";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type ScrollspyNavProps = {
  headings: Heading[];
};

export default function ScrollspyNav({ headings }: ScrollspyNavProps) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -80% 0px",
      }
    );

    // Observe all headings
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="fixed top-1/2 right-4 transform -translate-y-1/2 hidden xl:block max-w-48 z-50">
      <nav className="text-sm">
        <ul className="list-none">
          {headings.map((heading, index) => (
            <li
              key={index}
              className={`border-l border-gray-200 pl-2 transition-colors ${
                activeId === heading.id
                  ? "border-primary-500 text-primary-500 font-bold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={{ paddingLeft: `${8 + (heading.level - 1) * 8}px` }}
            >
              <Link
                href={`#${heading.id}`}
                className="block py-1 hover:text-primary-500 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 