"use client";

import { useState, useEffect } from "react";
import AppLink from "@/components/AppLink";
import { filteredPosts, filteredWorks, filteredPhotos } from "@/lib/content";
import Profile from "../public/static/samuel-profile-2022.jpeg"
import Image from "next/image"

// Individual Bento Cards
const IntroCard = () => (
  <div className="bento-card intro-card">
    <div className="mb-4">
      <div className="avatar-container mb-4">
        <Image
          src={Profile}
          alt="Samuel profile"
          className="w-16 h-16 rounded-full object-cover"
        />
      </div>
      <h1 className="text-3xl font-bold mb-2 font-heading">Hi, I'm Samuel</h1>
      <p className="text-lg text-muted-foreground mb-4">
        UI/UX Designer based in Hong Kong, crafting digital experiences that matter.
      </p>
      <div className="flex gap-2">
        <AppLink href="/work" className="btn btn-primary">
          View Work
        </AppLink>
        <AppLink href="/about" className="btn btn-secondary">
          About Me
        </AppLink>
      </div>
    </div>
  </div>
);

const MusicCard = () => {
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [recentTracks, setRecentTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCurrentTrack = async () => {
      try {
        const response = await fetch("/api/currently-playing");
        const data = await response.json();
        if (isMounted) setCurrentTrack(data);
      } catch (error) {
        if (isMounted) setCurrentTrack({ isPlaying: false });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const fetchRecentTracks = async () => {
      try {
        const response = await fetch("/api/recently-played");
        const data = await response.json();
        if (isMounted) setRecentTracks(data);
      } catch (error) {
        if (isMounted) setRecentTracks([]);
      }
    };

    fetchCurrentTrack();
    fetchRecentTracks();

    // Refresh every 10 seconds for current track, 30 seconds for recent tracks
    const currentInterval = setInterval(fetchCurrentTrack, 10000);
    const recentInterval = setInterval(fetchRecentTracks, 30000);

    return () => {
      isMounted = false;
      clearInterval(currentInterval);
      clearInterval(recentInterval);
    };
  }, []);

  return (
    <div className="bento-card music-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">♪</span>
        </div>
        <h3 className="font-semibold">Now Playing</h3>
      </div>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      ) : currentTrack?.isPlaying ? (
        <div>
          <p className="leading-tight my-0 text-lg font-bold truncate">{currentTrack.title}</p>
          <p className="font-heading text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Playing</span>
          </div>
        </div>
      ) : recentTracks && recentTracks.length > 0 ? (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Last played</p>
          <p className="leading-tight my-0 text-lg font-bold truncate">{recentTracks[0].title}</p>
          <p className="font-heading text-sm text-muted-foreground truncate">{recentTracks[0].artist}</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground">Not currently playing</p>
        </div>
      )}
      <div className="mt-3">
        <AppLink
          href="https://open.spotify.com/user/desktopofsamuel"
          className="text-xs text-green-600 hover:text-green-800"
        >
          View my Spotify →
        </AppLink>
      </div>
    </div>
  );
};

const BookCard = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        const data = await response.json();
        setBooks(data.slice(0, 3)); // Get just the first book
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="bento-card book-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">📚</span>
        </div>
        <h3 className="font-semibold">Reading</h3>
      </div>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : books.length > 0 ? (
        <div>
          <p className="font-medium text-sm truncate">{books[0].name}</p>
          <p className="text-xs text-muted-foreground truncate">by {books[0].author}</p>
          <AppLink href={books[0].link} className="text-xs text-orange-600 hover:text-orange-800 mt-2 inline-block">
            View on Oku →
          </AppLink>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No recent reads</p>
      )}
    </div>
  );
};

const FeaturedWorkCard = () => {
  const featuredWork = filteredWorks.filter((work) => work.feature).slice(0, 4);
  const latestWork = featuredWork.length > 0 ? featuredWork : filteredWorks.slice(0, 1);
  
  return (
    <div className="bento-card work-card">
      <div className="mb-4">
        <h3 className="font-semibold mb-3">Featured Work</h3>
        <div className="space-y-3">
          {latestWork.map((work) => (
            <div key={work.slug} className="work-item">
              <AppLink href={`/work/${work.slug}`} className="block hover:opacity-80">
                <div 
                  className="w-full h-24 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: work.color ? work.color : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  {work.cover ? (
                    <img 
                      src={work.cover} 
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-center px-2">
                      {work.title}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium truncate">{work.title}</p>
                <p className="text-xs text-muted-foreground">{work.category} • {work.year}</p>
              </AppLink>
            </div>
          ))}
        </div>
        <AppLink href="/work" className="text-sm text-blue-600 hover:text-blue-800 mt-3 inline-block">
          View all projects →
        </AppLink>
      </div>
    </div>
  );
};

const RecentPostsCard = () => {
  const recentPosts = filteredPosts.slice(0, 4);
  
  return (
    <div className="bento-card posts-card">
      <div className="mb-4">
        <h3 className="font-semibold mb-3">Recent Posts</h3>
        <div className="space-y-3">
          {recentPosts.map((post) => (
            <div key={post.slug} className="post-item">
              <AppLink href={`/blog/${post.slug}`} className="block hover:opacity-80">
                <p className="text-lg font-bold font-heading mb-1 truncate">{post.title}</p>
                <p className="text-sm text-secondarytext">{post.excerpt}</p>
                {/* <p className="text-xs text-muted-foreground">
                  {post.category} • {new Date(post.date).toLocaleDateString()}
                </p> */}
              </AppLink>
            </div>
          ))}
        </div>
        <AppLink href="/blog" className="text-sm text-blue-600 hover:text-blue-800 mt-3 inline-block">
          Read more →
        </AppLink>
      </div>
    </div>
  );
};

const PhotoGalleryCard = () => {
  const recentPhotos = filteredPhotos.slice(0, 4);
  
  return (
    <div className="bento-card photo-card">
      <div className="mb-3">
        <h3 className="font-semibold mb-3">Recent Photos</h3>
        <div className="grid grid-cols-2 gap-2">
          {recentPhotos.length > 0 ? recentPhotos.map((photo, index) => (
            <AppLink key={photo.slug} href={`/photo/${photo.slug}`} className="block hover:opacity-80">
              <div className="aspect-square rounded-lg overflow-hidden relative">
                {photo.cover ? (
                  <img 
                    src={photo.cover} 
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className={`w-full h-full bg-gradient-to-br rounded-lg flex items-center justify-center ${
                      index === 0 ? 'from-green-400 to-blue-500' :
                      index === 1 ? 'from-purple-400 to-pink-500' :
                      index === 2 ? 'from-yellow-400 to-orange-500' :
                      'from-red-400 to-pink-500'
                    }`}
                  >
                    <span className="text-white text-xs font-medium text-center px-1">
                      {photo.title}
                    </span>
                  </div>
                )}
              </div>
            </AppLink>
          )) : (
            // Fallback gradients if no photos
            Array.from({ length: 4 }, (_, index) => (
              <div 
                key={index}
                className={`aspect-square rounded-lg bg-gradient-to-br ${
                  index === 0 ? 'from-green-400 to-blue-500' :
                  index === 1 ? 'from-purple-400 to-pink-500' :
                  index === 2 ? 'from-yellow-400 to-orange-500' :
                  'from-red-400 to-pink-500'
                }`}
              ></div>
            ))
          )}
        </div>
        <AppLink href="/photo" className="text-sm text-blue-600 hover:text-blue-800 mt-3 inline-block">
          View gallery →
        </AppLink>
      </div>
    </div>
  );
};

const QuickLinksCard = () => (
  <div className="bento-card links-card">
    <h3 className="font-semibold mb-3">Quick Links</h3>
    <div className="space-y-2">
      <AppLink href="/about" className="block text-sm text-secondarytext hover:text-primary">
        About
      </AppLink>
      <AppLink href="/uses" className="block text-sm text-secondarytext hover:text-primary">
        Uses
      </AppLink>
      <AppLink href="/resources" className="block text-sm text-secondarytext hover:text-primary">
        Resources
      </AppLink>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-200">
      <p className="text-xs text-secondarytext mb-2">Get in touch</p>
      <div className="flex gap-2">
        <a href="mailto:hello@desktopofsamuel.com" className="text-sm text-blue-600 hover:text-blue-800">
          Email
        </a>
        <a href="https://twitter.com/desktopofsamuel" className="text-sm text-blue-600 hover:text-blue-800">
          Twitter
        </a>
      </div>
    </div>
  </div>
);

export default function BentoGrid() {
  return (
    <div className="py-8">
      <div className="bento-container">
        <IntroCard />
        <MusicCard />
        <FeaturedWorkCard />
        <RecentPostsCard />
        <BookCard />
        <PhotoGalleryCard />
        <QuickLinksCard />
      </div>
    </div>
  );
}