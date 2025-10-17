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
    <div className="flex items-center gap-2">
      <h2 className="font-heading font-bold leading-tight my-0 text-4xl items-center">
        {(dynamicData as any).title}
        <span className="ml-4 relative align-middle inline-block">
          <span className="relative flex justify-between w-6 h-6">
            <span className="bg-muted-foreground w-1 h-full rounded-md animate-bounce origin-bottom" />
            <span className="bg-muted-foreground w-1 h-full rounded-md animate-bounce origin-bottom" style={{ animationDelay: '-2.2s' }} />
            <span className="bg-muted-foreground w-1 h-full rounded-md animate-bounce origin-bottom" style={{ animationDelay: '-3.7s' }} />
            <span className="bg-muted-foreground w-1 h-full rounded-md animate-bounce origin-bottom" style={{ animationDelay: '-4.2s' }} />
          </span>
        </span>
      </h2>
    </div>
      <p className="font-heading text-muted-foreground">{(dynamicData as any).artist}</p>
   </AppCardBase>
  ) : (
   <AppCardBase title="🎧 Last played">
      {(staticData as any[])?.map((song: any, i: number) => (
        <div key={i}>
          <h2 className="font-heading font-bold leading-tight my-0 text-5xl mb-4">{song.title}</h2>
          <p className="text-muted-foreground font-heading">{song.artist}</p>
        </div>
      ))}
    </AppCardBase>
  );
};

export default AppCardCurrentlyPlaying;