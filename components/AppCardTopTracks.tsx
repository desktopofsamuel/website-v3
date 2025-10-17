"use client";

import useSWR from "swr";
import NextLink from "@/components/NextLink";
import fetcher from "@/lib/fetcher";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AppCardBase from "@/components/AppCardBase";

const AppCardTopTracks = () => {
  const { data } = useSWR("/api/top-tracks", fetcher, {
    refreshInterval: 30000, // 30 seconds for testing
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
  });

  return (
    <>
      <AppCardBase title="🎵 Top tracks">
        <div className="flex flex-col space-y-3">
          {!data ? (
            <>
              <Skeleton height="40px" />
              <Skeleton height="40px" />
              <Skeleton height="40px" />
              <Skeleton height="40px" />
              <Skeleton height="40px" />
            </>
          ) : (
            (data as any)?.tracks?.map((track: any, i: number) => (
              <div key={i} className="p-2 rounded-md hover:bg-gray-50">
                <NextLink
                  href={track.songUrl}
                  title={`Listen to ${track.title} on Spotify`}
                  target="_blank"
                >
                  <div>
                    <h3 className="text-base font-semibold leading-tight inline mr-2">
                      {track.title}
                    </h3>
                    <svg className="inline w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    by {track.artist}
                  </p>
                </NextLink>
              </div>
            ))
          )}
        </div>
      </AppCardBase>
    </>
  );
};

export default AppCardTopTracks;