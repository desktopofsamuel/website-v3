"use client";

import React from "react";
import useSWR from "swr";
import NextLink from "./NextLink";
import Image from "next/image";
import fetcher from "@/lib/fetcher";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CardBase from "@/components/CardBase";

const AppCardFilms = () => {
  const { data } = useSWR("/api/films", fetcher, {
    refreshInterval: 60000, // 60 seconds for testing
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 15000,
  });

  function Loader() {
    return (
      <div className="h-[200px] w-full rounded overflow-hidden scale-[0.98]">
        <Skeleton height="200px" width="100%" />
      </div>
    );
  }

  const CustomCard = React.forwardRef<HTMLDivElement, any>(({ src, alt, ...rest }, ref) => (
    <div className="flex" ref={ref}>
      <Image src={src} width={200} height={300} alt={alt || ""} {...rest} />
    </div>
  ));

  CustomCard.displayName = "CustomCard";
  
  return (
    <>
      <CardBase title="🎬 Recently watching">
        <div className="flex flex-row z-[1] relative">
          {!data ? (
            <>
              <Loader /> <Loader /> <Loader /> <Loader /> <Loader />
            </>
          ) : (
            (data as any[])?.map((item: any, i: number) => (
              <div
                key={i}
                title={item.name}
                className={`w-full rounded overflow-hidden transition-all duration-100 ease-in-out scale-90 shadow-[2px_0_7px_rgba(0,0,0,0.2)] hover:z-[100] hover:rotate-1 hover:scale-100 hover:shadow-[6px_0_7px_rgba(0,0,0,0.5)] ${i > 0 ? '-ml-[30px]' : ''}`}
              >
                <NextLink href={item.link} target="_blank" variant="noeffect">
                  <CustomCard src={item.image} alt={item.name} />
                </NextLink>
              </div>
            ))
          )}
        </div>
      </CardBase>
    </>
  );
};

export default AppCardFilms;