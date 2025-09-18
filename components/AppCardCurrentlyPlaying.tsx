"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import AppCardBase from "@/components/AppCardBase"
import "react-loading-skeleton/dist/skeleton.css";

const AppCardCurrentlyPlaying = () => {
  const { data: staticData } = useSWR("/api/recently-played", fetcher, {
    refreshInterval: 30000, // 30 seconds for testing
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
  });
  
  const { data: dynamicData } = useSWR("/api/currently-playing", fetcher, {
    refreshInterval: 10000, // 10 seconds for testing
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 3000,
  });

  return (dynamicData as any)?.isPlaying ? (
   <AppCardBase title="🎧 Currently playing">
      <h2 className="leading-tight my-0 text-5xl inline-block">{(dynamicData as any).title}</h2>
      <div className="inline-block ml-4 relative w-12 h-12">
        <div className="relative flex justify-between w-6 h-6">
          <div className="bg-gray-300 w-1 h-full rounded-md animate-bounce origin-bottom" />
          <div className="bg-gray-300 w-1 h-full rounded-md animate-bounce origin-bottom" style={{ animationDelay: '-2.2s' }} />
          <div className="bg-gray-300 w-1 h-full rounded-md animate-bounce origin-bottom" style={{ animationDelay: '-3.7s' }} />
          <div className="bg-gray-300 w-1 h-full rounded-md animate-bounce origin-bottom" style={{ animationDelay: '-4.2s' }} />
        </div>
      </div>
      <p className="font-heading">{(dynamicData as any).artist}</p>
   </AppCardBase>
  ) : (
   <AppCardBase title="🎧 Last played">
      {(staticData as any[])?.map((song: any, i: number) => (
        <div key={i}>
          <h2 className="font-bold leading-tight my-0 text-5xl mb-4">{song.title}</h2>
          <p className="text-muted-foreground font-heading">{song.artist}</p>
        </div>
      ))}
    </AppCardBase>
  );
};

export default AppCardCurrentlyPlaying;