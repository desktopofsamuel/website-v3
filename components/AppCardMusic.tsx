"use client";

import useSWR from "swr";
import AppLink from "@/components/AppLink";
import Image from "next/image";
import fetcher from "@/lib/fetcher";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AppCardBase from "@/components/AppCardBase";

const AppCardMusic = () => {
  const { data } = useSWR("/api/top-artists", fetcher, {
    refreshInterval: 30000, // 30 seconds for testing
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
  });

  function Loader() {
    return (
      <div className="text-center flex flex-col items-center">
        <Skeleton width="80px" height="80px" circle />
        <Skeleton width="120px" height="20px" />
      </div>
    );
  }

  return (
    <>
      <AppCardBase title="🎧 Recently listening">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 items-center justify-center">
          {!data ? (
            <>
              <Loader /> <Loader /> <Loader /> <Loader />
            </>
          ) : (
            (data as any[])?.map((artist: any, i: number) => (
              <div key={i} className="text-center flex flex-col items-center">
                <AppLink
                  title={`Listen to ${artist.name} now on Spotify`}
                  target="_blank"
                  href={artist.link}
                >
                  <div className="w-20 h-20 group rounded-full relative bg-transparent transition-all duration-500 hover:bg-black">
                    <div className="absolute z-[100] top-[26px] left-[26px] opacity-0 w-[25px] h-[25px] text-white transition-all duration-500 group-hover:opacity-100">
                      <div className="relative flex justify-between w-[30px] h-[30px]">
                        <div
                          className="bg-white w-1 h-full rounded-md animate-bounce origin-bottom"
                          style={{ animationDelay: "0s" }}
                        />
                        <div
                          className="bg-white w-1 h-full rounded-md animate-bounce origin-bottom"
                          style={{ animationDelay: "-2.2s" }}
                        />
                        <div
                          className="bg-white w-1 h-full rounded-md animate-bounce origin-bottom"
                          style={{ animationDelay: "-3.7s" }}
                        />
                        <div
                          className="bg-white w-1 h-full rounded-md animate-bounce origin-bottom"
                          style={{ animationDelay: "-4.2s" }}
                        />
                      </div>
                    </div>
                    <div className="absolute overflow-hidden top-0 left-0 z-[1] w-20 h-20 rounded-full group-hover:opacity-80">
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                </AppLink>
                <h3 className="my-2 text-sm leading-tight font-semibold">
                  {artist.name}
                </h3>
              </div>
            ))
          )}
        </div>
      </AppCardBase>
    </>
  );
};

export default AppCardMusic;
