"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import AppLink from "@/components/AppLink";
import { Photo } from "contentlayer/generated";

type PhotoScrollGalleryProps = {
  photos: Photo[];
};

export default function PhotoScrollGallery({ photos }: PhotoScrollGalleryProps) {
  // Add refs for the photo rows
  const leftRowRef = useRef<HTMLDivElement>(null);
  const rightRowRef = useRef<HTMLDivElement>(null);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (leftRowRef.current && rightRowRef.current) {
        // Calculate how far down the page we've scrolled
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Get the position of the photo container
        const photoContainer = document.querySelector('.photo-scroll-container');
        if (!photoContainer) return;
        
        const containerRect = photoContainer.getBoundingClientRect();
        const containerTop = containerRect.top + window.scrollY;
        const containerBottom = containerRect.bottom + window.scrollY;
        
        // Only apply the effect when the container is in view
        if (scrollPosition + windowHeight > containerTop && scrollPosition < containerBottom) {
          // Calculate how much to move based on scroll position
          const scrollPercentage = (scrollPosition + windowHeight - containerTop) / 
                                  (windowHeight + containerRect.height);
          
          // Move the rows in opposite directions
          const moveAmount = scrollPercentage * 15; // Adjust this value to control movement speed
          
          leftRowRef.current.style.transform = `translateX(-${moveAmount}%)`;
          rightRowRef.current.style.transform = `translateX(${moveAmount}%)`;
        }
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial call to position elements
    handleScroll();
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      className="photo-scroll-container relative w-full"
      style={{ height: "500px" }}
    >
      {/* First row - moves left on scroll */}
      <div 
        className="photo-row photo-row-left absolute top-0 left-0 flex gap-4 transition-transform duration-300 ease-out"
        style={{ width: "200%", height: "48%" }}
        ref={leftRowRef}
      >
        {[...photos.slice(0, 4), ...photos.slice(0, 4)].map((post, index) => (
          <div 
            key={`${post.slug}-${index}`}
            className="group relative overflow-hidden h-full rounded-md"
            style={{ minWidth: "350px" }}
          >
            <AppLink href={`/photo/${post.slug}`}>
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={post.cover || ''}
                  alt={post.title || ''}
                  fill
                  sizes="(max-width: 768px) 280px, 350px"
                  style={{ 
                    objectFit: "cover",
                    transition: "all 0.5s ease-in-out"
                  }}
                  className="group-hover:scale-105"
                />
              </div>
            </AppLink>
          </div>
        ))}
      </div>

      {/* Second row - moves right on scroll */}
      <div 
        className="photo-row photo-row-right absolute bottom-0 right-0 flex gap-4 transition-transform duration-300 ease-out"
        style={{ width: "200%", height: "48%" }}
        ref={rightRowRef}
      >
        {[...photos.slice(4, 8), ...photos.slice(4, 8)].map((post, index) => (
          <div 
            key={`${post.slug}-${index}`}
            className="group relative overflow-hidden h-full rounded-md"
            style={{ minWidth: "350px" }}
          >
            <AppLink href={`/photo/${post.slug}`}>
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={post.cover || ''}
                  alt={post.title || ''}
                  fill
                  sizes="(max-width: 768px) 280px, 350px"
                  style={{ 
                    objectFit: "cover",
                    transition: "all 0.5s ease-in-out"
                  }}
                  className="group-hover:scale-105"
                />
              </div>
            </AppLink>
          </div>
        ))}
      </div>
    </section>
  );
}